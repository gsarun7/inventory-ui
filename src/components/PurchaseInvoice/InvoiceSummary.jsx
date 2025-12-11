// InvoiceSummary.jsx
import React from "react";
import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

export default function InvoiceSummary({ data, updateMode, result }) {
  // data: purchase payload
  // result: returned inventory update results to show (optional)
  return (
    <Paper elevation={0} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" align="center">Purchase Invoice Preview</Typography>

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={8}>
          <Typography sx={{ fontWeight: "bold" }}>{data.supplier || ""}</Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <div>Invoice ID: <b>{data.invoiceId}</b></div>
          <div>Date: <b>{data.invoiceDate}</b></div>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>HSN</TableCell>
              <TableCell>Description</TableCell>
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
                <TableCell>{i + 1}</TableCell>
                <TableCell>{it.hsn}</TableCell>
                <TableCell>{it.description}</TableCell>
                <TableCell>{it.brand}</TableCell>
                <TableCell>{it.size}</TableCell>
                <TableCell>{it.grade}</TableCell>
                <TableCell>{it.qty}</TableCell>
                <TableCell>{it.unit}</TableCell>
                <TableCell>{it.rate}</TableCell>
                <TableCell>{it.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography>Rate Update Mode: <b>{updateMode}</b></Typography>
        <Typography>Total Amount: <b>₹ {data.items.reduce((s, it) => s + Number(it.amount || 0), 0).toFixed(2)}</b></Typography>
      </Box>

      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Inventory Update Result</Typography>
          <pre style={{ background: "#f5f5f5", padding: 8 }}>{JSON.stringify(result, null, 2)}</pre>
        </Box>
      )}
    </Paper>
  );
}
