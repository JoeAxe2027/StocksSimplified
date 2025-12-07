// client/src/pages/WatchlistPage.jsx
/*import { useEffect, useState } from "react";
import {
  fetchWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from "../services/watchlistService";

const DEMO_USER = "demo";

function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    symbol: "",
    companyName: "",
    notes: "",
  });

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    try {
      const data = await fetchWatchlist(DEMO_USER);
      console.log("Watchlist from API (WatchlistPage):", data);
      setItems(data);
    } catch (err) {
      console.error("Failed to load watchlist", err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.symbol) return;

    try {
      const created = await addToWatchlist(form, DEMO_USER);
      // API returns the created document, so append it
      setItems((prev) => [...prev, created]);
      setForm({ symbol: "", companyName: "", notes: "" });
    } catch (err) {
      console.error("Failed to add stock to watchlist", err);
    }
  }

  async function handleDelete(id) {
    try {
      await removeFromWatchlist(id, DEMO_USER);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete watchlist item", err);
    }
  }

  // (Optional) we could add editing of notes later using updateWatchlistItem()

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem" }}>
      <h1>StocksSimplified</h1>
      <h2>Your Watchlist</h2>

      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <input
          name="symbol"
          placeholder="Symbol (e.g. AAPL)"
          value={form.symbol}
          onChange={handleChange}
        />
        <input
          name="companyName"
          placeholder="Company name"
          value={form.companyName}
          onChange={handleChange}
        />
        <input
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Symbol</th>
            <th style={{ textAlign: "left" }}>Company</th>
            <th style={{ textAlign: "left" }}>Notes</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.symbol}</td>
              <td>{item.companyName}</td>
              <td>{item.notes}</td>
              <td>
                <button type="button" onClick={() => handleDelete(item._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="4">No items yet – add one above.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

export default WatchlistPage;

*/