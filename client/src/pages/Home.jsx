// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import TimelineSelector from "../components/TimelineSelector.jsx";
import StockChart from "../components/StockChart.jsx";
import StockDetails from "../components/StockDetails.jsx";
import { getStockData } from "../services/stockService.js";

function Home({ watchlist = [] }) {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedRange, setSelectedRange] = useState("1M");

  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (symbol) => {
    setSelectedSymbol(symbol.toUpperCase());
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  useEffect(() => {
    async function load() {
      if (!selectedSymbol) return;

      setLoading(true);
      setError("");

      try {
        const data = await getStockData(selectedSymbol, selectedRange);
        setStockData(data);
      } catch (err) {
        console.error("Error loading stock data:", err);
        setError("Could not load stock data. Try another symbol.");
        setStockData(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedSymbol, selectedRange]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>StocksSimplified</h1>
      <p>Temporary Home page we will plug in the real UI later.</p>

      <SearchBar initialSymbol={selectedSymbol} onSearch={handleSearch} />

      <TimelineSelector
        selectedRange={selectedRange}
        onChangeRange={handleRangeChange}
      />

      <div style={{ marginTop: "1rem" }}>
        {loading && <p>Loading stock data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && !stockData && (
          <>
            <p>No chart data yet. Search for a stock.</p>
            <p>Search for a stock to see details.</p>
          </>
        )}
        {!loading && !error && stockData && (
          <>
            <StockChart history={stockData.history} />
            <StockDetails data={stockData} />
          </>
        )}
      </div>

      <h2 style={{ marginTop: "2rem" }}>Debug watchlist data from MongoDB</h2>
      <pre
        style={{
          backgroundColor: "#f5f5f5",
          padding: "1rem",
          borderRadius: "4px",
        }}
      >
        {JSON.stringify(watchlist, null, 2)}
      </pre>
    </div>
  );
}

export default Home;
