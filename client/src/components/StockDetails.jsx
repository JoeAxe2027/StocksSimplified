// client/src/components/StockDetails.jsx
import React, { useState } from "react";
import { addToWatchlist } from "../services/watchlistService";

const DEMO_USER = "demo";

function StockDetails({ data }) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  // NEW: safety guard
  if (
    !data ||
    typeof data.price !== "number" ||
    typeof data.open !== "number" ||
    typeof data.high !== "number" ||
    typeof data.low !== "number" ||
    typeof data.changePercent !== "number"
  ) {
    return <p>Search for a stock to see details.</p>;
  }

  const { symbol, price, open, high, low, changePercent } = data;

  const handleAddToWatchlist = async () => {
    setAdding(true);
    setMessage("");
    try {
      await addToWatchlist(
        {
          symbol,
          companyName: symbol,
          notes: "",
        },
        DEMO_USER
      );
      setMessage(`✓ ${symbol} added to watchlist`);
      setAdded(true);
    } catch (err) {
      console.error("Failed to add to watchlist", err);
      setMessage("Already in watchlist or error occurred");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>{symbol} details</h3>
      <div className="stock-details">
        <div className="detail-card">
          <div className="detail-label">Price</div>
          <div className="detail-value">${price.toFixed(2)}</div>
        </div>
        <div className="detail-card">
          <div className="detail-label">Open</div>
          <div className="detail-value">${open.toFixed(2)}</div>
        </div>
        <div className="detail-card">
          <div className="detail-label">High</div>
          <div className="detail-value">${high.toFixed(2)}</div>
        </div>
        <div className="detail-card">
          <div className="detail-label">Low</div>
          <div className="detail-value">${low.toFixed(2)}</div>
        </div>
        <div className="detail-card">
          <div className="detail-label">Change</div>
          <div className={`detail-value ${changePercent >= 0 ? "positive" : "negative"}`}>
            {changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="watchlist-action">
        {!added && (
          <button
            className="btn btn-primary"
            onClick={handleAddToWatchlist}
            disabled={adding}
          >
            {adding ? "Adding..." : "+ Add to Watchlist"}
          </button>
        )}
        {message && <div className="feedback-msg">{message}</div>}
      </div>
    </div>
  );
}

export default StockDetails;