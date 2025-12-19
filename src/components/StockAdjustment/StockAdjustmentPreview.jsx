import React from "react";
import {
  Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Divider
} from "@mui/material";

export default function StockAdjustmentPreview({ data, className }) {
  const getAdjustmentTypeText = (type) => {
    return type === "ADD" ? "Stock Addition" : "Stock Reduction";
  };

  const getAdjustmentSymbol = (type) => {
    return type === "ADD" ? "+" : "-";
  };

  return (
    <Paper elevation={0} className={className} sx={{ p: 3, mt: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Stock Adjustment Voucher
        </Typography>
        <Typography variant="h6" color="primary">
          {getAdjustmentTypeText(data.adjustmentType)}
        </Typography>
      </Box>

      {/* Adjustment Details */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Typography><strong>Adjustment ID:</strong> {data.adjustmentId || "AUTO-GENERATED"}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Date:</strong> {new Date(data.adjustmentDate).toLocaleDateString()}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Warehouse:</strong> {data.warehouse ? "Main Warehouse" : "Not specified"}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Type:</strong> {getAdjustmentTypeText(data.adjustmentType)}</Typography>
        </Grid>
        {data.reference && (
          <Grid item xs={12}>
            <Typography><strong>Reference:</strong> {data.reference}</Typography>
          </Grid>
        )}
        {data.notes && (
          <Grid item xs={12}>
            <Typography><strong>Notes:</strong> {data.notes}</Typography>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ mb: 2 }} />

      {/* Items Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>Adjusted Items</Typography>
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Current Stock</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Adjustment</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Final Stock</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.category || "N/A"}</TableCell>
              <TableCell>{item.itemName || "Not selected"}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{item.currentStock || "0"}</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: data.adjustmentType === "ADD" ? "green" : "red" }}>
                {getAdjustmentSymbol(data.adjustmentType)} {item.adjustmentQty || "0"}
              </TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{item.finalStock || "0"}</TableCell>
              <TableCell>{item.reason || "Not specified"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Adjustment Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><strong>Total Items Adjusted:</strong> {data.items.length}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Adjustment Type:</strong> {getAdjustmentTypeText(data.adjustmentType)}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #ddd" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              This adjustment has been processed and recorded in the system.
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="body2"><strong>Authorized By:</strong></Typography>
            <Typography variant="body2" sx={{ mt: 3 }}>___________________________</Typography>
            <Typography variant="body2">Signature & Date</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Print footer */}
      <Typography variant="caption" sx={{ mt: 2, textAlign: "center", display: "block", color: "#666" }}>
        Generated on {new Date().toLocaleString()} | Stock Management System
      </Typography>
    </Paper>
  );
}