// server/routes/stockRoutes.js
const express = require("express");
const router = express.Router();

const {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem,
  getStockData,
  searchSymbols,
  batchGetStockData,
} = require("../controllers/stockController");

// MongoDB watchlist routes
router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist/:id", deleteWatchlistItem);

// Stock data route (Alpha Vantage)
router.get("/data", getStockData);
// Symbol search proxy (SYMBOL_SEARCH)
router.get("/search", searchSymbols);
// Batch stock data endpoint (minimizes API calls)
router.get("/batch", batchGetStockData);

module.exports = router;
