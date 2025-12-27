import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "../../services/api";

export default function ProductSelect({ categoryId, value, onChange, error }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    fetchProductsByCategory(categoryId).then((res) =>
      setProducts(res.data || [])
    );
  }, [categoryId]);

  console.log("Product select Component is rendering");
  console.log({ categoryId, products });
  console.log("Selected value:", value);
  return (
    <Autocomplete
      options={products}
      getOptionLabel={(opt) => opt?.name || ""}
      value={products.find((p) => String(p.id) === String(value)) || null}
      isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
      onChange={(e, newVal) => {
        onChange(newVal?.id || "", newVal);
      }}
      disabled={!categoryId}
      clearOnBlur={false}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Product *"
          size="small"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
}
