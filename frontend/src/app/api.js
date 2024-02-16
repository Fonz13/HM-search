import axios from "axios";

const api = axios.create({
  //baseURL: "http://0.0.0.0:8080/",
  baseURL: "https://hm-search-api.onrender.com/",
});

export default api;
