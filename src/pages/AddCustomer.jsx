// pages/AddCustomer.jsx
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
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerApi";

export default function AddCustomer() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearchInput, setCustomerSearchInput] = useState("");
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

  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setCustomerLoading(true);
    const data = await getAllCustomers();
    setCustomers(data);
    setCustomerLoading(false);
  };

  // Handle customer selection from autocomplete
  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);

    if (value) {
      // Auto-populate form with selected customer data
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
    setSelectedCustomer(null);
    setCustomerSearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new customer
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
    const result = await createCustomer(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Customer added successfully!");
      clearForm();
      loadCustomers(); // Reload customer list
    } else {
      showAlert("error", result.message || "Failed to add customer");
    }
  };

  // Update existing customer
  const handleUpdate = async () => {
    if (!selectedCustomer) return;

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
    const result = await updateCustomer(selectedCustomer.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Customer updated successfully!");
      clearForm();
      loadCustomers(); // Reload customer list
    } else {
      showAlert("error", result.message || "Failed to update customer");
    }
  };

  // Delete customer
  const handleDelete = async () => {
    if (!selectedCustomer) return;

    setSubmitLoading(true);
    const result = await deleteCustomer(selectedCustomer.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Customer deleted successfully!");
      clearForm();
      loadCustomers(); // Reload customer list
    } else {
      showAlert("error", result.message || "Failed to delete customer");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedCustomer ? "Edit Customer" : "Add Customer"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 900 }}>
        {/* Search Customer */}
        <Box sx={{ mb: 3 }}>
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
                label="Search Existing Customer"
                placeholder="Search by name or phone to edit..."
                helperText="Search to edit existing customer, or leave empty to add new"
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
        </Box>

        {/* Customer Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Customer Name"
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
                {selectedCustomer ? (
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
                      Update Customer
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Customer
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
                      Add Customer
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
            Are you sure you want to delete customer{" "}
            <strong>{selectedCustomer?.name}</strong>? This action cannot be
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
