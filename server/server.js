// server/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const stockRoutes = require("./routes/stockRoutes");

const app = express();
// Default to 5001 so it lines up with the client config (API_BASE_URL)
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "StocksSimplified API is running" });
});

// Stock / watchlist routes
app.use("/api/stocks", stockRoutes);

// Connect to MongoDB, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
  });
