// pages/AddProduct.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productApi";
import { getAllUnits } from "../services/unitApi";
import { getAllCategories } from "../services/categoryApi";

export default function AddProduct() {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productSearchInput, setProductSearchInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    unit_id: "",
    hsn: "",
    category_id: "",
    size: "",
    brand: "",
    grade: "",
    rate: "",
  });

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadUnits();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setProductLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setProductLoading(false);
  };

  const loadUnits = async () => {
    const data = await getAllUnits();
    setUnits(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  // Handle product selection from autocomplete
  const handleProductSelect = (event, value) => {
    setSelectedProduct(value);

    if (value) {
      // Auto-populate form with selected product data
      setFormData({
        name: value.name || "",
        unit_id: value.unit_id || "",
        hsn: value.hsn || "",
        category_id: value.category_id || "",
        size: value.size || "",
        brand: value.brand || "",
        grade: value.grade || "",
        rate: value.rate || "",
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
      unit_id: "",
      hsn: "",
      category_id: "",
      size: "",
      brand: "",
      grade: "",
      rate: "",
    });
    setSelectedProduct(null);
    setProductSearchInput("");
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 4000);
  };

  // Add new product
  const handleAdd = async () => {
    if (!formData.name || !formData.category_id) {
      showAlert("error", "Please enter product name and select category");
      return;
    }

    setSubmitLoading(true);
    const result = await createProduct(formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Product added successfully!");
      clearForm();
      loadProducts(); // Reload product list
    } else {
      showAlert("error", result.message || "Failed to add product");
    }
  };

  // Update existing product
  const handleUpdate = async () => {
    if (!selectedProduct) return;

    if (!formData.name || !formData.category_id) {
      showAlert("error", "Please enter product name and select category");
      return;
    }

    setSubmitLoading(true);
    const result = await updateProduct(selectedProduct.id, formData);
    setSubmitLoading(false);

    if (result.success) {
      showAlert("success", "Product updated successfully!");
      clearForm();
      loadProducts(); // Reload product list
    } else {
      showAlert("error", result.message || "Failed to update product");
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!selectedProduct) return;

    setSubmitLoading(true);
    const result = await deleteProduct(selectedProduct.id);
    setSubmitLoading(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      showAlert("success", "Product deleted successfully!");
      clearForm();
      loadProducts(); // Reload product list
    } else {
      showAlert("error", result.message || "Failed to delete product");
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "";
  };

  // Get unit symbol by ID
  const getUnitSymbol = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.symbol : "";
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {selectedProduct ? "Edit Product" : "Add Product"}
      </Typography>

      {/* Alert */}
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, maxWidth: 900 }}>
        {/* Search Product */}
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            fullWidth
            options={products}
            value={selectedProduct}
            onChange={handleProductSelect}
            inputValue={productSearchInput}
            onInputChange={(event, newInputValue) => {
              setProductSearchInput(newInputValue);
            }}
            getOptionLabel={(option) =>
              `${option.name} - ${getCategoryName(option.category_id)}`
            }
            loading={productLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Existing Product"
                placeholder="Search by product name to edit..."
                helperText="Search to edit existing product, or leave empty to add new"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <AddBoxIcon sx={{ color: "action.active", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {productLoading ? (
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
                      label={getCategoryName(option.category_id)}
                      size="small"
                      color="primary"
                      sx={{ fontSize: "0.75rem", height: 20 }}
                    />
                    {option.size && (
                      <Chip
                        label={option.size}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem", height: 20 }}
                      />
                    )}
                    {option.hsn && (
                      <Chip
                        label={`HSN: ${option.hsn}`}
                        size="small"
                        sx={{ fontSize: "0.75rem", height: 20 }}
                      />
                    )}
                  </Box>
                </Box>
              </li>
            )}
            filterOptions={(options, { inputValue }) => {
              const searchTerm = inputValue.toLowerCase();
              return options.filter((option) =>
                option.name.toLowerCase().includes(searchTerm)
              );
            }}
            noOptionsText="No products found"
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />
        </Box>

        {/* Display Selected Product Info */}
        {selectedProduct && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "primary.lighter",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <Typography variant="subtitle2" color="primary" gutterBottom>
              ✓ Product Selected
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedProduct.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Category:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {getCategoryName(selectedProduct.category_id)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Product Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Product Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Italian Marble, Vitrified Tiles"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Category"
                  onChange={(e) =>
                    handleInputChange("category_id", e.target.value)
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit_id}
                  label="Unit"
                  onChange={(e) => handleInputChange("unit_id", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Unit</em>
                  </MenuItem>
                  {units.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="HSN Code"
                value={formData.hsn}
                onChange={(e) => handleInputChange("hsn", e.target.value)}
                placeholder="e.g., 6907, 6802"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="e.g., 2x2, 600x600mm"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="e.g., Kajaria, Somany"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grade"
                value={formData.grade}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                placeholder="e.g., A, B, Premium"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rate"
                type="number"
                value={formData.rate}
                onChange={(e) => handleInputChange("rate", e.target.value)}
                placeholder="Price per unit"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                {selectedProduct ? (
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
                      Update Product
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={submitLoading}
                    >
                      Delete Product
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
                      Add Product
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
            Are you sure you want to delete product{" "}
            <strong>{selectedProduct?.name}</strong>? This action cannot be
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
