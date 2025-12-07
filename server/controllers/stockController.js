// server/controllers/stockController.js
const SavedStock = require("../models/SavedStock");

// --- Watchlist: GET /api/stocks/watchlist?userId=demo ---
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

// --- Watchlist: POST /api/stocks/watchlist ---
async function addToWatchlist(req, res) {
  const { userId, symbol, companyName, notes } = req.body;

  if (!userId || !symbol || !companyName) {
    return res
      .status(400)
      .json({ error: "userId, symbol and companyName are required" });
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
    console.error("Error saving watchlist item:", err);
    return res.status(500).json({ error: "Failed to save watchlist item" });
  }
}

// --- Watchlist: DELETE /api/stocks/watchlist/:id ---
async function deleteWatchlistItem(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Watchlist item id is required" });
  }

  try {
    const deleted = await SavedStock.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }

    return res.json({
      message: "Watchlist item deleted",
      item: deleted,
    });
  } catch (err) {
    console.error("Error deleting watchlist item:", err);
    return res.status(500).json({ error: "Failed to delete watchlist item" });
  }
}

// ---------- Fake stock data for charts/details ----------

function buildMockHistory(symbol, days) {
  const history = [];
  const now = new Date();

  const base =
    100 +
    (symbol.charCodeAt(0) +
      (symbol.charCodeAt(1) || 0) +
      (symbol.charCodeAt(2) || 0)) %
      40;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const offset = (i % 5) * 1.5;
    const close = base + offset;

    history.push({
      date: d.toISOString().slice(0, 10),
      close,
    });
  }

  return history;
}

// GET /api/stocks/data?symbol=AAPL&range=1M
function getStockData(req, res) {
  const symbolRaw = req.query.symbol || "AAPL";
  const range = req.query.range || "1M";
  const symbol = symbolRaw.toUpperCase();

  let days;
  switch (range) {
    case "1D":
      days = 1;
      break;
    case "1W":
      days = 7;
      break;
    case "3M":
      days = 90;
      break;
    case "1M":
    default:
      days = 30;
      break;
  }

  const history = buildMockHistory(symbol, days);
  const closes = history.map((p) => p.close);
  const open = closes[0];
  const price = closes[closes.length - 1];
  const high = Math.max(...closes);
  const low = Math.min(...closes);
  const changePercent = ((price - open) / open) * 100;

  return res.json({
    symbol,
    price,
    open,
    high,
    low,
    changePercent,
    history,
  });
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem, // 👈 make sure this is exported
  getStockData,
};
