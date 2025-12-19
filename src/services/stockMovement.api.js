import apiClient from "./apiClient";

export const fetchStockLedger = async (params) => {
  const res = await apiClient.get("/api/stock-ledger", { params });
  return res.data;
};

export default apiClient;