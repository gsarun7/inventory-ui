import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControl,
  Chip,
  Typography,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";

import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import { fetchCurrentStock } from "../../services/api.js";
import {
  searchCustomers,
  getAllCustomers,
} from "../../services/customerApi.js";

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
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearchInput, setCustomerSearchInput] = useState("");

  // Load all customers on mount
  useEffect(() => {
    console.log("Component mounted, loading customers...");
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      console.log("Starting to load customers...");
      setCustomerLoading(true);
      const data = await getAllCustomers();
      console.log("Received data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      console.log("Data length:", data?.length);

      if (Array.isArray(data)) {
        setCustomers(data);
        console.log("✅ Customers set successfully:", data.length, "customers");
      } else {
        console.error("❌ Data is not an array:", data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("❌ Error in loadCustomers:", error);
      console.error("Error details:", error.response || error.message);
      setCustomers([]);
    } finally {
      setCustomerLoading(false);
      console.log("Loading complete");
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);

    if (value) {
      // Auto-populate consignee fields with customer data
      updateField("consigneeName", value.name);
      updateField(
        "consigneeAddress",
        `${value.address_line1}${
          value.address_line2 ? ", " + value.address_line2 : ""
        }, ${value.city}, ${value.state} - ${value.pincode}`
      );

      // Store customer ID for reference
      updateField("customerId", value.id);
    } else {
      // Clear fields if customer is deselected
      updateField("consigneeName", "");
      updateField("consigneeAddress", "");
      updateField("customerId", null);
    }
  };

  // Copy invoice number to clipboard
  const copyInvoiceNumber = () => {
    if (form.invoiceNo) {
      navigator.clipboard.writeText(form.invoiceNo);
      alert("Invoice number copied to clipboard!");
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* ✅ Smart Invoice Number Field */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Invoice No"
            value={form.invoiceNo || ""}
            placeholder={!form.invoiceNo ? "Auto-generated on save" : ""}
            InputProps={{
              readOnly: true,
              style: {
                backgroundColor: form.invoiceNo ? "#e3f2fd" : "#f5f5f5",
                fontWeight: form.invoiceNo ? "bold" : "normal",
                color: form.invoiceNo ? "#1976d2" : "#666",
                fontSize: form.invoiceNo ? "1.05rem" : "1rem",
              },
              startAdornment: (
                <InputAdornment position="start">
                  {form.invoiceNo ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <AutorenewIcon color="disabled" fontSize="small" />
                  )}
                </InputAdornment>
              ),
              endAdornment: form.invoiceNo && (
                <InputAdornment position="end">
                  <Tooltip title="Copy invoice number">
                    <IconButton size="small" onClick={copyInvoiceNumber}>
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
              form.invoiceNo
                ? "✅ Invoice number generated"
                : "✨ Will be auto-generated when you save"
            }
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
        {/* Customer Search/Select Field */}
        <Grid item xs={12}>
          <Autocomplete
            fullWidth
            options={customers}
            value={selectedCustomer}
            onChange={handleCustomerSelect}
            inputValue={customerSearchInput}
            onInputChange={(event, newInputValue) => {
              setCustomerSearchInput(newInputValue);
            }}
            getOptionLabel={(option) => `${option.name} - ${option.phone}`}
            loading={customerLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer Name *"
                placeholder="Search by name or phone..."
                helperText="Select existing customer or type to search"
                error={!!errors.customerId}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <PersonIcon sx={{ color: "action.active", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {customerLoading ? (
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
                  No customers found
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    window.open("/master-data/add-customer", "_blank")
                  }
                >
                  Add New Customer
                </Button>
              </Box>
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Grid>
        {/* Display Selected Customer Info */}
        {selectedCustomer && (
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
                ✓ Selected Customer
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Phone:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedCustomer.phone}
                  </Typography>
                </Grid>
                {selectedCustomer.email && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.email}
                    </Typography>
                  </Grid>
                )}
                {selectedCustomer.gst_number && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      GST:
                    </Typography>
                    <Typography variant="body1">
                      {selectedCustomer.gst_number}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Consignee Name *"
            value={form.consigneeName}
            onChange={(e) => updateField("consigneeName", e.target.value)}
            error={!!errors.consigneeName}
            helperText={errors.consigneeName || "Auto-filled from customer"}
            InputProps={{
              readOnly: !!selectedCustomer,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Consignee Address *"
            value={form.consigneeAddress}
            onChange={(e) => updateField("consigneeAddress", e.target.value)}
            error={!!errors.consigneeAddress}
            helperText={errors.consigneeAddress || "Auto-filled from customer"}
            InputProps={{
              readOnly: !!selectedCustomer,
            }}
          />
        </Grid>
        {/* Rest of your form fields... */}
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

        <Grid item xs={12} sm={4}>
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
        Items Being sold
      </Typography>
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
