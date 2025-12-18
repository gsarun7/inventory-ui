import React from "react";
import {
  Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Divider
} from "@mui/material";

export default function ReturnPreview({ data, className }) {
  const getConditionColor = (condition) => {
    switch (condition) {
      case "GOOD": return "green";
      case "DAMAGED": return "orange";
      case "USED": return "blue";
      default: return "black";
    }
  };

  const getRefundMethodText = (method) => {
    switch (method) {
      case "CASH": return "Cash Refund";
      case "BANK_TRANSFER": return "Bank Transfer";
      case "CREDIT": return "Store Credit";
      case "EXCHANGE": return "Exchange";
      default: return method;
    }
  };

  return (
    <Paper elevation={0} className={className} sx={{ p: 3, mt: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Product Return Voucher
        </Typography>
        <Typography variant="h6" color="primary">
          Return ID: {data.returnId || "AUTO-GENERATED"}
        </Typography>
      </Box>

      {/* Return Details */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Typography><strong>Return Date:</strong> {new Date(data.returnDate).toLocaleDateString()}</Typography>
          <Typography><strong>Original Invoice:</strong> {data.originalInvoiceNo}</Typography>
          <Typography><strong>Invoice Date:</strong> {data.originalInvoiceDate ? new Date(data.originalInvoiceDate).toLocaleDateString() : "N/A"}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography><strong>Return Reason:</strong> {data.returnReason || "Not specified"}</Typography>
          <Typography><strong>Product Condition:</strong> <span style={{ color: getConditionColor(data.returnCondition) }}>{data.returnCondition}</span></Typography>
          <Typography><strong>Refund Method:</strong> {getRefundMethodText(data.refundMethod)}</Typography>
        </Grid>
      </Grid>

      {/* Customer Information */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f9f9f9", borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Customer Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography><strong>Name:</strong> {data.customerName}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography><strong>Phone:</strong> {data.customerPhone}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography><strong>Address:</strong> {data.customerAddress}</Typography>
          </Grid>
        </Grid>
        {data.notes && (
          <Typography sx={{ mt: 1 }}><strong>Notes:</strong> {data.notes}</Typography>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Returned Items Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>Returned Items</Typography>
      <Table size="small" sx={{ mb: 3 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Item Description</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Sold Qty</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Returned Qty</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Unit Price</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Refund Amount</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Condition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.itemName || "Not selected"}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>{item.soldQty || "0"}</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold", color: "red" }}>{item.returnQty || "0"}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>₹ {item.unitPrice || "0.00"}</TableCell>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>₹ {item.totalPrice || "0.00"}</TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <span style={{ color: getConditionColor(item.condition) }}>{item.condition}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Refund Summary */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: "#e8f5e8", borderRadius: 1, border: "1px solid #4caf50" }}>
        <Typography variant="h6" sx={{ mb: 1, color: "#2e7d32" }}>Refund Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography><strong>Total Items Returned:</strong> {data.items.length}</Typography>
            <Typography><strong>Refund Method:</strong> {getRefundMethodText(data.refundMethod)}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="h6" sx={{ color: "#2e7d32", fontWeight: "bold" }}>
              Total Refund Amount: ₹ {data.refundAmount}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #ddd" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              This return has been processed and inventory has been updated accordingly.
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography variant="body2"><strong>Processed By:</strong></Typography>
            <Typography variant="body2" sx={{ mt: 3 }}>___________________________</Typography>
            <Typography variant="body2">Signature & Date</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Customer Acknowledgment */}
      <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontStyle: "italic", textAlign: "center" }}>
          Customer Acknowledgment: I hereby acknowledge receipt of the refund and confirm that the returned items are in the condition stated above.
        </Typography>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">Customer Signature: ___________________________ Date: ____________</Typography>
        </Box>
      </Box>

      {/* Print footer */}
      <Typography variant="caption" sx={{ mt: 2, textAlign: "center", display: "block", color: "#666" }}>
        Generated on {new Date().toLocaleString()} | Return Management System
      </Typography>
    </Paper>
  );
}