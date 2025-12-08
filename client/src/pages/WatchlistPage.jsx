import { useEffect, useState } from "react";
import { fetchWatchlist, removeFromWatchlist } from "../services/watchlistService";
import { API_BASE_URL } from "../services/api";

const DEMO_USER = "demo";

function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataMap, setDataMap] = useState({}); // symbol -> stock data

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    setLoading(true);
    try {
      const list = await fetchWatchlist(DEMO_USER);
      setItems(list || []);

      if (!list || list.length === 0) {
        setLoading(false);
        return;
      }

      // Use batch endpoint to fetch all symbols at once
      const symbols = list.map((it) => it.symbol.toUpperCase()).join(",");
      const res = await fetch(`${API_BASE_URL}/stocks/batch?symbols=${encodeURIComponent(symbols)}&range=1M`);
      const json = await res.json();
      setDataMap(json.data || {});
    } catch (err) {
      console.error("Failed to load watchlist", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, symbol) {
    try {
      await removeFromWatchlist(id, DEMO_USER);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setDataMap((prev) => {
        const next = { ...prev };
        delete next[symbol];
        return next;
      });
    } catch (err) {
      console.error("Failed to delete watchlist item", err);
    }
  }

  const formatPrice = (p) => (typeof p === "number" ? p.toFixed(2) : "—");

  return (
    <main className="page-container">
      <div className="page-header">
        <h1>Your Watchlist</h1>
        <p className="muted">Quickly scan latest prices and key stats for your saved stocks.</p>
      </div>

      {loading && <div className="loading-message">Loading watchlist…</div>}

      {!loading && items.length === 0 && (
        <div className="empty-message">Your watchlist is empty. Add stocks from the Home page.</div>
      )}

      <div className="watchlist-grid">
        {items.map((item) => {
          const s = item.symbol.toUpperCase();
          const d = dataMap[s];
          const price = d?.price ?? null;
          const change = d?.changePercent ?? null;
          const high = d?.high ?? null;
          const low = d?.low ?? null;
          const open = d?.open ?? null;

          return (
            <div className="watch-card" key={item._id}>
              <div className="watch-card-header">
                <div>
                  <div className="symbol">{s}</div>
                  <div className="company">{item.companyName || "—"}</div>
                </div>
                <div className="price-block">
                  <div className="price">${formatPrice(price)}</div>
                  <div className={`change ${change >= 0 ? "positive" : "negative"}`}>
                    {typeof change === "number" ? `${change.toFixed(2)}%` : "—"}
                  </div>
                </div>
              </div>

              <div className="watch-card-stats">
                <div className="stat">
                  <div className="label">Open</div>
                  <div className="value">{formatPrice(open)}</div>
                </div>
                <div className="stat">
                  <div className="label">High</div>
                  <div className="value">{formatPrice(high)}</div>
                </div>
                <div className="stat">
                  <div className="label">Low</div>
                  <div className="value">{formatPrice(low)}</div>
                </div>
              </div>

              <div className="watch-card-actions">
                <button className="btn btn-secondary" onClick={() => handleDelete(item._id, s)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default WatchlistPage;
