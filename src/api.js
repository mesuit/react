import axios from "axios";

// Always include /api so calls match your backend routes
const BASE =
  process.env.REACT_APP_BACKEND_URL || "https://bava.onrender.com/api";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 🔥 important for cross-origin CORS requests
});

// Attach token if present
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
