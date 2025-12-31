// pages/AddSupplier.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Autocomplete,
  CircularProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierApi";

export default function AddSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [supplierSearchInput, setSupplierSearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gst_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

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

  // Handle supplier selection from autocomplete
  const handleSupplierSelect = (event, value) => {
    setSelectedSupplier(value);

    if (value) {
      // Auto-populate form with selected supplier data
      setFormData({
        name: value.name || "",
        phone: value.phone || "",
        email: value.email || "",
        gst_number: value.gst_number || "",
        address_line1: value.address_line1 || "",
        address_line2: value.address_line2 || "",
        city: value.city || "",
        state: value.state || "",
        pincode: value.pincode || "",
      });
    } else {
      // Clear form
      clearForm();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      gst_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      pincode: "",
    });
    setSelectedSupplier(null);
    setSupplierSearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new supplier
  const handleAdd = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    setSubmitLoading(true);
    const result = await createSupplier(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Supplier added successfully!");
      clearForm();
      loadSuppliers(); // Reload supplier list
    } else {
      showAlert("error", result.message || "Failed to add supplier");
    }
  };

  // Update existing supplier
  const handleUpdate = async () => {
    if (!selectedSupplier) return;

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    setSubmitLoading(true);
    const result = await updateSupplier(selectedSupplier.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Supplier updated successfully!");
      clearForm();
      loadSuppliers(); // Reload supplier list
    } else {
      showAlert("error", result.message || "Failed to update supplier");
    }
  };

  // Delete supplier
  const handleDelete = async () => {
    if (!selectedSupplier) return;

    setSubmitLoading(true);
    const result = await deleteSupplier(selectedSupplier.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Supplier deleted successfully!");
      clearForm();
      loadSuppliers(); // Reload supplier list
    } else {
      showAlert("error", result.message || "Failed to delete supplier");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedSupplier ? "Edit Supplier" : "Add Supplier"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 900 }}>
        {/* Search Supplier */}
        <Box sx={{ mb: 3 }}>
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
                label="Search Existing Supplier"
                placeholder="Search by name or phone to edit..."
                helperText="Search to edit existing supplier, or leave empty to add new"
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
            noOptionsText="No suppliers found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Box>

        {/* Supplier Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Supplier Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Number"
                value={formData.gst_number}
                onChange={(e) =>
                  handleInputChange("gst_number", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address Line 1"
                value={formData.address_line1}
                onChange={(e) =>
                  handleInputChange("address_line1", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2"
                value={formData.address_line2}
                onChange={(e) =>
                  handleInputChange("address_line2", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {selectedSupplier ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={
                        submitLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <UpdateIcon />
                        )
                      }
                      onClick={handleUpdate}
                      disabled={submitLoading}
                    >
                      Update Supplier
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Supplier
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={clearForm}
                      disabled={submitLoading}
                    >
                      Clear
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={
                        submitLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <AddIcon />
                        )
                      }
                      onClick={handleAdd}
                      disabled={submitLoading}
                    >
                      Add Supplier
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={clearForm}
                      disabled={submitLoading}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete supplier{" "}
            <strong>{selectedSupplier?.name}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
