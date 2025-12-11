// server/controllers/stockController.js
const SavedStock = require("../models/SavedStock");

// Simple in-memory cache for symbol search results to reduce Alpha Vantage calls
const searchCache = new Map(); 
const SEARCH_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Cache for stock data to prevent throttling
const stockDataCache = new Map(); 
const STOCK_DATA_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours - stay under 25 req/day limit

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


function daysForRange(range) {
  switch (range) {
    case "1D":
      return 1;
    case "1W":
      return 7;
    case "1M":
      return 22;     // ~1 month of trading days
    case "3M":
      return 66;     // ~3 months of trading days
    case "6M":
      return 100;    
    default:
      return 22;
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
  
  // Check cache first
  const cacheKey = `${symbol}:${range}`;
  const cached = stockDataCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    console.log(`Cache HIT for ${cacheKey}`);
    return res.json(cached.data);
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not set in .env");
    return res.status(500).json({ error: "Stock API key not configured" });
  }

  try {
    // Use compact output for faster responses (returns ~100 days)
    // Use a FREE endpoint: TIME_SERIES_DAILY
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&outputsize=compact&apikey=${apiKey}`;

    console.log(`Fetching from Alpha Vantage: ${symbol} (compact)`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Alpha Vantage HTTP ${response.status}`);
    }

    const json = await response.json();

    // Handle Alpha Vantage error / info messages
    if (json["Error Message"] || json["Information"] || json["Note"]) {
      console.warn("Alpha Vantage throttle/error:", json);
      // Return stale cache if available
      if (cached && cached.data) {
        console.log(`Returning stale cache for ${cacheKey}`);
        return res.json(cached.data);
      }
      return res
        .status(502)
        .json({ error: "API rate limit reached. Please try again in a moment." });
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

    const result = {
      symbol,
      price,
      open,
      high,
      low,
      changePercent,
      history, // React chart uses history[].close
    };

    // Store in cache
    stockDataCache.set(cacheKey, {
      expires: Date.now() + STOCK_DATA_TTL_MS,
      data: result
    });

    return res.json(result);
  } catch (err) {
    console.error("Error fetching stock data from Alpha Vantage:", err);
    // Return stale cache if available on error
    if (cached && cached.data) {
      console.log(`Returning stale cache on error for ${cacheKey}`);
      return res.json(cached.data);
    }
    return res.status(500).json({ error: "Failed to load stock data" });
  }
}

// GET /api/stocks/search?keywords=INT
async function searchSymbols(req, res) {
  const keywords = (req.query.keywords || req.query.q || "").trim();
  if (!keywords) {
    return res.status(400).json({ error: "keywords query parameter is required" });
  }

  const cacheKey = keywords.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return res.json({ matches: cached.data });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error("ALPHA_VANTAGE_API_KEY is not set in .env");
    return res.status(500).json({ error: "Stock API key not configured" });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
      keywords
    )}&apikey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Alpha Vantage HTTP ${response.status}`);
    }

    const json = await response.json();

    // Handle rate limit / info responses gracefully
    if (json["Note"] || json["Information"]) {
      console.warn("Alpha Vantage search returned info/note:", json);
      // Return cached if available (even expired) or an empty list
      if (cached && cached.data) {
        return res.json({ matches: cached.data });
      }
      return res.json({ matches: [] });
    }

    const best = json["bestMatches"] || [];
    const matches = best.map((m) => ({
      symbol: m["1. symbol"] || m.symbol || "",
      name: m["2. name"] || m.name || "",
      region: m["4. region"] || m.region || "",
    }));

    // Cache results
    searchCache.set(cacheKey, { expires: Date.now() + SEARCH_TTL_MS, data: matches });

    return res.json({ matches });
  } catch (err) {
    console.error("Error searching symbols via Alpha Vantage:", err);
    // Return cached if possible
    if (cached && cached.data) return res.json({ matches: cached.data });
    return res.status(500).json({ error: "Failed to search symbols" });
  }
}


// Fetch multiple symbols in parallel using cache to minimize API calls
async function batchGetStockData(req, res) {
  const symbolsRaw = (req.query.symbols || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const range = req.query.range || "1M";

  if (!symbolsRaw || symbolsRaw.length === 0) {
    return res.status(400).json({ error: "symbols query parameter is required (comma-separated)" });
  }

  // Fetch all symbols in parallel
  const promises = symbolsRaw.map(async (symbol) => {
    // Use cache if available
    const cacheKey = `${symbol}:${range}`;
    const cached = stockDataCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      console.log(`Batch: Cache HIT for ${cacheKey}`);
      return { symbol, data: cached.data, cached: true };
    }

    // Only fetch from API if not cached
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      if (!apiKey) throw new Error("API key not configured");

      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`;
      console.log(`Batch: Fetching ${symbol} from API (compact)`);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      if (json["Note"] || json["Information"] || json["Error Message"]) {
        console.warn(`Batch: API throttle/error for ${symbol}:`, json.Note || json.Information);
        // Return stale cache if available
        if (cached && cached.data) {
          return { symbol, data: cached.data, cached: true, stale: true };
        }
        return { symbol, data: null, error: "API throttled or error" };
      }

      const series = json["Time Series (Daily)"];
      if (!series) return { symbol, data: null, error: "No data" };

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

      if (history.length === 0) return { symbol, data: null, error: "No history" };

      const opens = history.map((h) => h.open);
      const highs = history.map((h) => h.high);
      const lows = history.map((h) => h.low);
      const closes = history.map((h) => h.close);

      const open = opens[0];
      const price = closes[closes.length - 1];
      const high = Math.max(...highs);
      const low = Math.min(...lows);
      const changePercent = ((price - open) / open) * 100;

      const result = {
        symbol,
        price,
        open,
        high,
        low,
        changePercent,
        history,
      };

      // Cache it
      stockDataCache.set(cacheKey, {
        expires: Date.now() + STOCK_DATA_TTL_MS,
        data: result,
      });

      return { symbol, data: result, cached: false };
    } catch (err) {
      console.error(`Batch: Error fetching ${symbol}:`, err.message);
      if (cached && cached.data) {
        return { symbol, data: cached.data, cached: true, stale: true };
      }
      return { symbol, data: null, error: err.message };
    }
  });

  const results = await Promise.all(promises);
  const data = {};
  results.forEach((r) => {
    data[r.symbol] = r.data || null;
  });

  return res.json({ data });
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem,
  getStockData,
  searchSymbols,
  batchGetStockData,
};
