import { useEffect, useState } from "react";
import {
  Grid, TextField, Button, Autocomplete, FormHelperText
} from "@mui/material";
import axios from "axios";

export default function StockMovementFilters({ onSearch }) {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [warehouse, setWarehouse] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [errors, setErrors] = useState({});

  /* ---------------- Load Masters ---------------- */

  useEffect(() => {
    axios.get("/api/categories").then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!category) {
      setProducts([]);
      setProduct(null);
      setWarehouses([]);
      setWarehouse(null);
      return;
    }

    axios.get("/api/products", {
      params: { categoryId: category.id }
    }).then(res => {
      setProducts(res.data);
      setProduct(null);
      setWarehouses([]);
      setWarehouse(null);
    });
  }, [category]);

  useEffect(() => {
    if (!product) {
      setWarehouses([]);
      setWarehouse(null);
      return;
    }

    axios.get(`/api/warehouses/by-product/${product.id}`)
      .then(res => {
        setWarehouses(res.data);
        setWarehouse(null);
      });
  }, [product]);

  /* ---------------- Validation ---------------- */

  const validate = () => {
    const e = {};
    if (!category) e.category = "Category is required";
    if (!product) e.product = "Product is required";
    if (!warehouse) e.warehouse = "Warehouse is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- Actions ---------------- */

  const submit = () => {
    if (!validate()) return;

    onSearch({
      categoryId: category.id,
      productId: product.id,
      warehouseId: warehouse.id,
      fromDate,
      toDate
    });
  };

  const clearFilters = () => {
    setCategory(null);
    setProduct(null);
    setWarehouse(null);
    setProducts([]);
    setWarehouses([]);
    setFromDate("");
    setToDate("");
    setErrors({});
  };

  /* ---------------- UI ---------------- */

  return (
    <Grid container spacing={2} mb={2}>

      {/* Category */}
      <Grid item xs={3}>
        <Autocomplete
          options={categories}
          getOptionLabel={o => o.name}
          value={category}
          onChange={(e, v) => {
            setCategory(v);
            setErrors(prev => ({ ...prev, category: null }));
          }}
          renderInput={(p) =>
            <TextField {...p} label="Category *" size="small" error={!!errors.category} />
          }
        />
        {errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
      </Grid>

      {/* Product */}
      <Grid item xs={3}>
        <Autocomplete
          options={products}
          getOptionLabel={o => o.name}
          value={product}
          onChange={(e, v) => {
            setProduct(v);
            setErrors(prev => ({ ...prev, product: null }));
          }}
          renderInput={(p) =>
            <TextField {...p} label="Product *" size="small" error={!!errors.product} />
          }
          disabled={!category}
        />
        {errors.product && <FormHelperText error>{errors.product}</FormHelperText>}
      </Grid>

      {/* Warehouse */}
      <Grid item xs={3}>
        <Autocomplete
          options={warehouses}
          getOptionLabel={o => o.name}
          value={warehouse}
          onChange={(e, v) => {
            setWarehouse(v);
            setErrors(prev => ({ ...prev, warehouse: null }));
          }}
          renderInput={(p) =>
            <TextField {...p} label="Warehouse *" size="small" error={!!errors.warehouse} />
          }
          disabled={!product}
        />
        {errors.warehouse && <FormHelperText error>{errors.warehouse}</FormHelperText>}
      </Grid>

      {/* Dates */}
      <Grid item xs={1.5}>
        <TextField
          type="date"
          label="From"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
      </Grid>

      <Grid item xs={1.5}>
        <TextField
          type="date"
          label="To"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </Grid>

      {/* Buttons */}
      <Grid item xs={2}>
        <Button
          variant="contained"
          fullWidth
          sx={{ height: 40, mb: 1 }}
          onClick={submit}
        >
          Search
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ height: 36 }}
          onClick={clearFilters}
        >
          Clear
        </Button>
      </Grid>

    </Grid>
  );
}
