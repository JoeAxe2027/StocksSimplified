// client/src/components/StockChart.jsx
import React from "react";

function StockChart({ history }) {
  if (!history || history.length === 0) {
    return <p>No chart data yet. Search for a stock.</p>;
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Price history</h3>
      <ul>
        {history.map((point) => (
          <li key={point.date}>
            {point.date}: ${point.close.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockChart;
