// client/src/services/api.js
import axios from "axios";

// Base URL for the backend API
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL,
  
});

console.log("API base URL:", baseURL);

export default api;
