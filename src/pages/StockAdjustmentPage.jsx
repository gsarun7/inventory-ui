import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Paper, Typography, Divider, Button } from "@mui/material";
import StockAdjustmentForm from "../components/StockAdjustment/StockAdjustmentForm";
import StockAdjustmentPreview from "../components/StockAdjustment/StockAdjustmentPreview";

/**
 * Main page for manual stock adjustments: contains form (left) and live preview (below)
 * Allows adding or reducing stock quantities with reasons and references.
 */
export default function StockAdjustmentPage() {
  const [form, setForm] = useState({
    adjustmentId: "",
    adjustmentDate: new Date().toISOString().slice(0, 10),
    adjustmentType: "ADD", // "ADD" or "REDUCE"
    warehouse: "",
    reference: "",
    notes: "",
    items: [
      { itemId: "", itemName: "", currentStock: "", adjustmentQty: "", reason: "", finalStock: "", category: "" }
    ]
  });

  // Sample inventory items for autocomplete - replace with actual inventory API later
  const sampleItems = [
    { id: 1, name: "POLISHED GRANITE SLABS (18MM)", currentStock: 150, unit: "SFT" },
    { id: 2, name: "LATICRETE 315 PLUS (20KG)", currentStock: 25, unit: "PCS" },
    { id: 3, name: "SPACER", currentStock: 500, unit: "PCS" },
    { id: 4, name: "MARBLE TILES", currentStock: 200, unit: "SFT" },
    { id: 5, name: "GRANITE COUNTERTOPS", currentStock: 10, unit: "PCS" }
  ];

  // Sample warehouses
  const sampleWarehouses = [
    { id: 1, name: "Main Warehouse" },
    { id: 2, name: "Showroom Warehouse" },
    { id: 3, name: "Factory Warehouse" }
  ];

  // Update field generic
  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // Update an item row
  const updateItem = (index, key, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [key]: value };

    // Auto compute final stock when adjustment quantity changes
    if (key === "adjustmentQty" || key === "currentStock") {
      const currentStock = parseFloat(items[index].currentStock || 0);
      const adjustmentQty = parseFloat(items[index].adjustmentQty || 0);
      const adjustmentType = form.adjustmentType;

      if (!isNaN(currentStock) && !isNaN(adjustmentQty)) {
        if (adjustmentType === "ADD") {
          items[index].finalStock = (currentStock + adjustmentQty).toFixed(2);
        } else if (adjustmentType === "REDUCE") {
          items[index].finalStock = Math.max(0, currentStock - adjustmentQty).toFixed(2);
        }
      }
    }

    setForm((p) => ({ ...p, items }));
  };

  // When adjustment type changes, recalculate all final stocks
  useEffect(() => {
    const items = form.items.map(item => {
      const currentStock = parseFloat(item.currentStock || 0);
      const adjustmentQty = parseFloat(item.adjustmentQty || 0);

      if (!isNaN(currentStock) && !isNaN(adjustmentQty)) {
        if (form.adjustmentType === "ADD") {
          item.finalStock = (currentStock + adjustmentQty).toFixed(2);
        } else if (form.adjustmentType === "REDUCE") {
          item.finalStock = Math.max(0, currentStock - adjustmentQty).toFixed(2);
        }
      }
      return item;
    });

    setForm((p) => ({ ...p, items }));
  }, [form.adjustmentType]);

  const addItemRow = () => {
    setForm((p) => ({
      ...p,
      items: [...p.items, { itemId: "", itemName: "", currentStock: "", adjustmentQty: "", reason: "", finalStock: "", category: "" }]
    }));
  };

  const removeItemRow = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm((p) => ({ ...p, items }));
  };

  // Print only preview area by class name .printable-area
  const handlePrint = () => {
    window.print();
  };

  // Handle save adjustment
  const handleSave = () => {
    // Here you would typically send the data to your backend API
    console.log("Saving stock adjustment:", form);
    alert("Stock adjustment saved successfully! (Implement API call)");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Print CSS is injected here to keep everything self-contained */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
        }

        /* small tweak so preview looks good on screen */
        .adjustment-preview-root { margin-top: 16px; }
      `}</style>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Manual Stock Adjustment</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Adjust stock levels by adding or reducing quantities. Live preview below updates instantly.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <StockAdjustmentForm
          form={form}
          sampleItems={sampleItems}
          sampleWarehouses={sampleWarehouses}
          updateField={updateField}
          updateItem={updateItem}
          addItemRow={addItemRow}
          removeItemRow={removeItemRow}
        />

        <Box className="adjustment-preview-root">
          <Typography variant="h6" sx={{ mt: 2 }}>Stock Adjustment Preview</Typography>
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
              onClick={() => {
                setForm({
                  adjustmentId: "",
                  adjustmentDate: new Date().toISOString().slice(0, 10),
                  adjustmentType: "ADD",
                  warehouse: "",
                  reference: "",
                  notes: "",
                  items: [{ itemId: "", itemName: "", currentStock: "", adjustmentQty: "", reason: "", finalStock: "", category: "" }]
                });
              }}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}