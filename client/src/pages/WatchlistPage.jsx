// client/src/pages/WatchlistPage.jsx
import { useEffect, useState } from "react";
import { fetchWatchlist } from "../services/watchlistService.js";

export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWatchlist(); // uses DEFAULT_USER_ID = "demo"
        console.log("Watchlist from API (WatchlistPage):", data);
        setItems(data);
      } catch (err) {
        console.error("Error loading watchlist:", err);
        setError("Failed to load watchlist.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p>Loading watchlist...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!items.length) {
    return (
      <div>
        <h2>Your Watchlist</h2>
        <p>You don’t have any stocks saved yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Watchlist</h2>
      <table style={{ borderCollapse: "collapse", minWidth: "450px" }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                textAlign: "left",
                padding: "0.5rem",
              }}
            >
              Symbol
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                textAlign: "left",
                padding: "0.5rem",
              }}
            >
              Company
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                textAlign: "left",
                padding: "0.5rem",
              }}
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((stock) => (
            <tr key={stock._id}>
              <td
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "0.5rem",
                }}
              >
                {stock.symbol}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "0.5rem",
                }}
              >
                {stock.companyName}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "0.5rem",
                }}
              >
                {stock.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
