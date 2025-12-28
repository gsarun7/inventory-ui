import React from "react";
import {
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  InputLabel,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";

/**
 * PurchaseInvoiceForm
 * Props:
 * - form
 * - sampleProducts: array for autocomplete suggestions
 * - updateField, updateItem, addItemRow, removeItemRow
 */
export default function PurchaseInvoiceForm({
  form,
  warehouses,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow,
}) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Invoice ID"
            value={form.invoiceId}
            onChange={(e) => updateField("invoiceId", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Invoice Date"
            InputLabelProps={{ shrink: true }}
            value={form.invoiceDate}
            onChange={(e) => updateField("invoiceDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Payment Mode"
            value={form.paymentMode}
            onChange={(e) => updateField("paymentMode", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Vehicle No"
            value={form.vehicleNo}
            onChange={(e) => updateField("vehicleNo", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Supplier"
            value={form.supplier}
            onChange={(e) => updateField("supplier", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Supplier Address"
            value={form.supplierAddress}
            onChange={(e) => updateField("supplierAddress", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Delivery Location"
            value={form.deliveryLocation}
            onChange={(e) => updateField("deliveryLocation", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Remarks"
            value={form.remarks}
            onChange={(e) => updateField("remarks", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            value={form.warehouse}
            label="Warehouse"
            onChange={(e) => updateField("warehouse", e.target.value)}
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* Items table */}
      <Box sx={{ mt: 2, overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sr</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>HSN</TableCell>
              <TableCell>Description (autocomplete)</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {form.items.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>

                <TableCell sx={{ minWidth: 100 }}>
                  <CategorySelect
                    value={row.category}
                    onChange={(category) =>
                      updateItem(idx, "category", category)
                    }
                  />
                </TableCell>

                <TableCell sx={{ maxWidth: 120 }}>
                  <TextField
                    size="small"
                    value={row.hsn || ""}
                    onChange={(e) => updateItem(idx, "hsn", e.target.value)}
                  />
                </TableCell>

                <TableCell sx={{ minWidth: 260 }}>
                  <ProductSelect
                    categoryId={row.category}
                    value={row.productId ?? null}
                    onChange={(productId, product) => {
                      if (!product) {
                        updateItem(idx, "productId", "");
                        updateItem(idx, "description", "");
                        updateItem(idx, "hsn", "");
                        updateItem(idx, "brand", "");
                        updateItem(idx, "size", "");
                        updateItem(idx, "grade", "");
                        updateItem(idx, "rate", "");
                        updateItem(idx, "unit", "");
                        updateItem(idx, "amount", "");
                        return;
                      }

                      updateItem(idx, "productId", product.id);
                      updateItem(idx, "description", product.name);
                      updateItem(idx, "hsn", product.hsn);
                      updateItem(idx, "brand", product.brand);
                      updateItem(idx, "size", product.size);
                      updateItem(idx, "grade", product.grade);
                      updateItem(idx, "rate", product.rate);
                      updateItem(idx, "unit", product.unit);
                    }}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.brand || ""}
                    onChange={(e) => updateItem(idx, "brand", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.size || ""}
                    onChange={(e) => updateItem(idx, "size", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.grade || ""}
                    onChange={(e) => updateItem(idx, "grade", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.qty || ""}
                    onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={row.unit || ""}
                    onChange={(e) => updateItem(idx, "unit", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={row.rate || ""}
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <TextField size="small" value={row.amount || ""} disabled />
                </TableCell>

                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => removeItemRow(idx)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={12} sx={{ p: 1 }}>
                <Button
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={addItemRow}
                >
                  Add Row
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* quick totals */}
      <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          label="Subtotal"
          size="small"
          value={form.subtotal}
          disabled
        />
        <TextField
          label="GST Amount"
          type="number"
          size="small"
          value={form.gstAmount}
          onChange={(e) => updateField("gstAmount", e.target.value)}
        />
        <TextField
          label="Grand Total"
          size="small"
          value={form.grandTotal}
          disabled
        />
      </Box>
    </Box>
  );
}
