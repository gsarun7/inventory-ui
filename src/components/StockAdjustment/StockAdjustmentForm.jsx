import React from "react";
import {
  Box, Typography, TextField, Button, Grid, FormControl, InputLabel,
  Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Autocomplete
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const categories = [
  "Granite",
  "Tiles",
  "Marble",
  "Adhesive",
  "Grout",
  "Tools",
  "Accessories",
  "Other"
];

export default function StockAdjustmentForm({
  form,
  sampleItems,
  sampleWarehouses,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow
}) {
  return (
    <Box>
      {/* Header Information */}
      <Typography variant="h6" gutterBottom>Adjustment Details</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Adjustment ID"
            value={form.adjustmentId}
            onChange={(e) => updateField("adjustmentId", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Adjustment Date"
            value={form.adjustmentDate}
            onChange={(e) => updateField("adjustmentDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              value={form.adjustmentType}
              label="Adjustment Type"
              onChange={(e) => updateField("adjustmentType", e.target.value)}
            >
              <MenuItem value="ADD">Add Stock (+)</MenuItem>
              <MenuItem value="REDUCE">Reduce Stock (-)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete
            options={sampleWarehouses}
            getOptionLabel={(option) => option.name}
            value={sampleWarehouses.find(w => w.id === form.warehouse) || null}
            onChange={(e, val) => updateField("warehouse", val?.id || "")}
            renderInput={(params) => (
              <TextField {...params} label="Warehouse" />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reference/Document No."
            value={form.reference}
            onChange={(e) => updateField("reference", e.target.value)}
            placeholder="PO-001, INV-123, etc."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Notes/Remarks"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            multiline
            rows={2}
            placeholder="Reason for adjustment..."
          />
        </Grid>
      </Grid>

      {/* Items Table */}
      <Typography variant="h6" gutterBottom>Items to Adjust</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Item</TableCell>
            <TableCell>Current Stock</TableCell>
            <TableCell>Adjustment Qty</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Final Stock</TableCell>
            <TableCell width="80">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {form.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={item.category || ""}
                    onChange={(e) => updateItem(index, "category", e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Autocomplete
                  options={sampleItems}
                  getOptionLabel={(option) => option.name}
                  value={sampleItems.find(i => i.id === item.itemId) || null}
                  onChange={(e, val) => {
                    updateItem(index, "itemId", val?.id || "");
                    updateItem(index, "itemName", val?.name || "");
                    updateItem(index, "currentStock", val?.currentStock || "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" placeholder="Select item..." />
                  )}
                  sx={{ minWidth: 200 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.currentStock}
                  onChange={(e) => updateItem(index, "currentStock", e.target.value)}
                  placeholder="0"
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.adjustmentQty}
                  onChange={(e) => updateItem(index, "adjustmentQty", e.target.value)}
                  placeholder="0"
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={item.reason}
                  onChange={(e) => updateItem(index, "reason", e.target.value)}
                  placeholder="Damaged, Lost, etc."
                  sx={{ minWidth: 120 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={item.finalStock}
                  InputProps={{ readOnly: true }}
                  sx={{ width: 80, "& .MuiInputBase-input": { fontWeight: "bold" } }}
                />
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