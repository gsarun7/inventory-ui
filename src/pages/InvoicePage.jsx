import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import InvoicePreview from "../components/InvoiceForm/InvoicePreview";
import "../styles/invoice.css"; // print styles + layout

export default function InvoicePage() {
  // central state (single source of truth)
  const [form, setForm] = useState({
    invoiceNo: "868",
    invoiceDate: new Date().toISOString().slice(0, 10),
    paymentMode: "CASH",
    ewaybillno: "eway1234567890",
    destination: "BHADRAVATHI",
    motorVehicleNo: "KA-03-MN-1234",
    deleiveryDate: new Date().toISOString().slice(0, 10),
    supplierName: "NITTUR GRANITE & TILES - JD KATTE SHOWROOM",
    supplierAddress: "SY No: XXXX, GKHPS KADADAKATTE, BHADRAVATHI",
    consigneeName: "RAMYA",
    consigneeAddress: "JAMPAMPURA, INGADHALLI",
    buyerName: "RAMYA",
    buyerAddress: "JAMPAMPURA, INGADHALLI",
    gstPercent: 18,
    items: [
      // initial one row
      {
        itemId: "",
        itemName: "",
        hsn: "",
        qty: "",
        rate: "",
        per: "",
        amount: "",
        estimatedArea: "",
        usage: "",
        categoryId: "",
      },
    ],
    subtotal: "0.00",
    gstAmount: "0.00",
    grandTotal: "0.00",
    amountInWords: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [productList, setProductList] = useState([]);

  // products sample for autocomplete

  // calculate totals whenever items or gstAmount change
  useEffect(() => {
    calculateTotals(form.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.items, form.gstAmount]);

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
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        {
          name: "",
          hsn: "",
          qty: "",
          rate: "",
          per: "",
          amount: "",
          estimatedArea: "",
          usage: "",
          category: "",
        },
      ],
    }));

  const removeItem = (index) => {
    const newItems = [...form.items];
    newItems.splice(index, 1);
    setForm((p) => ({ ...p, items: newItems }));
  };

  const calculateTotals = (itemsList) => {
    let subtotal = 0;
    itemsList.forEach((it) => {
      subtotal += parseFloat(it.amount || 0);
    });
    const gstAmount = parseFloat(form.gstAmount || 0);
    const grandTotal = parseFloat((subtotal + gstAmount).toFixed(2)) || 0;

    setForm((p) => ({
      ...p,
      subtotal: subtotal.toFixed(2),
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
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const numStr = num.toString();
    if (numStr.length > 9) return "Overflow";

    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return "";
    let str = "";
    str +=
      n[1] != 0
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
        : "";
    str +=
      n[2] != 0
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
        : "";
    str +=
      n[3] != 0
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
        : "";
    str +=
      n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";
    return str.trim() + " Only";
  }

  const exportToWord = async (data) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: "center",
              children: [
                new TextRun({ text: "TAX INVOICE", bold: true, size: 28 }),
              ],
            }),

            new Paragraph(""),

            new Paragraph({
              children: [
                new TextRun({ text: "Supplier: ", bold: true }),
                new TextRun(data.supplierName),
              ],
            }),

            new Paragraph(data.supplierAddress),
            new Paragraph(""),

            new Paragraph(`Invoice No: ${data.invoiceNo}`),
            new Paragraph(`Date: ${data.invoiceDate}`),
            new Paragraph(""),

            new Table({
              width: { size: 100, type: "pct" },
              rows: [
                new TableRow({
                  children: [
                    "SL",
                    "Description",
                    "HSN",
                    "Qty",
                    "Rate",
                    "Amount",
                  ].map(
                    (h) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [new TextRun({ text: h, bold: true })],
                          }),
                        ],
                      })
                  ),
                }),

                ...data.items.map(
                  (it, i) =>
                    new TableRow({
                      children: [
                        i + 1,
                        it.name,
                        it.hsn,
                        it.qty,
                        it.rate,
                        it.amount,
                      ].map(
                        (v) =>
                          new TableCell({
                            children: [new Paragraph(String(v ?? ""))],
                          })
                      ),
                    })
                ),
              ],
            }),

            new Paragraph(""),
            new Paragraph(`Subtotal: ₹ ${data.subtotal}`),
            new Paragraph(`GST: ₹ ${data.gstAmount}`),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Grand Total: ₹ ${data.grandTotal}`,
                  bold: true,
                }),
              ],
            }),

            new Paragraph(""),
            new Paragraph({
              alignment: "right",
              children: [new TextRun("Authorised Signatory")],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Invoice_${data.invoiceNo}.docx`);
  };
  // const exportToExcel = () => {
  //   const rows = form.items.map((item, index) => ({
  //     "Sl No": index + 1,
  //     "Description": item.name,
  //     "HSN/SAC": item.hsn,
  //     "Quantity": item.qty,
  //     "Rate": item.rate,
  //     "Per": item.per,
  //     "Amount": item.amount
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(rows);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

  //   XLSX.writeFile(workbook, `Invoice_${form.invoiceNo}.xlsx`);
  //   window.alert("Excel exported successfully.");

  // };

  const exportToExcel = () => {
    const wsData = [
      ["TAX INVOICE"],
      [],
      ["Supplier", form.supplierName],
      ["Address", form.supplierAddress],
      [],
      ["Invoice No", form.invoiceNo, "", "Date", form.invoiceDate],
      [],
      ["Consignee", form.consigneeName],
      ["Address", form.consigneeAddress],
      [],
      ["SL", "Description", "HSN", "Qty", "Rate", "Amount"],
      ...form.items.map((it, i) => [
        i + 1,
        it.name,
        it.hsn,
        it.qty,
        it.rate,
        it.amount,
      ]),
      [],
      ["Subtotal", form.subtotal],
      ["GST", form.gstAmount],
      ["Grand Total", form.grandTotal],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // column widths (Description wider)
    ws["!cols"] = [
      { wch: 5 },
      { wch: 40 },
      { wch: 10 },
      { wch: 8 },
      { wch: 10 },
      { wch: 12 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    XLSX.writeFile(wb, `Invoice_${form.invoiceNo}.xlsx`);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.invoiceDate) newErrors.invoiceDate = "Invoice Date is required";
    if (!form.paymentMode?.trim())
      newErrors.paymentMode = "Payment Mode is required";
    if (!form.motorVehicleNo?.trim())
      newErrors.motorVehicleNo = "Motor Vehicle No is required";
    if (!form.supplierName?.trim())
      newErrors.supplierName = "Supplier Name is required";
    if (!form.supplierAddress?.trim())
      newErrors.supplierAddress = "Supplier Address is required";
    if (!form.consigneeName?.trim())
      newErrors.consigneeName = "Consignee Name is required";
    if (!form.consigneeAddress?.trim())
      newErrors.consigneeAddress = "Consignee Address is required";
    if (!form.buyerName?.trim()) newErrors.buyerName = "Buyer Name is required";
    if (!form.buyerAddress?.trim())
      newErrors.buyerAddress = "Buyer Address is required";

    // Check items - at least one item with description
    const hasValidItem = form.items.some((item) => item.name?.trim());
    if (!hasValidItem)
      newErrors.items = "At least one item with Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Print: we use print CSS to only show preview area
  const handlePrint = () => {
    if (!validateForm()) return;
    window.print();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Invoice Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Create professional invoices with GST calculations, item management,
          and export options.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <InvoiceForm
          form={form}
          categories={categories}
          updateField={updateField}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          errors={errors}
        />

        <Divider sx={{ marginY: 2 }} />

        <Box className="print-area">
          {" "}
          {/* .print-area CSS used to restrict printing */}
          <InvoicePreview data={form} />
        </Box>

        <Box sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() => calculateTotals(form.items, form.gstPercent)}
          >
            Recalculate
          </Button>
          <Button variant="contained" onClick={handlePrint}>
            Print / Save as PDF
          </Button>
          <Button variant="contained" color="success" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="outlined" onClick={() => exportToWord(form)}>
            Export Word
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setForm({
                invoiceNo: "",
                invoiceDate: new Date().toISOString().slice(0, 10),
                paymentMode: "",
                ewaybillno: "",
                destination: "",
                motorVehicleNo: "",
                deleiveryDate: new Date().toISOString().slice(0, 10),
                supplierName: "",
                supplierAddress: "",
                consigneeName: "",
                consigneeAddress: "",
                buyerName: "",
                buyerAddress: "",
                gstPercent: 18,
                items: [
                  {
                    name: "",
                    hsn: "",
                    qty: "",
                    rate: "",
                    per: "",
                    amount: "",
                    estimatedArea: "",
                    usage: "",
                    category: "",
                  },
                ],
                subtotal: "0.00",
                gstAmount: "0.00",
                grandTotal: "0.00",
                amountInWords: "",
              });
              setErrors({});
            }}
          >
            Clear All
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
