import React from "react";
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
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";


export default function StockAdjustmentForm({
  form,
  categories,
  warehouses,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow
}) {
  return (
    <Box>

      {/* ---------- Header ---------- */}
      <Typography variant="h6" gutterBottom>
        Adjustment Details
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Adjustment ID"
            value={form.adjustmentId}
            onChange={(e) =>
              updateField("adjustmentId", e.target.value)
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
            onChange={(e) =>
              updateField("adjustmentDate", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              value={form.adjustmentType}
              label="Adjustment Type"
              onChange={(e) =>
                updateField("adjustmentType", e.target.value)
              }
            >
              <MenuItem value="ADD">Add (+)</MenuItem>
              <MenuItem value="REDUCE">Reduce (-)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={form.warehouse}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Reference / Document No"
            value={form.reference}
            onChange={(e) =>
              updateField("reference", e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Notes"
            value={form.notes}
            onChange={(e) =>
              updateField("notes", e.target.value)
            }
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      {/* ---------- Items Table ---------- */}
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
            <TableCell width={60}></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {form.items.map((item, index) => (
            <TableRow key={`${item.itemId || "row"}-${index}`}>
              {/* Category */}
              <TableCell width={160}>
                <CategorySelect
                  value={item.category}
                  onChange={(v) => {
                    updateItem(index, "category", v);
                    updateItem(index, "itemId", "");
                    updateItem(index, "itemName", "");
                    updateItem(index, "currentStock", "");
                  }}
                />
              </TableCell>

              {/* Product */}
              <TableCell width={220}>
                <ProductSelect
                  categoryId={item.category}
                  value={item.itemId}
                  onChange={(v, product) => {
                    updateItem(index, "itemId", v);
                    updateItem(index, "itemName", product?.name || "");
                    updateItem(
                      index,
                      "currentStock",
                      product?.currentStock || 0
                    );
                  }}
                />
              </TableCell>

              {/* Current Stock */}
              <TableCell width={90}>
                <TextField
                  size="small"
                  value={item.currentStock}
                  InputProps={{ readOnly: true }}
                />
              </TableCell>

              {/* Adjustment Qty */}
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

              {/* Reason */}
              <TableCell>
                <TextField
                  size="small"
                  value={item.reason}
                  onChange={(e) =>
                    updateItem(index, "reason", e.target.value)
                  }
                />
              </TableCell>

              {/* Final Stock */}
              <TableCell width={90}>
                <TextField
                  size="small"
                  value={item.finalStock}
                  InputProps={{ readOnly: true }}
                />
              </TableCell>

              {/* Delete */}
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
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addItemRow}
        >
          Add Item
        </Button>
      </Box>
    </Box>
  );
}
