import { useState, useEffect } from "react";
import { getCategories, addProduct } from "../services/api";
import PageContainer from "./PageContainer";
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography
} from "@mui/material";

export default function AddItem() {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: ""
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.categoryId) {
      alert("Please select a category");
      return;
    }

    const payload = {
      name: form.name,
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
      category: {
        id: Number(form.categoryId)
      }
    };

    await addProduct(payload);
    alert("Item added successfully");

    setForm({ name: "", categoryId: "", purchasePrice: "", sellingPrice: "", stock: "" });
  };

  return (
    <PageContainer>
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>Add Item</Typography>

      <TextField
        fullWidth
        label="Item Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        select
        fullWidth
        label="Category"
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        margin="normal"
      >
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Purchase Price"
        name="purchasePrice"
        value={form.purchasePrice}
        onChange={handleChange}
        type="number"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Selling Price"
        name="sellingPrice"
        value={form.sellingPrice}
        onChange={handleChange}
        type="number"
        margin="normal"
      />

      <TextField
        fullWidth
        label="Stock"
        name="stock"
        value={form.stock}
        onChange={handleChange}
        type="number"
        margin="normal"
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Add Product
      </Button>
    </Paper>
    </PageContainer>
  );
}
