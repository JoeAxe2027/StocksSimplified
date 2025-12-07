// client/src/services/watchlistService.js
import axios from "axios";
import { API_BASE_URL } from "./api";

// Reusable axios client for all watchlist calls
const api = axios.create({
  baseURL: API_BASE_URL,
});

// GET /api/stocks/watchlist?userId=demo
export async function fetchWatchlist(userId = "demo") {
  if (!userId) {
    throw new Error("userId is required");
  }

  console.log("API base URL in watchlistService:", API_BASE_URL);

  try {
    const response = await api.get("/stocks/watchlist", {
      params: { userId },
    });

    console.log("Watchlist from API:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    throw err;
  }
}

// POST /api/stocks/watchlist
async function _add(item) {
  const { userId = "demo", symbol, companyName, notes } = item;
  const payload = { userId, symbol, companyName, notes };

  const response = await api.post("/stocks/watchlist", payload);
  console.log("Added watchlist item:", response.data);
  return response.data;
}

// DELETE /api/stocks/watchlist/:id
async function _remove(id) {
  if (!id) {
    throw new Error("Watchlist item id is required");
  }
  await api.delete(`/stocks/watchlist/${id}`);
  console.log("Removed watchlist item:", id);
}

// Export with multiple names so App/WatchlistPage keep working
export const addToWatchlist = _add;
export const addWatchlistItem = _add;

export const removeFromWatchlist = _remove;
export const removeWatchlistItem = _remove;
export const deleteWatchlistItem = _remove;


// Optional: placeholder for future edit support so existing imports don't break
export async function updateWatchlistItem(id, updates) {
    console.warn("updateWatchlistItem called, but not implemented.", {
      id,
      updates,
    });
    // No-op for now – we don't have a PUT route on the server.
    return null;
  }
  


  export default {
    fetchWatchlist,
    addToWatchlist: _add,
    removeFromWatchlist: _remove,
    updateWatchlistItem,
  };
  
