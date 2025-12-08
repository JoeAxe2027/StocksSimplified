// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import TimelineSelector from "../components/TimelineSelector.jsx";
import StockChart from "../components/StockChart.jsx";
import StockDetails from "../components/StockDetails.jsx";
import { getStockData } from "../services/stockService.js";
import "../styles/global.css";

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
    <div className="home-container">
      <div className="page-header">
        <h1>Stock Market Dashboard</h1>
        <p>Search and analyze real-time stock data with interactive charts</p>
      </div>

      <div className="controls-section">
        <div className="search-wrapper">
          <label htmlFor="stock-search">Search Stock Symbol</label>
          <SearchBar initialSymbol={selectedSymbol} onSearch={handleSearch} />
        </div>

        <div className="timeline-wrapper">
          <label htmlFor="timeline">Time Period</label>
          <TimelineSelector
            selectedRange={selectedRange}
            onChangeRange={handleRangeChange}
          />
        </div>
      </div>

      {loading && <div className="loading-message">📊 Loading stock data...</div>}

      {error && <div className="error-message">❌ {error}</div>}

      {!loading && !error && !stockData && (
        <div className="empty-message">
          <p>💡 No chart data yet.</p>
          <p>Search for a stock symbol to see live data and analysis</p>
        </div>
      )}

      {!loading && !error && stockData && (
        <>
          <div className="chart-section">
            <div className="chart-container">
              <StockChart history={stockData.history} />
            </div>
          </div>

          <div className="data-section">
            <StockDetails data={stockData} />
          </div>
        </>
      )}

      <div className="debug-section">
        <h2>Watchlist Data</h2>
        <div className="debug-content">
          <pre>{JSON.stringify(watchlist, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default Home;