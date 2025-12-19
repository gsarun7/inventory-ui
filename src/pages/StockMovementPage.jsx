import { useState } from "react";
import { Paper, Typography, Container, Divider } from "@mui/material";
import StockMovementFilters from "../components/StockMovement/StockMovementFilters";
import StockSummary from "../components/StockMovement/StockSummary";
import StockMovementTable from "../components/StockMovement/StockMovementTable";
import { fetchStockLedger } from "../services/stockMovement.api";

export default function StockMovementPage() {
  const [filters, setFilters] = useState({});
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);

const handleSearch = async (f) => {
  const res = await fetchStockLedger(f);

  setFilters(f);
  setRows(res.content);   // ✅ FIX
  setSummary(null);       // or compute separately
};

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Stock Movement Activity
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Track and analyze stock movements, transfers, and inventory changes across your warehouses.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <StockMovementFilters onSearch={handleSearch} />

        {summary && <StockSummary summary={summary} />}

        <StockMovementTable rows={rows} />
      </Paper>
    </Container>
  );
}
