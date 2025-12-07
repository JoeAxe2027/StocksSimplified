const express = require("express");
const router = express.Router();

const {
  getWatchlist,
  addToWatchlist,
  deleteWatchlistItem,
  getStockData,
} = require("../controllers/stockController");

router.get("/watchlist", getWatchlist);
router.post("/watchlist", addToWatchlist);
router.delete("/watchlist/:id", deleteWatchlistItem); // 👈 needed
router.get("/data", getStockData);

module.exports = router;
