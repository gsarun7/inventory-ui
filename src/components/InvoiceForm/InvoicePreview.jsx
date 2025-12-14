import React from "react";

import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

/**
 * Printable invoice preview. Use the same structure as your sample.
 * Wrap this in a container with class "invoice-print" (invoice.css targets this for print).
 */
export default function InvoicePreview({ data }) {
  const blankRows = 9; // number of blank rows to make printed table height match sample

  return (
    <Paper elevation={0} className="invoice-print invoice-container">
      {/* header */}
      <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
        Tax Invoice
      </Typography>

      {/* Main content container */}
      <Box sx={{ border: "1px solid #000" }}>
        {/* Header section - Supplier & Invoice Details */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem", wordWrap: "break-word" }}>{data.supplierName}</Typography>
            <Typography sx={{ fontSize: "0.9rem", wordWrap: "break-word", whiteSpace: "normal" }}>{data.supplierAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1, borderRight: "1px solid #000" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Invoice No:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem" }}>{data.invoiceNo}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>e-Way Bill No:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem" }}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Delivery Note:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem" }}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Supplier ref:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem"}}></Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Dated:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}>{data.invoiceDate}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Mode/Terms of Payment:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}>{data.paymentMode}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Delivery Date:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Other Reference(s):</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem" }}></Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Consignee section */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={{ fontWeight: "bold" }}>Consignee</Typography>
            <Typography>{data.consigneeName}</Typography>
            <Typography>{data.consigneeAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1, borderRight: "1px solid #000" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Buyer's order No:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Despatch Document No.:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold",fontSize: "0.75rem" }}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Despatched through:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Bill of Lading/LR-RR No.:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}></Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Buyer's order No Dated:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Destination:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}>Tarikere</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Motor Vehicle No:</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}>KA 14 C 8935</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Buyer section */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={{ fontWeight: "bold" }}>
              Buyer (if other than consignee)
            </Typography>
            <Typography>{data.buyerName}</Typography>
            <Typography>{data.buyerAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '40%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>Terms of Delivery:</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" ,fontSize: "0.75rem"}}>No returns after 15 days</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* items table */}
      <Box sx={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", borderRight: '1px solid #000' }}>Sl</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "46%", borderRight: '1px solid #000' }}>Description of Goods</TableCell>
              <TableCell sx={{ fontWeight: "bold", borderRight: '1px solid #000' }}>HSN/SAC</TableCell>
              <TableCell sx={{ fontWeight: "bold", borderRight: '1px solid #000' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: "bold", borderRight: '1px solid #000' }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: "bold", borderRight: '1px solid #000' }}>per</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.items.map((it, i) => (
              <TableRow key={i}>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{i + 1}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{it.name || "\u00A0"}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{it.hsn || "\u00A0"}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{it.qty || "\u00A0"}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{it.rate || "\u00A0"}</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>{it.per || "\u00A0"}</TableCell>
                <TableCell>{it.amount || "\u00A0"}</TableCell>
              </TableRow>
            ))}

            {/* blank rows to reach consistent print height */}
            {Array.from({ length: Math.max(0, blankRows - data.items.length) }).map((_, i) => (
              <TableRow key={`blank-${i}`}>
                <TableCell sx={{ borderRight: '1px solid #000' }}>&nbsp;</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}></TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}></TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}></TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}></TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {/* totals */}
      <Grid container sx={{ border: "1px solid #000", borderTop: "none", mt: 0 }}>
        <Grid item xs={9} sx={{ p: 1, borderRight: "1px solid #000" }}>
          <Typography>Amount Chargeable (in words):</Typography>
          <Typography sx={{ fontWeight: "bold" }}>{data.amountInWords}</Typography>
        </Grid>

        <Grid item xs={3} sx={{ p: 1, textAlign: "right" }}>
          <Typography>Subtotal: ₹ {data.subtotal}</Typography>
          <Typography>GST ({data.gstPercent}%): ₹ {data.gstAmount}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Grand Total: ₹ {data.grandTotal}</Typography>
        </Grid>
      </Grid>
      {/* footer */}
      <Grid container sx={{
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        boxSizing: "border-box"
      }}>
        <Grid item
          xs={6}
        >
          <Typography sx={{ fontWeight: "bold" }}>Declaration</Typography>
          <Typography sx={{ fontSize: "12px" }}>We declare that this invoice shows the actual price of</Typography>
          <Typography sx={{ fontSize: "12px" }}>the goods described and that all particulars are true and correct.</Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={{ fontWeight: "bold" }}>Company Bank Details</Typography>
          <Typography sx={{ fontSize: "12px" }}>Bank: SBI</Typography>
          <Typography sx={{ fontSize: "12px" }}>A/C No: XXXXXX</Typography>
          <Typography sx={{ fontSize: "12px" }}>IFSC: SBIN000XXXX</Typography>
        </Grid>
      </Grid>
      <Grid container sx={{
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        boxSizing: "border-box"
      }}>
        <Grid item xs={6} sx={{
          borderRight: "1px solid #000",
          borderRight: "1px solid #000",
          p: 1,
          width: "50%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"



        }} >
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: "12px" }}>Customer's Seal and Signature</Typography>
            <Typography></Typography>
            <Typography></Typography>

          </Box>
        </Grid>
        <Grid item xs={6} sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: "12px" }}>for NITTUR GRANITE & TILES - J D KATTE SHOWROOM</Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography sx={{ fontSize: "10px" }}>-Authorised Signatory</Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography align="center" sx={{ mt: 1, fontSize: 12 }}>
        SUBJECT TO BHADRAVATI JURISDICTION — This is a Computer Generated Invoice
      </Typography>
    </Paper>
  );
}
