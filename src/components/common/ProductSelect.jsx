import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchProductsByCategory } from "../../services/api";

export default function ProductSelect({
  categoryId,
  value,
  onChange,
  error
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    fetchProductsByCategory(categoryId)
      .then(res => setProducts(res.data));
  }, [categoryId]);

  return (
    <Autocomplete
      options={products}
      getOptionLabel={(opt) => opt.name}
      value={products.find(p => p.id === value) || null}
      onChange={(e, val) => onChange(val?.id || "")}
      disabled={!categoryId}
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
