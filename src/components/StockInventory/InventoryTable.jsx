import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  TablePagination
} from "@mui/material";

export default function InventoryTable({
  rows = [],          // ✅ safe default
  page = 0,
  size = 10,
  total = 0,
  onPageChange,
  onSizeChange
}) {
  const safeRows = Array.isArray(rows) ? rows : [];

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
            {safeRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No stock data found
                </TableCell>
              </TableRow>
            ) : (
              safeRows.map((r, index) => (
                <TableRow key={r.productId ?? index}>
                  <TableCell>{r.productName}</TableCell>

                  <TableCell align="right">
                    {r.currentStock ?? 0}
                  </TableCell>

                  <TableCell>{r.unit ?? "-"}</TableCell>

                  <TableCell>{r.hsn ?? "-"}</TableCell>

                  <TableCell>
                    {r.lastUpdated
                      ? new Date(r.lastUpdated).toLocaleString()
                      : "-"}
                  </TableCell>
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
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => {
          onSizeChange(parseInt(e.target.value, 10));
          onPageChange(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
