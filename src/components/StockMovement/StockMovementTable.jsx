import { useState } from "react";
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, TablePagination, Chip
} from "@mui/material";

export default function StockMovementTable({ rows }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const data = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">IN</TableCell>
            <TableCell align="right">OUT</TableCell>
            <TableCell align="right">Balance</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.date}</TableCell>
              <TableCell>{r.referenceNo}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={r.referenceType}
                  color={r.quantityChange > 0 ? "success" : "error"}
                />
              </TableCell>

              <TableCell align="right" sx={{ color: "green" }}>
                {r.quantityChange > 0 ? r.quantityChange : "-"}
              </TableCell>

              <TableCell align="right" sx={{ color: "red" }}>
                {r.quantityChange < 0 ? Math.abs(r.quantityChange) : "-"}
              </TableCell>

              <TableCell align="right">
                {r.runningBalance}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
      />
    </>
  );
}
