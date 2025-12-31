// pages/AddUnit.jsx
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
import StraightenIcon from "@mui/icons-material/Straighten";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../services/unitApi";

export default function AddUnit() {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitLoading, setUnitLoading] = useState(false);
  const [unitSearchInput, setUnitSearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    base_unit_id: "",
    conversion_factor: "",
  });

  // Load units on mount
  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    setUnitLoading(true);
    const data = await getAllUnits();
    setUnits(data);
    setUnitLoading(false);
  };

  // Handle unit selection from autocomplete
  const handleUnitSelect = (event, value) => {
    setSelectedUnit(value);

    if (value) {
      // Auto-populate form with selected unit data
      setFormData({
        name: value.name || "",
        symbol: value.symbol || "",
        base_unit_id: value.base_unit_id || "",
        conversion_factor: value.conversion_factor || "",
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
      symbol: "",
      base_unit_id: "",
      conversion_factor: "",
    });
    setSelectedUnit(null);
    setUnitSearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new unit
  const handleAdd = async () => {
    if (!formData.name || !formData.symbol) {
      showAlert("error", "Please enter unit name and symbol");
      return;
    }

    setSubmitLoading(true);
    const result = await createUnit(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Unit added successfully!");
      clearForm();
      loadUnits(); // Reload unit list
    } else {
      showAlert("error", result.message || "Failed to add unit");
    }
  };

  // Update existing unit
  const handleUpdate = async () => {
    if (!selectedUnit) return;

    if (!formData.name || !formData.symbol) {
      showAlert("error", "Please enter unit name and symbol");
      return;
    }

    setSubmitLoading(true);
    const result = await updateUnit(selectedUnit.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Unit updated successfully!");
      clearForm();
      loadUnits(); // Reload unit list
    } else {
      showAlert("error", result.message || "Failed to update unit");
    }
  };

  // Delete unit
  const handleDelete = async () => {
    if (!selectedUnit) return;

    setSubmitLoading(true);
    const result = await deleteUnit(selectedUnit.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Unit deleted successfully!");
      clearForm();
      loadUnits(); // Reload unit list
    } else {
      showAlert("error", result.message || "Failed to delete unit");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedUnit ? "Edit Unit" : "Add Unit"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 800 }}>
        {/* Search Unit */}
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            fullWidth
            options={units}
            value={selectedUnit}
            onChange={handleUnitSelect}
            inputValue={unitSearchInput}
            onInputChange={(event, newInputValue) => {
              setUnitSearchInput(newInputValue);
            }}
            getOptionLabel={(option) => `${option.name} (${option.symbol})`}
            loading={unitLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Existing Unit"
                placeholder="Search by unit name or symbol to edit..."
                helperText="Search to edit existing unit, or leave empty to add new"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <StraightenIcon sx={{ color: "action.active", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {unitLoading ? (
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
                      label={`Symbol: ${option.symbol}`}
                      size="small"
                      sx={{ fontSize: "0.75rem", height: 20 }}
                    />
                    {option.conversion_factor && (
                      <Chip
                        label={`Factor: ${option.conversion_factor}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem", height: 20 }}
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
                  option.symbol.toLowerCase().includes(searchTerm)
              );
            }}
            noOptionsText="No units found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Box>

        {/* Display Selected Unit Info */}
        {selectedUnit && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "warning.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "warning.light",
            }}
          >
            <Typography variant="subtitle2" color="warning.main" gutterBottom>
              ✓ Unit Selected
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Name:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedUnit.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Symbol:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedUnit.symbol}
                </Typography>
              </Grid>
              {selectedUnit.conversion_factor && (
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Factor:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedUnit.conversion_factor}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Unit Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Unit Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Square Feet, Square Meter, Box"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Unit Symbol"
                value={formData.symbol}
                onChange={(e) => handleInputChange("symbol", e.target.value)}
                placeholder="e.g., sqft, sqm, box"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Base Unit ID"
                type="number"
                value={formData.base_unit_id}
                onChange={(e) =>
                  handleInputChange("base_unit_id", e.target.value)
                }
                placeholder="Enter base unit ID (optional)"
                helperText="Reference to base unit for conversion"
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Conversion Factor"
                type="number"
                value={formData.conversion_factor}
                onChange={(e) =>
                  handleInputChange("conversion_factor", e.target.value)
                }
                placeholder="e.g., 10.764 (sqm to sqft)"
                helperText="How many base units = 1 of this unit"
                inputProps={{ min: 0, step: 0.0001 }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {selectedUnit ? (
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
                      Update Unit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Unit
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
                      Add Unit
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

        {/* Info Box */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            💡 Examples:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Square Feet (sqft) - Base unit
            <br />
            • Square Meter (sqm) - Conversion factor: 10.764 (1 sqm = 10.764
            sqft)
            <br />
            • Box (box) - For tiles sold in boxes
            <br />• Piece (pc) - For individual items
          </Typography>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete unit{" "}
            <strong>{selectedUnit?.name}</strong>? This action cannot be undone.
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
