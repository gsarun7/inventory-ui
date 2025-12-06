import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography, TablePagination, CircularProgress, Box
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getProducts, deleteProduct } from "../services/api";

export default function InventoryTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
if (!window.confirm("Are you sure you want to delete this item?")) return;

  await deleteProduct(id);
  fetchData();
  };

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" mb={2}>Inventory</Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Purchase Price</strong></TableCell>
                  <TableCell><strong>Selling Price</strong></TableCell>
                  <TableCell><strong>Stock</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category?.name ?? "—"}</TableCell>
                      <TableCell>₹{p.purchasePrice}</TableCell>
                      <TableCell>₹{p.sellingPrice}</TableCell>
                      <TableCell>
                        {p.stock <= 10 ? (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Low ({p.stock})
                          </span>
                        ) : (
                          p.stock
                        )}
                      </TableCell>

                      <TableCell>
                        <IconButton color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(p.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>

            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={products.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
}
