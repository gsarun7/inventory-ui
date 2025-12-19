import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, Divider, Button } from "@mui/material";
import StockAdjustmentForm from "../components/StockAdjustment/StockAdjustmentForm";
import StockAdjustmentPreview from "../components/StockAdjustment/StockAdjustmentPreview";
import apiClient from "../services/apiClient";

/**
 * Main page for manual stock adjustments
 */
export default function StockAdjustmentPage() {
  const initialItem = {
    itemId: "",
    itemName: "",
    category: "",
    currentStock: "",
    adjustmentQty: "",
    reason: "",
    finalStock: ""
  };

  const [form, setForm] = useState({
    adjustmentId: "",
    adjustmentDate: new Date().toISOString().slice(0, 10),
    adjustmentType: "ADD", // ADD | REDUCE
    warehouse: "",
    reference: "",
    notes: "",
    items: [initialItem]
  });

  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  /* Load masters */
  useEffect(() => {
    apiClient.get("/api/categories").then(r => setCategories(r.data));
    apiClient.get("/api/warehouses").then(r => setWarehouses(r.data));
  }, []);

  /* Generic field update */
  const updateField = (key, value) =>
    setForm(p => ({ ...p, [key]: value }));

  /* Update item row */
  const updateItem = (index, key, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [key]: value };

    if (key === "adjustmentQty" || key === "currentStock") {
      const cs = parseFloat(items[index].currentStock || 0);
      const aq = parseFloat(items[index].adjustmentQty || 0);

      if (!isNaN(cs) && !isNaN(aq)) {
        items[index].finalStock =
          form.adjustmentType === "ADD"
            ? (cs + aq).toFixed(2)
            : Math.max(0, cs - aq).toFixed(2);
      }
    }

    setForm(p => ({ ...p, items }));
  };

  /* Recalculate when ADD / REDUCE changes */
  useEffect(() => {
    const items = form.items.map(item => {
      const cs = parseFloat(item.currentStock || 0);
      const aq = parseFloat(item.adjustmentQty || 0);

      if (!isNaN(cs) && !isNaN(aq)) {
        item.finalStock =
          form.adjustmentType === "ADD"
            ? (cs + aq).toFixed(2)
            : Math.max(0, cs - aq).toFixed(2);
      }
      return item;
    });

    setForm(p => ({ ...p, items }));
  }, [form.adjustmentType]);

  const addItemRow = () =>
    setForm(p => ({ ...p, items: [...p.items, initialItem] }));

  const removeItemRow = index =>
    setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }));

  const handlePrint = () => window.print();

  const handleSave = () => {
    console.log("Saving stock adjustment:", form);
    alert("Stock adjustment saved successfully!");
    // TODO: POST /api/stock-adjustments
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        .adjustment-preview-root { margin-top: 16px; }
      `}</style>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Manual Stock Adjustment
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Adjust stock levels by adding or reducing quantities. Live preview updates instantly.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <StockAdjustmentForm
          form={form}
          categories={categories}
          warehouses={warehouses}
          updateField={updateField}
          updateItem={updateItem}
          addItemRow={addItemRow}
          removeItemRow={removeItemRow}
        />

        <Box className="adjustment-preview-root">
          <Typography variant="h6" sx={{ mt: 2 }}>
            Stock Adjustment Preview
          </Typography>

          <StockAdjustmentPreview data={form} className="printable-area" />

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={handleSave}>
              Save Adjustment
            </Button>

            <Button variant="contained" onClick={handlePrint}>
              Print / Save as PDF
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                setForm({
                  adjustmentId: "",
                  adjustmentDate: new Date().toISOString().slice(0, 10),
                  adjustmentType: "ADD",
                  warehouse: "",
                  reference: "",
                  notes: "",
                  items: [initialItem]
                })
              }
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
