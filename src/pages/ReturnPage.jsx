import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, Divider, Button } from "@mui/material";
import ReturnForm from "../components/Returns/ReturnForm";
import ReturnPreview from "../components/Returns/ReturnPreview";

/**
 * Main page for product returns after sale: contains form and live preview
 * Handles customer returns, inventory restocking, and refund processing.
 */
export default function ReturnPage() {
  const [form, setForm] = useState({
    returnId: "",
    returnDate: new Date().toISOString().slice(0, 10),
    originalInvoiceNo: "",
    originalInvoiceDate: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    returnReason: "",
    returnCondition: "GOOD", // GOOD, DAMAGED, USED
    refundMethod: "CASH",
    refundAmount: "0.00",
    notes: "",
    items: [
      { itemId: "", itemName: "", soldQty: "", returnQty: "", unitPrice: "", totalPrice: "", condition: "GOOD", category: "" }
    ]
  });

  // Sample sold items for autocomplete - replace with actual sales API later
  const sampleSoldItems = [
    { id: 1, name: "POLISHED GRANITE SLABS (18MM)", soldQty: 50, unitPrice: 60.17, invoiceNo: "INV-001" },
    { id: 2, name: "LATICRETE 315 PLUS (20KG)", soldQty: 10, unitPrice: 92.23, invoiceNo: "INV-002" },
    { id: 3, name: "SPACER", soldQty: 100, unitPrice: 497.81, invoiceNo: "INV-001" },
    { id: 4, name: "MARBLE TILES", soldQty: 30, unitPrice: 45.50, invoiceNo: "INV-003" }
  ];

  // Sample invoices for reference
  const sampleInvoices = [
    { id: "INV-001", date: "2025-12-15", customer: "John Doe", total: 15000.00 },
    { id: "INV-002", date: "2025-12-16", customer: "Jane Smith", total: 8500.00 },
    { id: "INV-003", date: "2025-12-17", customer: "Bob Johnson", total: 12000.00 }
  ];

  // Update field generic
  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // Update an item row
  const updateItem = (index, key, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [key]: value };

    // Auto compute total price when quantity or unit price changes
    if (key === "returnQty" || key === "unitPrice") {
      const returnQty = parseFloat(items[index].returnQty || 0);
      const unitPrice = parseFloat(items[index].unitPrice || 0);

      if (!isNaN(returnQty) && !isNaN(unitPrice)) {
        items[index].totalPrice = (returnQty * unitPrice).toFixed(2);
      }
    }

    setForm((p) => ({ ...p, items }));
  };

  // Auto-fill customer details when invoice is selected
  useEffect(() => {
    if (form.originalInvoiceNo) {
      const selectedInvoice = sampleInvoices.find(inv => inv.id === form.originalInvoiceNo);
      if (selectedInvoice) {
        setForm((p) => ({
          ...p,
          originalInvoiceDate: selectedInvoice.date,
          customerName: selectedInvoice.customer,
          refundAmount: selectedInvoice.total.toFixed(2)
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.originalInvoiceNo]);

  // Recalculate total refund amount whenever items change
  useEffect(() => {
    const totalRefund = form.items.reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice || 0));
    }, 0);

    setForm((p) => ({
      ...p,
      refundAmount: totalRefund.toFixed(2)
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.items]);

  const addItemRow = () => {
    setForm((p) => ({
      ...p,
      items: [...p.items, { itemId: "", itemName: "", soldQty: "", returnQty: "", unitPrice: "", totalPrice: "", condition: "GOOD", category: "" }]
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

  // Handle save return
  const handleSave = () => {
    // Here you would typically send the data to your backend API
    console.log("Saving product return:", form);
    alert("Product return processed successfully! (Implement API call)");
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
        .return-preview-root { margin-top: 16px; }
      `}</style>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Product Return Processing</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Process customer returns, restock inventory, and issue refunds. Live preview below updates instantly.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <ReturnForm
          form={form}
          sampleSoldItems={sampleSoldItems}
          sampleInvoices={sampleInvoices}
          updateField={updateField}
          updateItem={updateItem}
          addItemRow={addItemRow}
          removeItemRow={removeItemRow}
        />

        <Box className="return-preview-root">
          <Typography variant="h6" sx={{ mt: 2 }}>Return Voucher Preview</Typography>
          <ReturnPreview data={form} className="printable-area" />

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={handleSave}>
              Process Return
            </Button>

            <Button variant="contained" onClick={handlePrint}>
              Print Voucher
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setForm({
                  returnId: "",
                  returnDate: new Date().toISOString().slice(0, 10),
                  originalInvoiceNo: "",
                  originalInvoiceDate: "",
                  customerName: "",
                  customerPhone: "",
                  customerAddress: "",
                  returnReason: "",
                  returnCondition: "GOOD",
                  refundMethod: "CASH",
                  refundAmount: "0.00",
                  notes: "",
                  items: [{ itemId: "", itemName: "", soldQty: "", returnQty: "", unitPrice: "", totalPrice: "", condition: "GOOD", category: "" }]
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