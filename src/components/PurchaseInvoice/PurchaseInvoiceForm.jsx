import React, { useState, useEffect } from "react";
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
  Typography,
  Chip,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import { getAllSuppliers } from "../../services/supplierApi";

export default function PurchaseInvoiceForm({
  form,
  warehouses,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow,
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierSearchInput, setSupplierSearchInput] = useState("");

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setSupplierLoading(true);
    const data = await getAllSuppliers();
    setSuppliers(data);
    setSupplierLoading(false);
  };

  // Handle supplier selection
  const handleSupplierSelect = (event, value) => {
    setSelectedSupplier(value);

    if (value) {
      // Auto-populate supplier fields
      updateField("supplier", value.name);
      updateField(
        "supplierAddress",
        `${value.address_line1}${
          value.address_line2 ? ", " + value.address_line2 : ""
        }, ${value.city}, ${value.state} - ${value.pincode}`
      );
      updateField("supplierId", value.id);
    } else {
      // Clear fields if supplier is deselected
      updateField("supplier", "");
      updateField("supplierAddress", "");
      updateField("supplierId", null);
    }
  };

  // Change function name from copyInvoiceNumber to copyPurchaseId
  const copyPurchaseId = () => {
    if (form.invoiceId) {
      navigator.clipboard.writeText(form.invoiceId);
      alert("Purchase ID copied to clipboard!"); // ✅ Changed message
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* ✅ Changed label from "Invoice ID" to "Purchase ID" */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Purchase ID" // ✅ Changed here
            value={form.invoiceId || ""}
            placeholder={!form.invoiceId ? "Auto-generated on save" : ""}
            InputProps={{
              readOnly: true,
              style: {
                backgroundColor: form.invoiceId ? "#e3f2fd" : "#f5f5f5",
                fontWeight: form.invoiceId ? "bold" : "normal",
                color: form.invoiceId ? "#1976d2" : "#666",
                fontSize: form.invoiceId ? "1.05rem" : "1rem",
              },
              startAdornment: (
                <InputAdornment position="start">
                  {form.invoiceId ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <AutorenewIcon color="disabled" fontSize="small" />
                  )}
                </InputAdornment>
              ),
              endAdornment: form.invoiceId && (
                <InputAdornment position="end">
                  <Tooltip title="Copy purchase ID">
                    {" "}
                    {/* ✅ Changed here */}
                    <IconButton size="small" onClick={copyPurchaseId}>
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
              form.invoiceId
                ? "✅ Purchase ID generated" // ✅ Changed here
                : "✨ Will be auto-generated when you save"
            }
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

        {/* Supplier Autocomplete Search */}
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={suppliers}
            value={selectedSupplier}
            onChange={handleSupplierSelect}
            inputValue={supplierSearchInput}
            onInputChange={(event, newInputValue) => {
              setSupplierSearchInput(newInputValue);
            }}
            getOptionLabel={(option) => `${option.name} - ${option.phone}`}
            loading={supplierLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Supplier *"
                placeholder="Search by name or phone..."
                helperText="Select existing supplier to auto-fill details"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocalShippingIcon
                        sx={{ color: "action.active", mr: 1 }}
                      />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {supplierLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {option.name}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={option.phone}
                      size="small"
                      sx={{ fontSize: "0.75rem", height: 20 }}
                    />
                    <Chip
                      label={`${option.city}, ${option.state}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem", height: 20 }}
                    />
                    {option.gst_number && (
                      <Chip
                        label={`GST: ${option.gst_number}`}
                        size="small"
                        color="primary"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    )}
                  </Box>
                </Box>
              </li>
            )}
            filterOptions={(options, { inputValue }) => {
              const searchTerm = inputValue.toLowerCase();
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(searchTerm) ||
                  option.phone.includes(searchTerm)
              );
            }}
            noOptionsText={
              <Box sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No suppliers found
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open("/master-data/add-supplier", "_blank")
                  }
                >
                  Add New Supplier
                </Button>
              </Box>
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Grid>

        {/* Display Selected Supplier Info */}
        {selectedSupplier && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                bgcolor: "primary.lighter",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "primary.light",
              }}
            >
              <Typography variant="subtitle2" color="primary" gutterBottom>
                ✓ Supplier Selected
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedSupplier.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phone:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedSupplier.phone}
                  </Typography>
                </Grid>
                {selectedSupplier.email && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body1">
                      {selectedSupplier.email}
                    </Typography>
                  </Grid>
                )}
                {selectedSupplier.gst_number && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      GST Number:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedSupplier.gst_number}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Auto-filled Supplier Name (Read-only) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Supplier Name"
            value={form.supplier}
            onChange={(e) => updateField("supplier", e.target.value)}
            InputProps={{
              readOnly: !!selectedSupplier,
            }}
            helperText={selectedSupplier ? "Auto-filled from selection" : ""}
          />
        </Grid>

        {/* Auto-filled Supplier Address (Read-only) */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Supplier Address"
            value={form.supplierAddress}
            onChange={(e) => updateField("supplierAddress", e.target.value)}
            InputProps={{
              readOnly: !!selectedSupplier,
            }}
            helperText={selectedSupplier ? "Auto-filled from selection" : ""}
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

        <Grid item xs={12} sm={6}>
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
      </Grid>
      <Typography variant="h6" gutterBottom>
        Items Being purchased
      </Typography>
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
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={addItemRow}
                >
                  Add Item
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
