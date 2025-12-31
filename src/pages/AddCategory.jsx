// pages/AddCategory.jsx
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
import CategoryIcon from "@mui/icons-material/Category";
import SaveIcon from "@mui/icons-material/Save";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryApi";

export default function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categorySearchInput, setCategorySearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
  });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setCategoryLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setCategoryLoading(false);
  };

  // Handle category selection from autocomplete
  const handleCategorySelect = (event, value) => {
    setSelectedCategory(value);

    if (value) {
      // Auto-populate form with selected category data
      setFormData({
        name: value.name || "",
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
    });
    setSelectedCategory(null);
    setCategorySearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new category
  const handleAdd = async () => {
    if (!formData.name) {
      showAlert("error", "Please enter category name");
      return;
    }

    setSubmitLoading(true);
    const result = await createCategory(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Category added successfully!");
      clearForm();
      loadCategories(); // Reload category list
    } else {
      showAlert("error", result.message || "Failed to add category");
    }
  };

  // Update existing category
  const handleUpdate = async () => {
    if (!selectedCategory) return;

    if (!formData.name) {
      showAlert("error", "Please enter category name");
      return;
    }

    setSubmitLoading(true);
    const result = await updateCategory(selectedCategory.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Category updated successfully!");
      clearForm();
      loadCategories(); // Reload category list
    } else {
      showAlert("error", result.message || "Failed to update category");
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!selectedCategory) return;

    setSubmitLoading(true);
    const result = await deleteCategory(selectedCategory.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Category deleted successfully!");
      clearForm();
      loadCategories(); // Reload category list
    } else {
      showAlert("error", result.message || "Failed to delete category");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedCategory ? "Edit Category" : "Add Category"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
        {/* Search Category */}
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            fullWidth
            options={categories}
            value={selectedCategory}
            onChange={handleCategorySelect}
            inputValue={categorySearchInput}
            onInputChange={(event, newInputValue) => {
              setCategorySearchInput(newInputValue);
            }}
            getOptionLabel={(option) => option.name}
            loading={categoryLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Existing Category"
                placeholder="Search by category name to edit..."
                helperText="Search to edit existing category, or leave empty to add new"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <CategoryIcon sx={{ color: "action.active", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {categoryLoading ? (
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
                </Box>
              </li>
            )}
            filterOptions={(options, { inputValue }) => {
              const searchTerm = inputValue.toLowerCase();
              return options.filter((option) =>
                option.name.toLowerCase().includes(searchTerm)
              );
            }}
            noOptionsText="No categories found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Box>

        {/* Display Selected Category Info */}
        {selectedCategory && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "success.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "success.light",
            }}
          >
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              ✓ Category Selected
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedCategory.name}
            </Typography>
          </Box>
        )}

        {/* Category Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Granite, Tiles, Marble, etc."
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {selectedCategory ? (
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
                      Update Category
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Category
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
                      Add Category
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
            Are you sure you want to delete category{" "}
            <strong>{selectedCategory?.name}</strong>? This action cannot be
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
