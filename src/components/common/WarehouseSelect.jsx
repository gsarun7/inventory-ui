import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchWarehouses } from "../../services/api.js";
import axios from "axios";

export default function WarehouseSelect({ value, onChange, error }) {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetchWarehouses().then((res) => setWarehouses(res.data));
  }, []);

  console.log("Warehouse select Component is rendering");
  console.log({ warehouses });
  console.log("Selected value:", value);
  return (
    <Autocomplete
      options={warehouses}
      getOptionLabel={(opt) => opt.name}
      value={
        Array.isArray(warehouses)
          ? warehouses.find((w) => w.id === value) || null
          : null
      }
      onChange={(e, val) => onChange(val?.id || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Warehouse *"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
}
