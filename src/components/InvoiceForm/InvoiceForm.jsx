import React from "react";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function InvoiceForm({
  form,
  productList,
  updateField,
  updateItem,
  addItem,
  removeItem,
}) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Invoice No"
            value={form.invoiceNo}
            onChange={(e) => updateField("invoiceNo", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="date"
            label="Invoice Date"
            InputLabelProps={{ shrink: true }}
            value={form.invoiceDate}
            onChange={(e) => updateField("invoiceDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Payment Mode"
            value={form.paymentMode}
            onChange={(e) => updateField("paymentMode", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Supplier Name"
            value={form.supplierName}
            onChange={(e) => updateField("supplierName", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Supplier Address"
            value={form.supplierAddress}
            onChange={(e) => updateField("supplierAddress", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Consignee Name"
            value={form.consigneeName}
            onChange={(e) => updateField("consigneeName", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Consignee Address"
            value={form.consigneeAddress}
            onChange={(e) => updateField("consigneeAddress", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Buyer Name"
            value={form.buyerName}
            onChange={(e) => updateField("buyerName", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Buyer Address"
            value={form.buyerAddress}
            onChange={(e) => updateField("buyerAddress", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Items table */}
      <div style={{ marginTop: 16 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Sr</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Description of Goods</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>HSN/SAC</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Quantity</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Rate</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>per</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Amount</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {form.items.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ borderRight: '1px solid #ddd' }}>{idx + 1}</TableCell>
                <TableCell style={{ minWidth: 220 }} sx={{ borderRight: '1px solid #ddd' }}>
                  <Autocomplete
                    options={productList}
                    getOptionLabel={(opt) => opt.name}
                    freeSolo
                    size="small"
                    onChange={(e, val, reason) => {
                      if (reason === 'selectOption' && val && typeof val === 'object') {
                        // Selected from dropdown - populate all fields
                        updateItem(idx, "name", val.name);
                        updateItem(idx, "hsn", val.hsn);
                        updateItem(idx, "rate", val.rate.toString());
                      } else if (reason === 'createOption' || reason === 'clear') {
                        // User typed or cleared - just update name
                        updateItem(idx, "name", val || "");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select / Type product"
                      />
                    )}
                  />
                </TableCell>

                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                  <TextField
                    size="small"
                    value={item.hsn}
                    onChange={(e) => updateItem(idx, "hsn", e.target.value)}
                  />
                </TableCell>

                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  />
                </TableCell>
                              <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                  <TextField
                    size="small"
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                  <TextField
                    size="small"
                    value={item.per}
                    onChange={(e) => updateItem(idx, "per", e.target.value)}
                   
                  />
                </TableCell>
                <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                  <TextField size="small" value={item.amount} disabled />
                </TableCell>

                <TableCell>
                  <IconButton onClick={() => removeItem(idx)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div style={{ marginTop: 8 }}>
          <Button variant="outlined" onClick={addItem}>
            + Add Item
          </Button>
        </div>
      </div>

      {/* totals quick display */}
      <div style={{ marginTop: 12, display: "flex", gap: 24 }}>
        <TextField
          label="GST %"
          type="number"
          size="small"
          value={form.gstPercent}
          onChange={(e) => updateField("gstPercent", Number(e.target.value))}
        />
        <TextField label="Subtotal" size="small" value={form.subtotal} disabled />
        <TextField label="GST Amount" size="small" value={form.gstAmount} disabled />
        <TextField label="Grand Total" size="small" value={form.grandTotal} disabled />
      </div>
    </div>
  );
}
