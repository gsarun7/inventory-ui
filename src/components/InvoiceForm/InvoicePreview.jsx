import React from "react";
import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

/**
 * Printable invoice preview. Use the same structure as your sample.
 * Wrap this in a container with class "invoice-print" (invoice.css targets this for print).
 */
export default function InvoicePreview({ data }) {
  const blankRows = 9; // number of blank rows to make printed table height match sample

  return (
    <Paper elevation={0} className="invoice-print invoice-container">
      {/* header */}
      <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
        Tax Invoice
      </Typography>

      <Grid container sx={{ border: "1px solid #000", p: 1 }}>
        <Grid item xs={8}>
          <Typography sx={{ fontWeight: "bold" }}>{data.supplierName}</Typography>
          <Typography>{data.supplierAddress}</Typography>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <div>Invoice No: <b>{data.invoiceNo}</b></div>
          <div>Dated: <b>{data.invoiceDate}</b></div>
          <div>Mode / Terms: <b>{data.paymentMode}</b></div>
        </Grid>
      </Grid>

      {/* consignee / buyer */}
      <Grid container sx={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", p: 1 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: "bold" }}>Consignee</Typography>
          <Typography>{data.consigneeName}</Typography>
          <Typography>{data.consigneeAddress}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: "bold" }}>Buyer (if other than consignee)</Typography>
          <Typography>{data.buyerName}</Typography>
          <Typography>{data.buyerAddress}</Typography>
        </Grid>
      </Grid>

      {/* items table */}
      <Box sx={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "46%" }}>Description of Goods</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>HSN/SAC</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.items.map((it, i) => (
              <TableRow key={i}>
                <TableCell>{it.name || "\u00A0"}</TableCell>
                <TableCell>{it.hsn || "\u00A0"}</TableCell>
                <TableCell>{it.qty || "\u00A0"}</TableCell>
                <TableCell>{it.rate || "\u00A0"}</TableCell>
                <TableCell>{it.amount || "\u00A0"}</TableCell>
              </TableRow>
            ))}

            {/* blank rows to reach consistent print height */}
            {Array.from({ length: Math.max(0, blankRows - data.items.length) }).map((_, i) => (
              <TableRow key={`blank-${i}`}>
                <TableCell>&nbsp;</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* totals */}
      <Grid container sx={{ border: "1px solid #000", borderTop: "none", mt: 0 }}>
        <Grid item xs={9} sx={{ p: 1 }}>
          <Typography>Amount Chargeable (in words):</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{data.amountInWords}</Typography>
        </Grid>

        <Grid item xs={3} sx={{ p: 1, textAlign: "right" }}>
          <Typography>Subtotal: ₹ {data.subtotal}</Typography>
          <Typography>GST ({data.gstPercent}%): ₹ {data.gstAmount}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Grand Total: ₹ {data.grandTotal}</Typography>
        </Grid>
      </Grid>

      {/* footer */}
      <Grid container sx={{ border: "1px solid #000", borderTop: "none", mt: 0, p: 1 }}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: "bold" }}>Declaration</Typography>
          <Typography>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ fontWeight: "bold" }}>Company Bank Details</Typography>
          <Typography>Bank: SBI</Typography>
          <Typography>A/C No: XXXXXX</Typography>
          <Typography>IFSC: SBIN000XXXX</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography>Authorised Signatory</Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography align="center" sx={{ mt: 1, fontSize: 12 }}>
        SUBJECT TO BHADRAVATI JURISDICTION — This is a Computer Generated Invoice
      </Typography>
    </Paper>
  );
}
