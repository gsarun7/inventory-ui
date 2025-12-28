// const API_URL = "https://ims-backend-9y9x.onrender.com/api";
import axios from "axios";
import apiClient from "./apiClient";

//const API_URL = "http://localhost:8080/api";
const API_URL = "https://ngtbackend-e4ab.onrender.com/api";

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
};

export const getRecentActivity = async () => {
  const res = await fetch(`${API_URL}/recent-activity`);
  return res.json();
};

export const getInvoice = async () => {
  const res = await fetch(`${API_URL}/invoice`);
  return res.json();
};

export const getDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  return res.json();
};

export const addProduct = async (data) => {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE"
  });
};

export const createSale = async (sale) => {
  const res = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sale)
  });
  return res.json();
};

// export const fetchCategories = () =>
//   axios.get(`${API_URL}/categories`);

// export const fetchWarehouses = () =>
//   axios.get(`${API_URL}/warehouses`);

export const fetchCategories = () =>
  apiClient.get("/api/categories");

export const fetchProductsByCategory = (categoryId) =>
  apiClient.get("/api/products", {
    params: { categoryId }
  });

export const fetchWarehouses = () =>
  apiClient.get("/api/warehouses");

export const fetchWarehousesByProduct = (productId) =>
  apiClient.get(`/api/warehouses/by-product/${productId}`);

/* Product typeahead */
export const searchProducts = (query) =>
  apiClient.get("/api/products/search", {
    params: { query }
  });

/* Current stock */
export const fetchCurrentStock = (productId, warehouseId) =>
  apiClient.get("/api/stocks/current", {
    params: { productId, warehouseId }
  });

/* Save adjustment */
export const saveStockAdjustment = (payload) =>
  apiClient.post("/api/stock-adjustments", payload);

export default apiClient;
