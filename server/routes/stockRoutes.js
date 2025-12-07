// server/routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// GET all saved stocks for a user
router.get("/watchlist", stockController.getWatchlist);

// ADD a stock to the watchlist
router.post("/watchlist", stockController.addStock);

// UPDATE a saved stock
router.put("/watchlist/:id", stockController.updateStock);

// DELETE a saved stock
router.delete("/watchlist/:id", stockController.deleteStock);

module.exports = router;
