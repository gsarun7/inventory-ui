import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CategorySelect({ value, onChange, error }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data));
  }, []);

  return (
    <Autocomplete
      options={categories}
      getOptionLabel={(opt) => opt.name}
      value={Array.isArray(categories) ? categories.find(c => c.id === value) || null : null}
      onChange={(e, val) => onChange(val?.id || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category *"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
}
