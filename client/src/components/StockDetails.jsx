// client/src/components/StockDetails.jsx
import React from "react";

function StockDetails({ data }) {
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

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>{symbol} details</h3>
      <p>Price: ${price.toFixed(2)}</p>
      <p>Open: ${open.toFixed(2)}</p>
      <p>High: ${high.toFixed(2)}</p>
      <p>Low: ${low.toFixed(2)}</p>
      <p>Change: {changePercent.toFixed(2)}%</p>
    </div>
  );
}

export default StockDetails;