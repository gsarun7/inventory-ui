import { useRef, useState, useEffect } from "react";
import { Box, Button, Divider } from "@mui/material";
import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import InvoicePreview from "../components/InvoiceForm/InvoicePreview";
import "../styles/invoice.css"; // print styles + layout

export default function InvoicePage() {
  // central state (single source of truth)
  const [form, setForm] = useState({
    invoiceNo: "868",
    invoiceDate: new Date().toISOString().slice(0, 10),
    paymentMode: "CASH",
    supplierName: "NITTUR GRANITE & TILES - JD KATTE SHOWROOM",
    supplierAddress: "SY No: XXXX, GKHPS KADADAKATTE, BHADRAVATHI",
    consigneeName: "RAMYA",
    consigneeAddress: "JAMPAMPURA, INGADHALLI",
    buyerName: "RAMYA",
    buyerAddress: "JAMPAMPURA, INGADHALLI",
    gstPercent: 18,
    items: [
      // initial one row
      { name: "", hsn: "", qty: "", rate: "", per: "", amount: "" },
    ],
    subtotal: "0.00",
    gstAmount: "0.00",
    grandTotal: "0.00",
    amountInWords: "",
  });

  // products sample for autocomplete
  const productList = [
    { name: "POLISHED GRANITE SLABS (18MM)", hsn: "68022310", rate: 60.17 },
    { name: "LATICRETE 315 PLUS (20KG)", hsn: "32141000", rate: 92.23 },
    { name: "SPACER", hsn: "35069900", rate: 497.81 },
    { name: "ULTRA TECH - GROUT", hsn: "32141000", rate: 224.35 },
    { name: "SUPER SET - 300ML", hsn: "34021140", rate: 115.0 },
    { name: "BOND TILE SLOW", hsn: "38244000", rate: 1016.95 },
  ];

  // calculate totals whenever items or gstPercent change
  useEffect(() => {
    calculateTotals(form.items, form.gstPercent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.items, form.gstPercent]);

  const updateField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const updateItem = (index, key, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [key]: value };

    // auto compute amount when qty or rate changes
    const qty = parseFloat(newItems[index].qty || 0);
    const rate = parseFloat(newItems[index].rate || 0);
    if (!isNaN(qty) && !isNaN(rate)) {
      newItems[index].amount = (qty * rate).toFixed(2);
    } else {
      newItems[index].amount = newItems[index].amount || "";
    }

    setForm((p) => ({ ...p, items: newItems }));
  };

  const addItem = () =>
    setForm((p) => ({ ...p, items: [...p.items, { name: "", hsn: "", qty: "", rate: "", per: "", amount: "" }] }));

  const removeItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm((p) => ({ ...p, items: newItems }));
  };

  const calculateTotals = (itemsList, gstPercent = form.gstPercent) => {
    let subtotal = 0;
    itemsList.forEach((it) => {
      subtotal += parseFloat(it.amount || 0);
    });
    const gstAmount = parseFloat(((subtotal * gstPercent) / 100).toFixed(2)) || 0;
    const grandTotal = parseFloat((subtotal + gstAmount).toFixed(2)) || 0;

    setForm((p) => ({
      ...p,
      subtotal: subtotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      amountInWords: numberToWordsIndian(Math.round(grandTotal)),
    }));
  };

  // convert numbers to Indian words (simple implementation)
  function numberToWordsIndian(num) {
    if (!num && num !== 0) return "";
    if (num === 0) return "Zero Only";

    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
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
    return str.trim() + " Only";
  }

  // Print: we use print CSS to only show preview area
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h2 style={{ marginBottom: 10 }}>Invoice Builder</h2>

      <InvoiceForm
        form={form}
        productList={productList}
        updateField={updateField}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
      />

      <Divider sx={{ marginY: 2 }} />

      <Box className="print-area"> {/* .print-area CSS used to restrict printing */}
        <InvoicePreview data={form} />
      </Box>

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button variant="outlined" onClick={() => calculateTotals(form.items, form.gstPercent)}>
          Recalculate
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          Print / Save as PDF
        </Button>
      </Box>
    </Box>
  );
}
