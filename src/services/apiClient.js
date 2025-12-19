import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache"
  }
});

export default apiClient;
