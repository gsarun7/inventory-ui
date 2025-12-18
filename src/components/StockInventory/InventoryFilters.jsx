import { Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import CategorySelect from "../common/CategorySelect";
import WarehouseSelect from "../common/WarehouseSelect";

export default function InventoryFilters({ onChange }) {

  const [categoryId, setCategoryId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryId && warehouseId) {
      onChange({ categoryId, warehouseId });
      setErrors({});
    }
  }, [categoryId, warehouseId]);

  const clear = () => {
    setCategoryId("");
    setWarehouseId("");
    onChange(null);
    setErrors({});
  };

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={4}>
        <CategorySelect
          value={categoryId}
          onChange={setCategoryId}
          error={!categoryId && errors.category}
        />
      </Grid>

      <Grid item xs={4}>
        <WarehouseSelect
          value={warehouseId}
          onChange={setWarehouseId}
          error={!warehouseId && errors.warehouse}
        />
      </Grid>

      <Grid item xs={4}>
        <Button variant="outlined" onClick={clear}>
          Clear Filters
        </Button>
      </Grid>
    </Grid>
  );
}
