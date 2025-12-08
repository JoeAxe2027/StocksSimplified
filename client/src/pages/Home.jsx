// client/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import TimelineSelector from "../components/TimelineSelector.jsx";
import StockChart from "../components/StockChart.jsx";
import StockDetails from "../components/StockDetails.jsx";
import { getStockData } from "../services/stockService.js";
import { addToWatchlist } from "../services/watchlistService.js";
import "../styles/global.css";

const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 230.45, change: 2.35 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 428.92, change: -1.20 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.58, change: 3.10 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 191.73, change: 1.85 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.32, change: 5.42 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 238.45, change: -2.15 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 515.88, change: 4.20 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 287.64, change: 1.95 },
];

function Home({ watchlist = [] }) {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [selectedRange, setSelectedRange] = useState("1M");

  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [watchlistItems, setWatchlistItems] = useState(watchlist);
  const [addedMessage, setAddedMessage] = useState("");
  const [popularStocks, setPopularStocks] = useState([]);
  const [popularStocksLoading, setPopularStocksLoading] = useState(true);

  const handleSearch = (symbol) => {
    setSelectedSymbol(symbol.toUpperCase());
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  const handleStockClick = (symbol) => {
    handleSearch(symbol);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToWatchlist = async (e, stock) => {
    e.stopPropagation();
    const isAlreadyAdded = watchlistItems.some((item) => item.symbol === stock.symbol);
    if (!isAlreadyAdded) {
      const newItem = {
        userId: "demo",
        symbol: stock.symbol,
        companyName: stock.name,
        notes: "",
      };
      try {
        const result = await addToWatchlist(newItem);
        setWatchlistItems([...watchlistItems, result]);
        setAddedMessage(`${stock.symbol} added to watchlist!`);
        setTimeout(() => setAddedMessage(""), 3000);
      } catch (err) {
        console.error("Failed to add stock to watchlist:", err);
        setAddedMessage(`Error adding ${stock.symbol} to watchlist`);
        setTimeout(() => setAddedMessage(""), 3000);
      }
    } else {
      setAddedMessage(`${stock.symbol} is already in your watchlist.`);
      setTimeout(() => setAddedMessage(""), 3000);
    }
  };

  // Fetch popular stocks data from API
  useEffect(() => {
    async function loadPopularStocks() {
      setPopularStocksLoading(true);
      const stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX"];
      
      try {
        const stocksData = await Promise.all(
          stocks.map(symbol =>
            getStockData(symbol, "1M")
              .then(data => ({
                symbol: data.symbol,
                name: symbol, // Fallback - you might want a separate endpoint for company names
                price: data.price,
                change: data.changePercent,
              }))
              .catch(err => {
                console.error(`Failed to fetch ${symbol}:`, err);
                return null;
              })
          )
        );
        
        // Filter out failed requests and set state
        const validStocks = stocksData.filter(stock => stock !== null);
        setPopularStocks(validStocks);
      } catch (err) {
        console.error("Error loading popular stocks:", err);
      } finally {
        setPopularStocksLoading(false);
      }
    }

    loadPopularStocks();
  }, []);

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

      <div className="popular-stocks-section">
        <h2>Popular Stocks</h2>
        {addedMessage && <div className="watchlist-message">{addedMessage}</div>}
        {popularStocksLoading && <div className="loading-message">📊 Loading popular stocks...</div>}
        {!popularStocksLoading && popularStocks.length > 0 && (
          <div className="stocks-table-wrapper">
            <table className="stocks-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {popularStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="stock-row clickable"
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <td className="symbol-cell">
                      <span className="stock-symbol">{stock.symbol}</span>
                    </td>
                    <td className="price-cell">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className={`change-cell ${stock.change >= 0 ? "positive" : "negative"}`}>
                      <span className="change-indicator">
                        {stock.change >= 0 ? "▲" : "▼"}
                      </span>
                      {Math.abs(stock.change).toFixed(2)}%
                    </td>
                    <td className="action-cell">
                      <button
                        className="add-watchlist-btn"
                        onClick={(e) => handleAddToWatchlist(e, stock)}
                        title="Add to watchlist"
                      >
                        ★ Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!popularStocksLoading && popularStocks.length === 0 && (
          <div className="empty-message">Failed to load popular stocks. Please try again later.</div>
        )}
      </div>

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