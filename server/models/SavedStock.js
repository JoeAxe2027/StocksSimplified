const mongoose = require("mongoose");

const savedStockSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    companyName: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true 
  }
);

// Prevent duplicate symbol per user
savedStockSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model("SavedStock", savedStockSchema);
