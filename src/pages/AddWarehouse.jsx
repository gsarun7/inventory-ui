// pages/AddWarehouse.jsx
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
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../services/warehouseApi";

export default function AddWarehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseSearchInput, setWarehouseSearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  // Load warehouses on mount
  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setWarehouseLoading(true);
    const data = await getAllWarehouses();
    setWarehouses(data);
    setWarehouseLoading(false);
  };

  // Handle warehouse selection from autocomplete
  const handleWarehouseSelect = (event, value) => {
    setSelectedWarehouse(value);

    if (value) {
      // Auto-populate form with selected warehouse data
      setFormData({
        name: value.name || "",
        location: value.location || "",
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
      location: "",
    });
    setSelectedWarehouse(null);
    setWarehouseSearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new warehouse
  const handleAdd = async () => {
    if (!formData.name || !formData.location) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    setSubmitLoading(true);
    const result = await createWarehouse(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Warehouse added successfully!");
      clearForm();
      loadWarehouses(); // Reload warehouse list
    } else {
      showAlert("error", result.message || "Failed to add warehouse");
    }
  };

  // Update existing warehouse
  const handleUpdate = async () => {
    if (!selectedWarehouse) return;

    if (!formData.name || !formData.location) {
      showAlert("error", "Please fill all required fields");
      return;
    }

    setSubmitLoading(true);
    const result = await updateWarehouse(selectedWarehouse.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Warehouse updated successfully!");
      clearForm();
      loadWarehouses(); // Reload warehouse list
    } else {
      showAlert("error", result.message || "Failed to update warehouse");
    }
  };

  // Delete warehouse
  const handleDelete = async () => {
    if (!selectedWarehouse) return;

    setSubmitLoading(true);
    const result = await deleteWarehouse(selectedWarehouse.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Warehouse deleted successfully!");
      clearForm();
      loadWarehouses(); // Reload warehouse list
    } else {
      showAlert("error", result.message || "Failed to delete warehouse");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 700 }}>
        {/* Search Warehouse */}
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            fullWidth
            options={warehouses}
            value={selectedWarehouse}
            onChange={handleWarehouseSelect}
            inputValue={warehouseSearchInput}
            onInputChange={(event, newInputValue) => {
              setWarehouseSearchInput(newInputValue);
            }}
            getOptionLabel={(option) => `${option.name} - ${option.location}`}
            loading={warehouseLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Existing Warehouse"
                placeholder="Search by name or location to edit..."
                helperText="Search to edit existing warehouse, or leave empty to add new"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <WarehouseIcon sx={{ color: "action.active", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {warehouseLoading ? (
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    📍 {option.location}
                  </Typography>
                </Box>
              </li>
            )}
            filterOptions={(options, { inputValue }) => {
              const searchTerm = inputValue.toLowerCase();
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(searchTerm) ||
                  option.location.toLowerCase().includes(searchTerm)
              );
            }}
            noOptionsText="No warehouses found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Box>

        {/* Display Selected Warehouse Info */}
        {selectedWarehouse && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "info.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "info.light",
            }}
          >
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              ✓ Warehouse Selected
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedWarehouse.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Location:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedWarehouse.location}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Warehouse Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Warehouse Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Main Warehouse, Godown 1, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Warehouse Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Nittur, Bangalore, etc."
                multiline
                rows={2}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {selectedWarehouse ? (
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
                      Update Warehouse
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Warehouse
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
                      Add Warehouse
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
            Are you sure you want to delete warehouse{" "}
            <strong>{selectedWarehouse?.name}</strong>? This action cannot be
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
