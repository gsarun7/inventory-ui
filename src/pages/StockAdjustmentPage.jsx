import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Button
} from "@mui/material";
import StockAdjustmentForm from "../components/StockAdjustment/StockAdjustmentForm";
import StockAdjustmentPreview from "../components/StockAdjustment/StockAdjustmentPreview";
import apiClient from "../services/apiClient";

/* ✅ Single source of truth for empty row */
const EMPTY_ITEM = {
  categoryId: "",
  itemId: "",
  itemName: "",
  currentStock: "0",
  adjustmentQty: "",
  reason: "",
  finalStock: ""
};

export default function StockAdjustmentPage() {
  /* ---------------- State ---------------- */

  const [form, setForm] = useState({
    adjustmentId: "",
    adjustmentDate: new Date().toISOString().slice(0, 10),
    adjustmentType: "ADD", // ADD | REDUCE
    warehouse: "",
    reference: "",
    notes: "",
    items: [{ ...EMPTY_ITEM }]
  });

  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
 

  /* ---------------- Load Masters ---------------- */

  useEffect(() => {
    apiClient.get("/api/categories").then(r => setCategories(r.data));
    apiClient.get("/api/warehouses").then(r => setWarehouses(r.data));
   
  }, []);

  /* ---------------- Generic Field Update ---------------- */

  const updateField = (key, value) =>
    setForm(p => ({ ...p, [key]: value }));

  /* ---------------- Update Item Row ---------------- */

 const updateItem = (index, keyOrObject, value) => {
  const items = [...form.items];

  // ✅ Allow object updates (preferred)
  if (typeof keyOrObject === "object") {
    items[index] = { ...items[index], ...keyOrObject };
  } else {
    items[index] = { ...items[index], [keyOrObject]: value };
  }

  // ✅ Recalculate finalStock when needed
  const cs = parseFloat(items[index].currentStock || 0);
  const aq = parseFloat(items[index].adjustmentQty || 0);

  if (!isNaN(cs) && !isNaN(aq)) {
    items[index].finalStock =
      form.adjustmentType === "ADD"
        ? (cs + aq).toFixed(2)
        : Math.max(0, cs - aq).toFixed(2);
  }

  setForm(p => ({ ...p, items }));
};

  /* ---------------- Recalculate on ADD / REDUCE ---------------- */

  useEffect(() => {
  const items = form.items.map(item => {
    const cs = parseFloat(item.currentStock || 0);
    const aq = parseFloat(item.adjustmentQty || 0);

    if (!isNaN(cs) && !isNaN(aq)) {
      return {
        ...item,
        finalStock:
          form.adjustmentType === "ADD"
            ? (cs + aq).toFixed(2)
            : Math.max(0, cs - aq).toFixed(2)
      };
    }
    return item;
  });

  setForm(p => ({ ...p, items }));
}, [form.adjustmentType]);


  /* ---------------- Row Controls ---------------- */

  const addItemRow = () =>
    setForm(p => ({
      ...p,
      items: [...p.items, { ...EMPTY_ITEM }]
    }));

  const removeItemRow = index =>
    setForm(p => ({
      ...p,
      items: p.items.filter((_, i) => i !== index)
    }));

  /* ---------------- Actions ---------------- */

  const handlePrint = () => window.print();


const handleSave = async () => {
  try {
    for (const item of form.items) {
      const payload = {
        productId: item.itemId,
        warehouseId: form.warehouse,
        quantityChange:
          form.adjustmentType === "ADD"
            ? Number(item.adjustmentQty)
            : -Number(item.adjustmentQty),
        reason: item.reason || ""
      };

      await apiClient.post("/api/admin/stock/adjust", payload);
    }

    alert("Stock adjustment saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to save stock adjustment");
  }
};


  const handleClearAll = () => {
    setForm({
      adjustmentId: "",
      adjustmentDate: new Date().toISOString().slice(0, 10),
      adjustmentType: "ADD",
      warehouse: "",
      reference: "",
      notes: "",
      items: [{ ...EMPTY_ITEM }]
    });
  };

  /* ---------------- UI ---------------- */

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

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Stock Adjustment Preview
          </Typography>

          <StockAdjustmentPreview
            data={form}
            className="printable-area"
          />

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
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
