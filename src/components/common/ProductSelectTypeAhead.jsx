import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { searchProducts, fetchCurrentStock } from "../../services/api";

export default function ProductSelectTypeAhead({
  warehouseId,
  value,
  onSelect
}) {
  const [options, setOptions] = useState([]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(o) => o.name || ""}
      onInputChange={(_, val) => {
        if (val.length >= 2) {
          searchProducts(val).then(r => setOptions(r.data));
        }
      }}
      onChange={async (_, product) => {
        if (!product || !warehouseId) return;

        const stockRes = await fetchCurrentStock(product.id, warehouseId);

        onSelect({
          productId: product.id,
          productName: product.name,
          categoryName: product.categoryName,
          currentStock: stockRes.data.quantity
        });
      }}
      renderInput={(p) =>
        <TextField {...p} label="Product" size="small" />
      }
    />
  );
}
