// client/src/services/watchlistService.js
import api from "./api";

// For now I used a simple demo userId.
// Later you could pass a real userId from auth.
const DEFAULT_USER_ID = "demo";

// GET /api/stocks/watchlist?userId=demo
export async function fetchWatchlist(userId = DEFAULT_USER_ID) {
  try {
    const response = await api.get("/api/stocks/watchlist", {
      params: { userId },
    });
    return response.data; // array of saved stocks
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
}

// POST /api/stocks/watchlist
// payload: { symbol, companyName?, notes? }
export async function addToWatchlist({
  symbol,
  companyName = "",
  notes = "",
  userId = DEFAULT_USER_ID,
}) {
  try {
    const response = await api.post("/api/stocks/watchlist", {
      userId,
      symbol,
      companyName,
      notes,
    });
    return response.data; // newly created stock document
  } catch (error) {
    console.error("Error adding stock to watchlist:", error);

    // If backend sent a message (e.g. duplicate), bubble it up
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

// PUT /api/stocks/watchlist/:id
// updates notes and/or companyName
export async function updateWatchlistItem(id, updates) {
  try {
    const response = await api.put(`/api/stocks/watchlist/${id}`, updates);
    return response.data; // updated stock document
  } catch (error) {
    console.error("Error updating watchlist item:", error);
    throw error;
  }
}

// DELETE /api/stocks/watchlist/:id
export async function removeFromWatchlist(id) {
  try {
    const response = await api.delete(`/api/stocks/watchlist/${id}`);
    return response.data; // { message: "Stock removed from watchlist" }
  } catch (error) {
    console.error("Error removing stock from watchlist:", error);
    throw error;
  }
}
