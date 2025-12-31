import React from "react";
import { fetchCurrentStock } from "../../services/api.js";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Tooltip,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import ClearIcon from "@mui/icons-material/Clear";

export default function StockAdjustmentForm({
  form,
  warehouses,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow,
}) {
  // Copy adjustment ID to clipboard
  const copyAdjustmentId = () => {
    if (form.adjustmentId) {
      navigator.clipboard.writeText(form.adjustmentId);
      alert("Adjustment ID copied to clipboard!");
    }
  };

  return (
    <Box>
      {/* ================= Header ================= */}
      <Typography variant="h6" gutterBottom>
        Adjustment Details
      </Typography>

      <Grid container spacing={2} mb={3}>
        {/* ✅ Smart Adjustment ID Field */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Adjustment ID"
            value={form.adjustmentId || ""}
            placeholder={!form.adjustmentId ? "Auto-generated on save" : ""}
            InputProps={{
              readOnly: true,
              style: {
                backgroundColor: form.adjustmentId ? "#e3f2fd" : "#f5f5f5",
                fontWeight: form.adjustmentId ? "bold" : "normal",
                color: form.adjustmentId ? "#1976d2" : "#666",
                fontSize: form.adjustmentId ? "1.05rem" : "1rem",
              },
              startAdornment: (
                <InputAdornment position="start">
                  {form.adjustmentId ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <AutorenewIcon color="disabled" fontSize="small" />
                  )}
                </InputAdornment>
              ),
              endAdornment: form.adjustmentId && (
                <InputAdornment position="end">
                  <Tooltip title="Copy adjustment ID">
                    <IconButton size="small" onClick={copyAdjustmentId}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Chip
                    label="Auto"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            helperText={
              form.adjustmentId
                ? "✅ Adjustment ID generated"
                : "✨ Will be auto-generated when you save"
            }
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="date"
            label="Adjustment Date"
            InputLabelProps={{ shrink: true }}
            value={form.adjustmentDate}
            onChange={(e) => updateField("adjustmentDate", e.target.value)}
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
              <MenuItem value="ADD">Add (+)</MenuItem>
              <MenuItem value="REDUCE">Reduce (-)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="warehouse-label">Warehouse</InputLabel>
            <Select
              labelId="warehouse-label"
              label="Warehouse"
              value={form.warehouse || ""}
              onChange={(e) => updateField("warehouse", e.target.value)}
              endAdornment={
                <IconButton
                  size="small"
                  sx={{
                    marginRight: 3,
                    visibility: form.warehouse ? "visible" : "hidden",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateField("warehouse", "");
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              }
            >
              {warehouses.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reference / Document No"
            value={form.reference}
            onChange={(e) => updateField("reference", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      {/* ================= Items ================= */}
      <Typography variant="h6" gutterBottom>
        Items to Adjust
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Current</TableCell>
            <TableCell>Adjust</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Final</TableCell>
            <TableCell width={60} />
          </TableRow>
        </TableHead>

        <TableBody>
          {form.items.map((item, index) => (
            <TableRow key={index}>
              {/* -------- Category -------- */}
              <TableCell width={180}>
                <CategorySelect
                  value={item.categoryId}
                  onChange={(newCategoryId) => {
                    if (newCategoryId !== item.categoryId) {
                      updateItem(index, "categoryId", newCategoryId);
                    }
                  }}
                />
              </TableCell>

              {/* -------- Product -------- */}
              <TableCell width={240}>
                <ProductSelect
                  categoryId={item.categoryId}
                  value={item.itemId}
                  onChange={async (productId, product) => {
                    if (!product) {
                      updateItem(index, {
                        itemId: "",
                        itemName: "",
                        currentStock: "0",
                        finalStock: "",
                      });
                      return;
                    }

                    const res = await fetchCurrentStock(
                      productId,
                      form.warehouse
                    );

                    updateItem(index, {
                      itemId: productId,
                      itemName: product.name,
                      currentStock: res.data.toString(),
                      adjustmentQty: "",
                      finalStock: res.data.toString(),
                    });
                  }}
                />
              </TableCell>

              {/* -------- Current -------- */}
              <TableCell width={90}>
                <TextField
                  size="small"
                  value={item.currentStock}
                  InputProps={{ readOnly: true }}
                />
              </TableCell>

              {/* -------- Adjustment -------- */}
              <TableCell width={90}>
                <TextField
                  size="small"
                  type="number"
                  value={item.adjustmentQty}
                  onChange={(e) =>
                    updateItem(index, "adjustmentQty", e.target.value)
                  }
                />
              </TableCell>

              {/* -------- Reason -------- */}
              <TableCell>
                <TextField
                  size="small"
                  value={item.reason}
                  onChange={(e) => updateItem(index, "reason", e.target.value)}
                />
              </TableCell>

              {/* -------- Final -------- */}
              <TableCell width={90}>
                <TextField
                  size="small"
                  value={item.finalStock}
                  InputProps={{ readOnly: true }}
                />
              </TableCell>

              {/* -------- Delete -------- */}
              <TableCell>
                <IconButton
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

      <Box mt={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addItemRow}>
          Add Item
        </Button>
      </Box>
    </Box>
  );
}
