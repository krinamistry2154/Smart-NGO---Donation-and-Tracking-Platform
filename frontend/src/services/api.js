import axios from "axios";
import { config } from "../config";

const baseURL = config.apiBaseUrl;

if (!baseURL) {
  console.warn("API baseURL is empty. Set VITE_API_BASE_URL in your environment.");
}

const api = axios.create({
  baseURL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;