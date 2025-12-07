const SavedStock = require("../models/SavedStock");

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.query.userId || "demo"; 
    const stocks = await SavedStock.find({ userId }).sort({ createdAt: -1 });
    res.json(stocks);
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    res.status(500).json({ message: "Server error fetching watchlist" });
  }
};

// POST /api/stocks/watchlist
// body: { userId, symbol, companyName, notes }
exports.addStock = async (req, res) => {
  try {
    const { userId = "demo", symbol, companyName, notes } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    const stock = await SavedStock.create({
      userId,
      symbol,
      companyName,
      notes
    });

    res.status(201).json(stock);
  } catch (err) {
    console.error("Error adding stock:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Stock is already in the watchlist for this user" });
    }
    res.status(500).json({ message: "Server error adding stock" });
  }
};

// PUT /api/stocks/watchlist/:id
// body: { notes?, companyName? }
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    if (req.body.notes !== undefined) updates.notes = req.body.notes;
    if (req.body.companyName !== undefined)
      updates.companyName = req.body.companyName;

    const updated = await SavedStock.findByIdAndUpdate(id, updates, {
      new: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Saved stock not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ message: "Server error updating stock" });
  }
};

// DELETE /api/stocks/watchlist/:id
exports.deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SavedStock.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Saved stock not found" });
    }

    res.json({ message: "Stock removed from watchlist" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ message: "Server error deleting stock" });
  }
};
