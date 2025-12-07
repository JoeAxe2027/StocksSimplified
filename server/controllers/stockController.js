// server/controllers/stockController.js
const SavedStock = require("../models/SavedStock");

// ---------------- WATCHLIST (MongoDB) ----------------

// GET /api/stocks/watchlist?userId=demo
async function getWatchlist(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId query parameter is required" });
  }

  try {
    const items = await SavedStock.find({ userId }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return res.status(500).json({ error: "Failed to fetch watchlist" });
  }
}

// POST /api/stocks/watchlist
async function addToWatchlist(req, res) {
  const { userId, symbol, companyName, notes } = req.body;

  if (!userId || !symbol || !companyName) {
    return res.status(400).json({
      error: "userId, symbol and companyName are required",
    });
  }

  try {
    const doc = await SavedStock.create({
      userId,
      symbol,
      companyName,
      notes: notes || "",
    });

    return res.status(201).json(doc);
  } catch (err) {
    if (err && err.code === 11000) {
      // Unique index on userId+symbol
      return res
        .status(409)
        .json({ error: "This symbol is already saved for this user" });
    }

    console.error("Error saving watchlist item:", err);
    return res.status(500).json({ error: "Failed to save watchlist item" });
  }
}

// DELETE /api/stocks/watchlist/:id
async function deleteWatchlistItem(req, res) {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ error: "Watchlist item id (params.id) is required" });
  }

  try {
    const deleted = await SavedStock.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    if (err?.name === "CastError") {
      return res.status(400).json({ error: "Invalid watchlist item id" });
    }

    console.error("Error deleting watchlist item:", err);
    return res.status(500).json({ error: "Failed to delete watchlist item" });
  }
}

// ---------------- STOCK DATA (Alpha Vantage) ----------------

// Helper: how many trading days for each range
function daysForRange(range) {
  switch (range) {
    case "1D":
      return 1;
    case "1W":
      return 7;      // about 1 week
    case "3M":
      return 66;     // ~3 months of trading days
    case "1M":
    default:
      return 22;     // ~1 month of trading days
  }
}

// GET /api/stocks/data?symbol=AAPL&range=1M
async function getStockData(req, res) {
  const symbolRaw = req.query.symbol;
  const range = req.query.range || "1M";

  if (!symbolRaw) {
    return res
      .status(400)
      .json({ error: "symbol query parameter is required" });
  }

  const symbol = symbolRaw.toUpperCase();
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not set in .env");
    return res.status(500).json({ error: "Stock API key not configured" });
  }

  try {
    // Use a FREE endpoint: TIME_SERIES_DAILY
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&outputsize=compact&apikey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Alpha Vantage HTTP ${response.status}`);
    }

    const json = await response.json();

    // Handle Alpha Vantage error / info messages
    if (json["Error Message"] || json["Information"] || json["Note"]) {
      console.error("Unexpected Alpha Vantage response:", json);
      return res
        .status(502)
        .json({ error: "Upstream stock provider returned an error" });
    }

    const series = json["Time Series (Daily)"];
    if (!series) {
      console.error("Unexpected Alpha Vantage response shape:", json);
      return res
        .status(502)
        .json({ error: "No time series data returned from provider" });
    }

    // Sort dates ascending and slice to the range we want
    const allDatesAsc = Object.keys(series).sort();
    const maxDays = daysForRange(range);
    const selectedDates = allDatesAsc.slice(-maxDays);

    const history = selectedDates.map((date) => {
      const bar = series[date];
      return {
        date,
        open: parseFloat(bar["1. open"]),
        high: parseFloat(bar["2. high"]),
        low: parseFloat(bar["3. low"]),
        close: parseFloat(bar["4. close"]),
      };
    });

    if (history.length === 0) {
      return res
        .status(502)
        .json({ error: "No usable stock data returned from provider" });
    }

    const opens = history.map((h) => h.open);
    const highs = history.map((h) => h.high);
    const lows = history.map((h) => h.low);
    const closes = history.map((h) => h.close);

    const open = opens[0];
    const price = closes[closes.length - 1];
    const high = Math.max(...highs);
    const low = Math.min(...lows);
    const changePercent = ((price - open) / open) * 100;

    return res.json({
      symbol,
      price,
      open,
      high,
      low,
      changePercent,
      history, // React chart uses history[].close
    });
  } catch (err) {
    console.error("Error fetching stock data from Alpha Vantage:", err);
    return res.status(500).json({ error: "Failed to load stock data" });
  }
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem,
  getStockData,
};
