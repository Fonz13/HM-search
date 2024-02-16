import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://0.0.0.0:8000/" // Development server local
      : "https://hm-search-api.onrender.com/", // Production serve, serverless function on vercel
});

export default api;
