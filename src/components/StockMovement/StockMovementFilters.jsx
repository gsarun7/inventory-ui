import { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import CategorySelect from "../common/CategorySelect";
import ProductSelect from "../common/ProductSelect";
import WarehouseSelect from "../common/WarehouseSelect";

export default function StockMovementFilters({ onSearch }) {

  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [errors, setErrors] = useState({});

  /* ---------------- Validation ---------------- */

  const validate = () => {
    const e = {};
    if (!categoryId) e.category = "Category is required";
    if (!productId) e.product = "Product is required";
    if (!warehouseId) e.warehouse = "Warehouse is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- Actions ---------------- */

  const submit = () => {
    if (!validate()) return;

    onSearch({
      categoryId,
      productId,
      warehouseId,
      fromDate,
      toDate
    });
  };

  const clearFilters = () => {
    setCategoryId("");
    setProductId("");
    setWarehouseId("");
    setFromDate("");
    setToDate("");
    setErrors({});
  };

  /* ---------------- UI ---------------- */

  return (
    <Grid container spacing={2} mb={2}>

      {/* Category */}
      <Grid item xs={3}>
        <CategorySelect
          value={categoryId}
          onChange={(v) => {
            setCategoryId(v);
            setProductId("");
            setWarehouseId("");
            setErrors(prev => ({ ...prev, category: null }));
          }}
          error={errors.category}
        />
      </Grid>

      {/* Product */}
      <Grid item xs={3}>
        <ProductSelect
          categoryId={categoryId}
          value={productId}
          onChange={(v) => {
            setProductId(v);
            setWarehouseId("");
            setErrors(prev => ({ ...prev, product: null }));
          }}
          error={errors.product}
        />
      </Grid>

      {/* Warehouse */}
      <Grid item xs={3}>
        <WarehouseSelect
          value={warehouseId}
          onChange={(v) => {
            setWarehouseId(v);
            setErrors(prev => ({ ...prev, warehouse: null }));
          }}
          error={errors.warehouse}
        />
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
