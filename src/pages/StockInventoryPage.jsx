import InventoryFilters from "../components/StockInventory/InventoryFilters";
import InventoryTable from "../components/StockInventory/InventoryTable";
import { useEffect, useState } from "react";
import { Box, Typography, Container, Paper, Divider } from "@mui/material";
import axios from "axios";

export default function StockInventoryPage() {
  const [filters, setFilters] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!filters) return;

    axios.get("/api/stocks", {
      params: {
        ...filters,
        page,
        size
      }
    }).then(res => {
      setRows(res.data.content);
      setTotal(res.data.totalElements);
    });
  }, [filters, page, size]);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Stock Inventory</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          View and manage your current stock levels across all categories and warehouses.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <InventoryFilters
          onChange={(f) => {
            setFilters(f);
            setPage(0); // reset page on filter change
          }}
        />

        <InventoryTable
          rows={rows}
          page={page}
          size={size}
          total={total}
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      </Paper>
    </Container>
  );
}