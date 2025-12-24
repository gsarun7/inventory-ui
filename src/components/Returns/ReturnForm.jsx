import React from "react";
import {
  Box, Typography, TextField, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Autocomplete
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import WarehouseSelect from "../common/WarehouseSelect";
import { fetchCurrentStock } from "../../services/api.js";

export default function ReturnForm({
  form,
  categories,
  warehouses,
  soldItems,
  invoices,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow
}) {
  return (
    <Box>
      {/* Return Details */}
      <Typography variant="h6" gutterBottom>Return Information</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Return ID"
            value={form.returnId}
            onChange={(e) => updateField("returnId", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Return Date"
            value={form.returnDate}
            onChange={(e) => updateField("returnDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={form.warehouse ?? ""}
              label="Warehouse"
              onChange={(e) =>
                updateField("warehouse", e.target.value)
              }
            >
              {warehouses.map(w => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={invoices}
            getOptionLabel={(option) => `${option.id} - ${option.customer}`}
            value={invoices.find(inv => inv.id === form.originalInvoiceNo) || null}
            onChange={(e, val) => updateField("originalInvoiceNo", val?.id || "")}
            renderInput={(params) => (
              <TextField {...params} label="Original Invoice" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Original Invoice Date"
            value={form.originalInvoiceDate}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Customer Information */}
      <Typography variant="h6" gutterBottom>Customer Details</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Customer Name"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Phone Number"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Address"
            value={form.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      {/* Return Details */}
      <Typography variant="h6" gutterBottom>Return Details</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Return Reason</InputLabel>
            <Select
              value={form.returnReason}
              label="Return Reason"
              onChange={(e) => updateField("returnReason", e.target.value)}
            >
              <MenuItem value="DAMAGED">Product Damaged</MenuItem>
              <MenuItem value="WRONG_ITEM">Wrong Item Delivered</MenuItem>
              <MenuItem value="NOT_SATISFIED">Not Satisfied</MenuItem>
              <MenuItem value="SIZE_ISSUE">Size/Fit Issue</MenuItem>
              <MenuItem value="QUALITY_ISSUE">Quality Issue</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Product Condition</InputLabel>
            <Select
              value={form.returnCondition}
              label="Product Condition"
              onChange={(e) => updateField("returnCondition", e.target.value)}
            >
              <MenuItem value="GOOD">Good Condition</MenuItem>
              <MenuItem value="DAMAGED">Damaged</MenuItem>
              <MenuItem value="USED">Used</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Refund Method</InputLabel>
            <Select
              value={form.refundMethod}
              label="Refund Method"
              onChange={(e) => updateField("refundMethod", e.target.value)}
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="CREDIT">Store Credit</MenuItem>
              <MenuItem value="EXCHANGE">Exchange</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Refund Amount"
            value={`₹ ${form.refundAmount}`}
            InputProps={{ readOnly: true }}
            sx={{ "& .MuiInputBase-input": { fontWeight: "bold", color: "green" } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            multiline
            rows={2}
            placeholder="Any additional notes about the return..."
          />
        </Grid>
      </Grid>

      {/* Returned Items Table */}
      <Typography variant="h6" gutterBottom>Items Being Returned</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>

            <TableCell>Category</TableCell>

            <TableCell>Product</TableCell>

            <TableCell>Sold Qty</TableCell>
            <TableCell>Return Qty</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Total Refund</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell width="80">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {form.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>

                <CategorySelect
                  value={item.categoryId}
                  onChange={(newCategoryId) => {
                    if (newCategoryId !== item.categoryId) {
                      updateItem(index, "categoryId", newCategoryId);

                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <ProductSelect
                  categoryId={item.categoryId}
                  value={item.itemId ?? null}   // 👈 must be null, NOT ""
                  onChange={async (productId, product) => {
                    if (!product) {
                      updateItem(index, {
                        itemId: "",
                        itemName: "",
                        // soldQty: 1,
                        // unitPrice: 0,
                        // totalPrice: 0
                      });
                      return;
                    }
                    const res = await fetchCurrentStock(productId, form.warehouse);
                    updateItem(index, {
                      itemId: productId,
                      itemName: product.name,
                      // soldQty: res.data.toString(),
                      // unitPrice: res.data.toString(),
                      // totalPrice:res.data.toString()
                    });
                  }}
                />


              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  value={item.soldQty}
                  InputProps={{ readOnly: true }}
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.returnQty}
                  onChange={(e) => updateItem(index, "returnQty", e.target.value)}
                  placeholder="0"
                  sx={{ width: 80 }}
                  inputProps={{ max: item.soldQty }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={`₹ ${item.unitPrice}`}
                  InputProps={{ readOnly: true }}
                  sx={{ width: 100 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={`₹ ${item.totalPrice}`}
                  InputProps={{ readOnly: true }}
                  sx={{ width: 100, "& .MuiInputBase-input": { fontWeight: "bold" } }}
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={item.condition}
                    onChange={(e) => updateItem(index, "condition", e.target.value)}
                  >
                    <MenuItem value="GOOD">Good</MenuItem>
                    <MenuItem value="DAMAGED">Damaged</MenuItem>
                    <MenuItem value="USED">Used</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeItemRow(index)}
                  disabled={form.items.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItemRow}
        >
          Add Another Item
        </Button>
      </Box>
    </Box>
  );
}