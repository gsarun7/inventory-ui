// ItemsTable.jsx
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";

import {
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, TextField, Button, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ItemsTable({ items, onItemChange, onAddRow, onRemoveRow ,inventoryList}) {
  // items: array of rows
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 1100, borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow>
            <TableCell>Sr No</TableCell>
            <TableCell>HSN Code</TableCell>
            <TableCell>Description of Goods</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Grade</TableCell>
            <TableCell>QTY</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>

              <TableCell sx={{ maxWidth: 120 }}>
                <Autocomplete
  freeSolo
  options={inventoryList.map((it) => it.name)}
  value={row.description || ""}
  onChange={(e, newValue) => {
    onItemChange(idx, "description", newValue || "");

    // Find full item
    const selected = inventoryList.find(
      (it) => it.name.toLowerCase() === (newValue || "").toLowerCase()
    );

    if (selected) {
      onItemChange(idx, "brand", selected.brand);
      onItemChange(idx, "hsn", selected.hsn);
      onItemChange(idx, "size", selected.size);
      onItemChange(idx, "grade", selected.grade);
      onItemChange(idx, "rate", selected.rate);
    }
  }}
  renderInput={(params) => (
    <TextField {...params} size="small" placeholder="Item Name" />
  )}
/>

              </TableCell>

              <TableCell sx={{ minWidth: 260 }}>
                <TextField
                  size="small"
                  multiline
                  value={row.description || ""}
                  onChange={(e) => onItemChange(idx, "description", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ minWidth: 140 }}>
                <TextField
                  size="small"
                  value={row.brand || ""}
                  onChange={(e) => onItemChange(idx, "brand", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ minWidth: 180 }}>
                <TextField
                  size="small"
                  value={row.size || ""}
                  onChange={(e) => onItemChange(idx, "size", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 100 }}>
                <TextField
                  size="small"
                  value={row.grade || ""}
                  onChange={(e) => onItemChange(idx, "grade", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 100 }}>
                <TextField
                  size="small"
                  type="number"
                  value={row.qty || ""}
                  onChange={(e) => onItemChange(idx, "qty", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 100 }}>
                <TextField
                  size="small"
                  value={row.unit || ""}
                  onChange={(e) => onItemChange(idx, "unit", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 120 }}>
                <TextField
                  size="small"
                  type="number"
                  value={row.rate || ""}
                  onChange={(e) => onItemChange(idx, "rate", e.target.value)}
                />
              </TableCell>

              <TableCell sx={{ maxWidth: 140 }}>
                <TextField
                  size="small"
                  value={row.amount || ""}
                  disabled
                />
              </TableCell>

              <TableCell>
                <IconButton color="error" onClick={() => onRemoveRow(idx)} size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={11} sx={{ textAlign: "left", p: 1 }}>
              <Button startIcon={<AddIcon />} onClick={onAddRow} size="small">Add Row</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
