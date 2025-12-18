import axios from "axios";

export const fetchStockLedger = async (params) => {
  const res = await axios.get("/api/stock-ledger", { params });
  return res.data;
};
