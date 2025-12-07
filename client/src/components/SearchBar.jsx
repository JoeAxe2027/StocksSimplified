// client/src/components/SearchBar.jsx
import React, { useState } from "react";

function SearchBar({ initialSymbol = "AAPL", onSearch }) {
  const [symbol, setSymbol] = useState(initialSymbol);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <label style={{ marginRight: "0.5rem" }}>
        Ticker:
        <input
          style={{ marginLeft: "0.5rem" }}
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;