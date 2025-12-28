import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://ngtbackend-e4ab.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache"
  }
});

export default apiClient;
