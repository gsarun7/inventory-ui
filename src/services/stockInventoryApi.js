import apiClient from "./apiClient";

export const fetchStockInventory = ({ filters, page, size }) => {
  return apiClient.get("/api/stock-inventory", {
    params: {
      ...filters,
      page,
      size
    }
  });
};
export default apiClient;