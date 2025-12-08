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
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-group">
        <input
          className="search-input"
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍 Search</button>
      </div>
    </form>
  );
}

export default SearchBar;