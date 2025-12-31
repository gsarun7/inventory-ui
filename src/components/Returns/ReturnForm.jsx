import React, { useState, useEffect } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import ClearIcon from "@mui/icons-material/Clear";

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
  Autocomplete,
  Chip,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import WarehouseSelect from "../common/WarehouseSelect";
import { fetchCurrentStock } from "../../services/api.js";
import { getAllCustomers } from "../../services/customerApi.js";
import { getInvoicesByCustomer } from "../../services/invoiceApi.js";

export default function ReturnForm({
  form,
  categories,
  warehouses,
  soldItems,
  invoices,
  updateField,
  updateItem,
  addItemRow,
  removeItemRow,
  onInvoiceSelect,
}) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearchInput, setCustomerSearchInput] = useState("");

  // Invoice state
  const [customerInvoices, setCustomerInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceSearchInput, setInvoiceSearchInput] = useState("");

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setCustomerLoading(true);
      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Load invoices when customer is selected
  const loadCustomerInvoices = async (customerId) => {
    try {
      setInvoiceLoading(true);
      const data = await getInvoicesByCustomer(customerId);
      console.log("Customer invoices loaded:", data);
      setCustomerInvoices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading invoices:", error);
      setCustomerInvoices([]);
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Handle customer selection
  const handleCustomerSelect = async (event, value) => {
    setSelectedCustomer(value);
    setSelectedInvoice(null);
    setCustomerInvoices([]);
    setInvoiceSearchInput("");

    if (value) {
      updateField("customerName", value.name);
      updateField("customerPhone", value.phone);
      updateField(
        "customerAddress",
        `${value.address_line1}${
          value.address_line2 ? ", " + value.address_line2 : ""
        }, ${value.city}, ${value.state} - ${value.pincode}`
      );
      updateField("customerId", value.id);
      await loadCustomerInvoices(value.id);
    } else {
      updateField("customerName", "");
      updateField("customerPhone", "");
      updateField("customerAddress", "");
      updateField("customerId", null);
      updateField("originalInvoiceNo", "");
      updateField("originalInvoiceDate", "");
    }
  };

  // Handle invoice selection
  const handleInvoiceSelect = async (event, value) => {
    setSelectedInvoice(value);

    if (value) {
      updateField("originalInvoiceNo", value.invoiceNo);
      updateField("originalInvoiceDate", value.invoiceDate);

      if (onInvoiceSelect) {
        await onInvoiceSelect(value.id);
      }
    } else {
      updateField("originalInvoiceNo", "");
      updateField("originalInvoiceDate", "");
    }
  };

  // Copy return ID to clipboard
  const copyReturnId = () => {
    if (form.returnId) {
      navigator.clipboard.writeText(form.returnId);
      alert("Return ID copied to clipboard!");
    }
  };

  return (
    <Box>
      {/* Return Details */}
      <Typography variant="h6" gutterBottom>
        Return Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* ✅ Smart Return ID Field */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Return ID"
            value={form.returnId || ""}
            placeholder={!form.returnId ? "Auto-generated on save" : ""}
            InputProps={{
              readOnly: true,
              style: {
                backgroundColor: form.returnId ? "#e3f2fd" : "#f5f5f5",
                fontWeight: form.returnId ? "bold" : "normal",
                color: form.returnId ? "#1976d2" : "#666",
                fontSize: form.returnId ? "1.05rem" : "1rem",
              },
              startAdornment: (
                <InputAdornment position="start">
                  {form.returnId ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <AutorenewIcon color="disabled" fontSize="small" />
                  )}
                </InputAdornment>
              ),
              endAdornment: form.returnId && (
                <InputAdornment position="end">
                  <Tooltip title="Copy return ID">
                    <IconButton size="small" onClick={copyReturnId}>
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
              form.returnId
                ? "✅ Return ID generated"
                : "✨ Will be auto-generated when you save"
            }
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
            <InputLabel id="warehouse-label">Warehouse</InputLabel>
            <Select
              labelId="warehouse-label"
              label="Warehouse"
              value={form.warehouse ?? ""}
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

      {/* Customer Information with Autocomplete */}
      <Typography variant="h6" gutterBottom>
        Customer Details
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Customer Autocomplete Search */}
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
                label="Search Customer *"
                placeholder="Search by name or phone..."
                helperText="Select customer first to load their invoices"
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
            noOptionsText="No customers found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Grid>

        {/* Display Selected Customer Info */}
        {selectedCustomer && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                bgcolor: "success.lighter",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "success.light",
              }}
            >
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                ✓ Customer Selected
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedCustomer.name}
                  </Typography>
                </Grid>
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
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Original Invoice Autocomplete */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            disabled={!selectedCustomer}
            options={customerInvoices}
            value={selectedInvoice}
            onChange={handleInvoiceSelect}
            inputValue={invoiceSearchInput}
            onInputChange={(event, newInputValue) => {
              setInvoiceSearchInput(newInputValue);
            }}
            getOptionLabel={(option) =>
              `${option.invoiceNo} - ${option.invoiceDate}`
            }
            loading={invoiceLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Original Invoice *"
                placeholder={
                  selectedCustomer
                    ? "Search invoice..."
                    : "Select customer first"
                }
                helperText={
                  !selectedCustomer
                    ? "⚠️ Please select a customer first"
                    : customerInvoices.length === 0
                    ? "No invoices found for this customer"
                    : "Select the original invoice for return"
                }
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <ReceiptIcon
                        sx={{
                          color: selectedCustomer
                            ? "action.active"
                            : "action.disabled",
                          mr: 1,
                        }}
                      />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {invoiceLoading ? (
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
                    {option.invoiceNo}
                  </Typography>
                  <Chip
                    label={option.invoiceDate}
                    size="small"
                    sx={{ fontSize: "0.75rem", height: 20, mt: 0.5 }}
                  />
                </Box>
              </li>
            )}
            noOptionsText={
              invoiceLoading ? "Loading invoices..." : "No invoices found"
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Original Invoice Date"
            value={form.originalInvoiceDate}
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
            helperText="Auto-filled from invoice selection"
          />
        </Grid>

        {/* Auto-filled Customer Details */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Customer Name"
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            InputProps={{
              readOnly: !!selectedCustomer,
            }}
            helperText={selectedCustomer ? "Auto-filled from selection" : ""}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Phone Number"
            value={form.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            InputProps={{
              readOnly: !!selectedCustomer,
            }}
            helperText={selectedCustomer ? "Auto-filled from selection" : ""}
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
            InputProps={{
              readOnly: !!selectedCustomer,
            }}
            helperText={selectedCustomer ? "Auto-filled from selection" : ""}
          />
        </Grid>
      </Grid>

      {/* Display Selected Invoice Info */}
      {selectedInvoice && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "info.lighter",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "info.light",
          }}
        >
          <Typography variant="subtitle2" color="info.main" gutterBottom>
            ✓ Invoice Selected
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Invoice Number:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selectedInvoice.invoiceNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Invoice Date:
              </Typography>
              <Typography variant="body1">
                {selectedInvoice.invoiceDate}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Return Details */}
      <Typography variant="h6" gutterBottom>
        Return Details
      </Typography>
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
            sx={{
              "& .MuiInputBase-input": { fontWeight: "bold", color: "green" },
            }}
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

      {/* ✅ Returned Items Table - Manual Input for Sold Qty & Unit Price */}
      <Typography variant="h6" gutterBottom>
        Items Being Returned
      </Typography>
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
                  value={item.itemId ?? null}
                  onChange={async (productId, product) => {
                    if (!product) {
                      updateItem(index, {
                        itemId: "",
                        itemName: "",
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
                    });
                  }}
                />
              </TableCell>
              {/* ✅ Sold Qty - Manual Input (Editable) */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.soldQty}
                  onChange={(e) => updateItem(index, "soldQty", e.target.value)}
                  placeholder="0"
                  sx={{ width: 80 }}
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              {/* ✅ Return Qty - Manual Input */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.returnQty}
                  onChange={(e) =>
                    updateItem(index, "returnQty", e.target.value)
                  }
                  placeholder="0"
                  sx={{ width: 80 }}
                  inputProps={{ min: 0, max: item.soldQty }}
                  error={parseFloat(item.returnQty) > parseFloat(item.soldQty)}
                  helperText={
                    parseFloat(item.returnQty) > parseFloat(item.soldQty)
                      ? "Exceeds sold qty"
                      : ""
                  }
                />
              </TableCell>
              {/* ✅ Unit Price - Manual Input (Editable) */}
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", e.target.value)
                  }
                  placeholder="0.00"
                  sx={{ width: 100 }}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <Typography variant="body2">₹</Typography>,
                  }}
                />
              </TableCell>
              {/* Total Price - Auto Calculated */}
              <TableCell>
                <TextField
                  size="small"
                  value={`₹ ${item.totalPrice}`}
                  InputProps={{ readOnly: true }}
                  sx={{
                    width: 100,
                    "& .MuiInputBase-input": { fontWeight: "bold" },
                  }}
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={item.condition}
                    onChange={(e) =>
                      updateItem(index, "condition", e.target.value)
                    }
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
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addItemRow}>
          Add Item
        </Button>
      </Box>
    </Box>
  );
}
