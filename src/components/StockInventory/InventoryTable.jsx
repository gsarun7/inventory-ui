import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer,
  TablePagination
} from "@mui/material";

export default function InventoryTable({
  rows, page, size, total,
  onPageChange, onSizeChange
}) {
  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Current Stock</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>HSN</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data
                </TableCell>
              </TableRow>
            ) : (
              rows.map(r => (
                <TableRow key={r.productId}>
                  <TableCell>{r.productName}</TableCell>
                  <TableCell align="right">{r.quantity}</TableCell>
                  <TableCell>{r.unit}</TableCell>
                  <TableCell>{r.hsn}</TableCell>
                  <TableCell>{r.lastUpdated}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={size}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => {
          onSizeChange(parseInt(e.target.value, 10));
          onPageChange(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
