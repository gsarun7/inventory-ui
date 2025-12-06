import { useEffect, useState } from "react";
import { getProducts, createSale } from "../services/api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem } from "@mui/material";

import PageContainer from "../components/PageContainer";
export default function Sales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saleResponse, setSaleResponse] = useState(null);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const addToCart = () => {
    if (!selectedProductId || !quantity) return alert("Select product & quantity");

    const product = products.find(p => p.id === parseInt(selectedProductId));
    if (!product) return alert("Product not found");
    if (quantity > product.stock) return alert("Not enough stock");

    const existing = cart.find(c => c.itemId === product.id);
    if (existing) {
      existing.qty += parseInt(quantity);
    } else {
      cart.push({
        itemId: product.id,
        itemName: product.name,
        categoryName: product.category?.name || "N/A",
        priceEach: product.sellingPrice,
        qty: parseInt(quantity)
      });
    }
    setCart([...cart]);
    setSelectedProductId("");
    setQuantity("");
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c.itemId !== itemId));
  };

  const updateQty = (itemId, qty) => {
    setCart(cart.map(c => c.itemId === itemId ? { ...c, qty: parseInt(qty) } : c));
  };

  const handleSale = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const saleRequest = { items: cart.map(({ itemId, qty, priceEach }) => ({ itemId, qty, priceEach })) };

    try {
      const res = await createSale(saleRequest);
      setSaleResponse(res);
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setCart([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.qty * item.priceEach, 0);

  const printReceipt = () => {
    const receipt = `
      Sale ID: ${saleResponse.id}
      Total: ${saleResponse.totalAmount}
      Items:
      ${saleResponse.items.map(i => `${i.itemName} x ${i.qty} @ ${i.priceEach}`).join("\n")}
    `;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<pre>${receipt}</pre>`);
    newWindow.print();
  };

  return (
   <PageContainer>
    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
      Multi-Product Sales / Billing
    </h2>

    {/* Product selector + Add button */}
    <div style={{ 
      display: "flex", 
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px"
    }}>
      <Select
        value={selectedProductId}
        onChange={e => setSelectedProductId(e.target.value)}
        displayEmpty
        style={{ width: 250 }}
      >
        <MenuItem value="">Select Product</MenuItem>
        {products.map(p => (
          <MenuItem key={p.id} value={p.id}>
            {p.name} (Stock: {p.stock})
          </MenuItem>
        ))}
      </Select>

      <TextField
        type="number"
        min="1"
        label="Qty"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        style={{ width: 100 }}
      />

      <Button variant="contained" onClick={addToCart}>
        Add
      </Button>
    </div>

    {/* Cart Table */}
    {cart.length > 0 && (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price Each</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cart.map(item => (
              <TableRow key={item.itemId}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.categoryName}</TableCell>

                <TableCell>
                  <TextField
                    type="number"
                    value={item.qty}
                    onChange={e => updateQty(item.itemId, e.target.value)}
                    style={{ width: 70 }}
                  />
                </TableCell>

                <TableCell>₹ {item.priceEach}</TableCell>
                <TableCell>₹ {item.qty * item.priceEach}</TableCell>

                <TableCell>
                  <Button 
                    color="error" 
                    onClick={() => removeFromCart(item.itemId)}
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={4}><strong>Total</strong></TableCell>
              <TableCell colSpan={2}><strong>₹ {total}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )}

    {cart.length > 0 && (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSale}
        >
          Complete Sale
        </Button>
      </div>
    )}

    {saleResponse && (
      <Paper sx={{ p: 3, mt: 3 }}>
        <h3>Bill / Receipt</h3>
        <p><strong>Sale ID:</strong> {saleResponse.id}</p>
        <p><strong>Total Amount:</strong> ₹ {saleResponse.totalAmount}</p>

        <ul>
          {saleResponse.items.map((line, idx) => (
            <li key={idx}>
              {line.itemName} × {line.qty} @ ₹{line.priceEach}
            </li>
          ))}
        </ul>

        <Button variant="outlined" onClick={printReceipt}>
          Print Receipt
        </Button>
      </Paper>
    )}
  </PageContainer>
);
}
