// client/src/services/stockService.js
import axios from "axios";
import { API_BASE_URL } from "./api";


// Returns mock data from our Node controller.
export async function getStockData(symbol, range = "1M") {
  const trimmed = (symbol || "").trim().toUpperCase();
  if (!trimmed) {
    throw new Error("Symbol is required");
  }

  const params = { symbol: trimmed, range };
  console.log("Requesting stock data:", params);
  console.log("API base URL inside stockService:", API_BASE_URL);

  const response = await axios.get(`${API_BASE_URL}/stocks/data`, {
    params,
  });

  console.log("Raw stock data from API:", response.data);

  // Guard: if we somehow got HTML or a string back, don't try to render details.
  if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) {
    throw new Error("Unexpected response format from stock API");
  }

  return response.data;
}

export default {
  getStockData,
};
