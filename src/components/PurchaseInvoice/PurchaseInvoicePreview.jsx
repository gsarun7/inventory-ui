import React from "react";
import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

/**
 * Clean MUI paper-style invoice preview (Option 2)
 * - data: form state
 * - className: pass "printable-area" to enable printing
 */
export default function PurchaseInvoicePreview({ data, className = "" }) {
  const totalAmount = data.items.reduce((s, it) => s + Number(it.amount || 0), 0);

  return (
    <Paper elevation={1} className={className + " purchase-preview"} sx={{ mt: 1, p: 2 }}>
      <Typography variant="h6" align="center">Purchase Invoice</Typography>

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={8}>
          <Typography sx={{ fontWeight: "bold" }}>{data.supplier || "Supplier Name"}</Typography>
          <Typography>{data.supplierAddress}</Typography>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <div>Invoice ID: <b>{data.invoiceId}</b></div>
          <div>Date: <b>{data.invoiceDate}</b></div>
          <div>Vehicle: <b>{data.vehicleNo}</b></div>
          <div>Delivery: <b>{data.deliveryLocation}</b></div>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>HSN</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.items.map((it, i) => (
              <TableRow key={i}>
                <TableCell>{it.description || "\u00A0"}</TableCell>
                <TableCell>{it.hsn || "\u00A0"}</TableCell>
                <TableCell>{it.brand || "\u00A0"}</TableCell>
                <TableCell>{it.size || "\u00A0"}</TableCell>
                <TableCell>{it.grade || "\u00A0"}</TableCell>
                <TableCell>{it.qty || "\u00A0"}</TableCell>
                <TableCell>{it.unit || "\u00A0"}</TableCell>
                <TableCell>{it.rate || "\u00A0"}</TableCell>
                <TableCell>{it.amount || "\u00A0"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Grid container sx={{ mt: 2, alignItems: "center" }}>
        <Grid item xs={8}>
          <Typography variant="body2"><strong>Remarks:</strong> {data.remarks}</Typography>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <Typography>Subtotal: ₹ {data.subtotal}</Typography>
          <Typography>GST ({data.gstPercent}%): ₹ {((Number(data.subtotal || 0) * Number(data.gstPercent || 0)) / 100).toFixed(2)}</Typography>
          <Typography variant="h6">Grand Total: ₹ {data.grandTotal}</Typography>
          <Typography variant="caption" display="block">({data.amountInWords})</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
