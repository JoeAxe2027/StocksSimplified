// server/routes/stockRoutes.js
const express = require("express");
const router = express.Router();

const {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem,
  getStockData,
} = require("../controllers/stockController");

// MongoDB watchlist routes
router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist/:id", deleteWatchlistItem);

// Stock data route (Alpha Vantage)
router.get("/data", getStockData);

module.exports = router;
