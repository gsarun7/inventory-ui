// PrintInvoice.jsx
import React from "react";
import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function PrintInvoice({ data }) {
  return (
    <Paper elevation={0} sx={{ width: "210mm", margin: "auto", p: 2 }}>
      <Typography variant="h6" align="center">Purchase Invoice</Typography>

      <Grid container sx={{ mt: 1 }}>
        <Grid item xs={8}>
          <Typography sx={{ fontWeight: "bold" }}>{data.supplier || ""}</Typography>
          <Typography>{data.supplierAddress || ""}</Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <div>Invoice ID: <b>{data.invoiceId}</b></div>
          <div>Date: <b>{data.invoiceDate}</b></div>
        </Grid>
      </Grid>

      <Table size="small" sx={{ mt: 1 }}>
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

      <Typography align="right" sx={{ mt: 2 }}>
        Total: ₹ {data.items.reduce((s, it) => s + Number(it.amount || 0), 0).toFixed(2)}
      </Typography>
    </Paper>
  );
}
