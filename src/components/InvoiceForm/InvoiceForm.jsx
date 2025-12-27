import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import { fetchCurrentStock } from "../../services/api.js";
export default function InvoiceForm({
  form,
  categories,
  productList,
  warehouses,
  updateField,
  updateItem,
  addItem,
  removeItem,
  errors = {},
}) {
  console.log("Invoice form Component is rendering");
  console.log({ productList, categories, warehouses });
  console.log(
    "Selected value:",
    form.warehouse,
    form.items.itemName,
    form.items.categoryId
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Invoice No"
            value={form.invoiceNo}
            onChange={(e) => updateField("invoiceNo", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="date"
            label="Invoice Date *"
            InputLabelProps={{ shrink: true }}
            value={form.invoiceDate}
            onChange={(e) => updateField("invoiceDate", e.target.value)}
            error={!!errors.invoiceDate}
            helperText={errors.invoiceDate}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Payment Mode *"
            value={form.paymentMode}
            onChange={(e) => updateField("paymentMode", e.target.value)}
            error={!!errors.paymentMode}
            helperText={errors.paymentMode}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="e-Way Bill No"
            value={form.ewaybillno}
            onChange={(e) => updateField("ewaybillno", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Destination"
            value={form.destination}
            onChange={(e) => updateField("destination", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Motor Vehicle No *"
            value={form.motorVehicleNo}
            onChange={(e) => updateField("motorVehicleNo", e.target.value)}
            error={!!errors.motorVehicleNo}
            helperText={errors.motorVehicleNo}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="date"
            label="Delivery Date"
            InputLabelProps={{ shrink: true }}
            value={form.deleiveryDate}
            onChange={(e) => updateField("deleiveryDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Supplier Name *"
            value={form.supplierName}
            onChange={(e) => updateField("supplierName", e.target.value)}
            error={!!errors.supplierName}
            helperText={errors.supplierName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Supplier Address *"
            value={form.supplierAddress}
            onChange={(e) => updateField("supplierAddress", e.target.value)}
            error={!!errors.supplierAddress}
            helperText={errors.supplierAddress}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Consignee Name *"
            value={form.consigneeName}
            onChange={(e) => updateField("consigneeName", e.target.value)}
            error={!!errors.consigneeName}
            helperText={errors.consigneeName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            label="Consignee Address *"
            value={form.consigneeAddress}
            onChange={(e) => updateField("consigneeAddress", e.target.value)}
            error={!!errors.consigneeAddress}
            helperText={errors.consigneeAddress}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Buyer Name *"
            value={form.buyerName}
            onChange={(e) => updateField("buyerName", e.target.value)}
            error={!!errors.buyerName}
            helperText={errors.buyerName}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            label="Buyer Address *"
            value={form.buyerAddress}
            onChange={(e) => updateField("buyerAddress", e.target.value)}
            error={!!errors.buyerAddress}
            helperText={errors.buyerAddress}
          />
        </Grid>
        <Grid>
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
      <div style={{ marginTop: 16 }}>
        {errors.items && (
          <div style={{ color: "#d32f2f", fontSize: 12, marginBottom: 8 }}>
            {errors.items}
          </div>
        )}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Sr</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Estimated Area
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Usage
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Category
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Description of Goods
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                HSN/SAC
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>Rate</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>per</TableCell>
              <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                Amount
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {form.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  {idx + 1}
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    value={item.estimatedArea || ""}
                    onChange={(e) =>
                      updateItem(idx, "estimatedArea", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    value={item.usage || ""}
                    onChange={(e) => updateItem(idx, "usage", e.target.value)}
                  />
                </TableCell>
                <TableCell
                  sx={{ borderRight: "1px solid #ddd", minWidth: 120 }}
                >
                  <CategorySelect
                    value={item.categoryId}
                    onChange={(newCategoryId) => {
                      if (newCategoryId !== item.categoryId) {
                        updateItem(idx, "categoryId", newCategoryId);
                      }
                    }}
                  />
                </TableCell>
                <TableCell
                  style={{ minWidth: 220 }}
                  sx={{ borderRight: "1px solid #ddd" }}
                >
                  <ProductSelect
                    categoryId={item.categoryId}
                    value={item.itemId}
                    onChange={async (productId, product) => {
                      if (product === null) {
                        updateItem(idx, {
                          itemId: productId,
                          itemName: product.name,
                        });
                        return;
                      }

                      // const res = await fetchCurrentStock(
                      //   productId,
                      //   form.warehouse
                      // );

                      const res = await fetchCurrentStock(
                        productId,
                        form.warehouse
                      );

                      updateItem(idx, {
                        itemId: productId,
                        itemName: product.name,
                        hsn: product.hsn || "",
                      });
                    }}
                  />
                </TableCell>

                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    value={item.hsn}
                    onChange={(e) => updateItem(idx, "hsn", e.target.value)}
                  />
                </TableCell>

                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField
                    size="small"
                    value={item.per}
                    onChange={(e) => updateItem(idx, "per", e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #ddd" }}>
                  <TextField size="small" value={item.amount} disabled />
                </TableCell>

                <TableCell>
                  <IconButton onClick={() => removeItem(idx)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div style={{ marginTop: 8 }}>
          <Button variant="outlined" onClick={addItem}>
            + Add Item
          </Button>
        </div>
      </div>

      {/* totals quick display */}
      <div style={{ marginTop: 12, display: "flex", gap: 24 }}>
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
      </div>
    </div>
  );
}
