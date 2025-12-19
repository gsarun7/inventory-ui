import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Paper, Typography, Divider, Button } from "@mui/material";
import PurchaseInvoiceForm from "../components/PurchaseInvoice/PurchaseInvoiceForm";
import PurchaseInvoicePreview from "../components/PurchaseInvoice/PurchaseInvoicePreview";

/**
 * Main page: contains form (left) and live preview (below)
 * Print button is placed under preview and prints only the preview area.
 */
export default function PurchaseInvoicePage() {
  const [form, setForm] = useState({
    invoiceId: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    supplier: "",
    supplierAddress: "",
    vehicleNo: "",
    deliveryLocation: "",
    paymentMode: "CASH",
    remarks: "",
    gstAmount: "0.00",
    items: [
      { hsn: "", description: "", brand: "", size: "", grade: "", qty: "", unit: "", rate: "", amount: "", category: "" }
    ],
    subtotal: "0.00",
    grandTotal: "0.00",
    amountInWords: ""
  });

  // simple sample product list for autocomplete - replace with inventory snapshot from backend later
  const sampleProducts = [
    { id: 1, name: "POLISHED GRANITE SLABS (18MM)", brand: "MONOLITH", hsn: "68022310", size: "1200x1800", grade: "PRE-I", rate: 60.17, unit: "SFT" },
    { id: 2, name: "LATICRETE 315 PLUS (20KG)", brand: "MYK", hsn: "32141000", size: "", grade: "", rate: 92.23, unit: "PCS" },
    { id: 3, name: "SPACER", brand: "GENERIC", hsn: "35069900", size: "", grade: "", rate: 497.81, unit: "PCS" },
  ];

  // update field generic
  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // update an item row
  const updateItem = (index, key, value) => {
    const items = [...form.items];
    items[index] = { ...items[index], [key]: value };

    // auto compute amount when qty/rate change
    if (key === "qty" || key === "rate") {
      const qty = parseFloat(items[index].qty || 0);
      const rate = parseFloat(items[index].rate || 0);
      items[index].amount = (!isNaN(qty) && !isNaN(rate)) ? (qty * rate).toFixed(2) : "";
    }
    setForm((p) => ({ ...p, items }));
  };

  const addItemRow = () => {
    setForm((p) => ({ ...p, items: [...p.items, { hsn: "", description: "", brand: "", size: "", grade: "", qty: "", unit: "", rate: "", amount: "", category: "" }] }));
  };

  const removeItemRow = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm((p) => ({ ...p, items }));
  };

  // recalc totals and amount in words whenever items or gstAmount change
  useEffect(() => {
    const subtotal = form.items.reduce((s, it) => s + (Number(it.amount || 0)), 0);
    const gst = parseFloat(form.gstAmount || 0);
    const grand = subtotal + gst;
    setForm((p) => ({
      ...p,
      subtotal: subtotal.toFixed(2),
      grandTotal: grand.toFixed(2),
      amountInWords: numberToWordsIndian(Math.round(grand))
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.items, form.gstAmount]);

  // print only preview area by class name .printable-area
  const handlePrint = () => {
    window.print();
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
        .purchase-preview-root { margin-top: 16px; }
      `}</style>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Purchase Invoice (Entry)</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Fill invoice details and items. Live preview below updates instantly.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <PurchaseInvoiceForm
          form={form}
          sampleProducts={sampleProducts}
          updateField={updateField}
          updateItem={updateItem}
          addItemRow={addItemRow}
          removeItemRow={removeItemRow}
        />

        <Box className="purchase-preview-root">
          <Typography variant="h6" sx={{ mt: 2 }}>Purchase Invoice Preview</Typography>
          <PurchaseInvoicePreview data={form} className="printable-area" />

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="outlined" onClick={() => {
              alert("Preview saved locally (no backend). Implement API call to persist.");
            }}>
              Save (No Backend)
            </Button>

            <Button variant="contained" onClick={handlePrint}>
              Print / Save as PDF
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setForm({
                  invoiceId: "",
                  invoiceDate: new Date().toISOString().slice(0, 10),
                  supplier: "",
                  supplierAddress: "",
                  vehicleNo: "",
                  deliveryLocation: "",
                  paymentMode: "",
                  remarks: "",
                  gstAmount: "0.00",
                  items: [{ hsn: "", description: "", brand: "", size: "", grade: "", qty: "", unit: "", rate: "", amount: "", category: "" }],
                  subtotal: "0.00",
                  grandTotal: "0.00",
                  amountInWords: ""
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

/* Number to words - Indian format (simple) */
function numberToWordsIndian(num) {
  if (!num && num !== 0) return "";
  if (num === 0) return "Zero Only";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
    "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const numStr = num.toString();
  if (numStr.length > 9) return "Overflow";
  const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
  if (!n) return "";
  let str = "";
  str += n[1] != 0 ? (a[Number(n[1])] || (b[n[1][0]] + " " + a[n[1][1]])) + " Crore " : "";
  str += n[2] != 0 ? (a[Number(n[2])] || (b[n[2][0]] + " " + a[n[2][1]])) + " Lakh " : "";
  str += n[3] != 0 ? (a[Number(n[3])] || (b[n[3][0]] + " " + a[n[3][1]])) + " Thousand " : "";
  str += n[4] != 0 ? (a[Number(n[4])] || (b[n[4][0]] + " " + a[n[4][1]])) + " " : "";
  return (str.trim() + " Only");
}
