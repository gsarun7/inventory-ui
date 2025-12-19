import React from "react";

import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";

/**
 * Printable invoice preview. Use the same structure as your sample.
 * Wrap this in a container with class "invoice-print" (invoice.css targets this for print).
 */

// Centralized font styles for easy control
const fontStyles = {
  title: { fontSize: "1.4rem", fontWeight: "bold" },        // Main "Tax Invoice" title
  header: { fontSize: "0.8rem" },                          // Supplier/consignee names and addresses
  label: { fontSize: "0.8rem" },                            // Field labels
  footer: { fontSize: "0.8rem" },                          // Footer text
  small: { fontSize: "0.8rem" },                            // Small text like signatures
  headerBold: { fontSize: "0.8rem", fontWeight: "bold" },  // Bold headers
  labelBold: { fontSize: "0.8rem", fontWeight: "bold" },    // Bold labels/values
  footerBold: { fontSize: "0.8rem", fontWeight: "bold" }   // Bold footer text
};

// Centralized table styles for easy control
const tableStyles = {
  headerCell: {
    fontWeight: "bold",
    borderRight: '1px solid #000',
    fontSize: "0.8rem"
  },
  headerCellLast: {
    fontWeight: "bold",
    fontSize: "0.8rem"
  },
  bodyCell: {
    borderRight: '1px solid #000',
    fontSize: "0.75rem"
  },
  bodyCellLast: {
    fontSize: "0.75rem"
  }
};

export default function InvoicePreview({ data }) {
  const blankRows = 9; // number of blank rows to make printed table height match sample

  return (
    <Paper elevation={0} className="invoice-print invoice-container">
      {/* header */}
      <Typography variant="h6" align="center" sx={{ ...fontStyles.title, mb: 1 }}>
        Tax Invoice
      </Typography>

      {/* Main content container */}
      <Box sx={{ border: "1px solid #000" }}>
        {/* Header section - Supplier & Invoice Details */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={{ ...fontStyles.headerBold, wordWrap: "break-word" }}>{data.supplierName}</Typography>
            <Typography sx={{ ...fontStyles.header, wordWrap: "break-word", whiteSpace: "normal" }}>{data.supplierAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1, borderRight: "1px solid #000" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Invoice No:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}>{data.invoiceNo}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>e-Way Bill No:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Delivery Note:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Supplier ref:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Dated:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}>{data.invoiceDate}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Mode/Terms of Payment:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}>{data.paymentMode}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Delivery Date:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Other Reference(s):</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Consignee section */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={fontStyles.headerBold}>Consignee</Typography>
            <Typography sx={fontStyles.header}>{data.consigneeName}</Typography>
            <Typography sx={fontStyles.header}>{data.consigneeAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1, borderRight: "1px solid #000" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Buyer's order No:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Despatch Document No.:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Despatched through:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Bill of Lading/LR-RR No.:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ width: '20%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Buyer's order No Dated:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Destination:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}>Tarikere</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2" sx={fontStyles.label}>Motor Vehicle No:</Typography>
                <Typography variant="body2" sx={fontStyles.labelBold}>KA 14 C 8935</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Buyer section */}
        <Grid container sx={{ borderBottom: "1px solid #000" }}>
          <Grid item xs={12} sx={{ width: '60%', p: 1, borderRight: "1px solid #000" }}>
            <Typography sx={fontStyles.headerBold}>
              Buyer (if other than consignee)
            </Typography>
            <Typography sx={fontStyles.header}>{data.buyerName}</Typography>
            <Typography sx={fontStyles.header}>{data.buyerAddress}</Typography>
          </Grid>

          <Grid item xs={12} sx={{ width: '40%', p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={fontStyles.label}>Terms of Delivery:</Typography>
              <Typography variant="body2" sx={fontStyles.labelBold}>No returns after 15 days</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* items table */}
      <Box sx={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000" }}>
        <Table size="small">
          <TableHead>
            <TableRow >
              <TableCell sx={tableStyles.headerCell}>Sl</TableCell>
              <TableCell sx={tableStyles.headerCell}>Est. Area</TableCell>
              <TableCell sx={tableStyles.headerCell}>Usage</TableCell>
              <TableCell sx={tableStyles.headerCell}>Category</TableCell>
              <TableCell sx={{ ...tableStyles.headerCell, width: "30%" }}>Description of Goods</TableCell>
              <TableCell sx={tableStyles.headerCell}>HSN/SAC</TableCell>
              <TableCell sx={tableStyles.headerCell}>Quantity</TableCell>
              <TableCell sx={tableStyles.headerCell}>Rate</TableCell>
              <TableCell sx={tableStyles.headerCell}>per</TableCell>
              <TableCell sx={tableStyles.headerCellLast}>Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.items.map((it, i) => (
              <TableRow key={i}>
                <TableCell sx={tableStyles.bodyCell}>{i + 1}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.estimatedArea || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.usage || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.category || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.name || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.hsn || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.qty || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.rate || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCell}>{it.per || "\u00A0"}</TableCell>
                <TableCell sx={tableStyles.bodyCellLast}>{it.amount || "\u00A0"}</TableCell>
              </TableRow>
            ))}

            {/* blank rows to reach consistent print height */}
            {Array.from({ length: Math.max(0, blankRows - data.items.length) }).map((_, i) => (
              <TableRow key={`blank-${i}`}>
                <TableCell sx={tableStyles.bodyCell}>&nbsp;</TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCell}></TableCell>
                <TableCell sx={tableStyles.bodyCellLast}></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {/* totals */}
      <Grid container sx={{ border: "1px solid #000", borderTop: "none", mt: 0 }}>
        <Grid item xs={9} sx={{ p: 1, borderRight: "1px solid #000" }}>
          <Typography sx={fontStyles.label}>Amount Chargeable (in words):</Typography>
          <Typography sx={fontStyles.labelBold}>{data.amountInWords}</Typography>
        </Grid>

        <Grid item xs={3} sx={{ p: 1, textAlign: "right" }}>
          <Typography sx={fontStyles.label}>Subtotal: ₹ {data.subtotal}</Typography>
          <Typography sx={fontStyles.label}>GST ({data.gstPercent}%): ₹ {data.gstAmount}</Typography>
          <Typography sx={fontStyles.labelBold}>Grand Total: ₹ {data.grandTotal}</Typography>
        </Grid>
      </Grid>
      {/* footer */}
      <Grid container sx={{
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        boxSizing: "border-box"
      }}>
        <Grid item xs={6}>
          <Typography sx={fontStyles.footerBold}>Declaration</Typography>
          <Typography sx={fontStyles.footer}>We declare that this invoice shows the actual price of</Typography>
          <Typography sx={fontStyles.footer}>the goods described and that all particulars are true and correct.</Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography sx={fontStyles.footerBold}>Company Bank Details</Typography>
          <Typography sx={fontStyles.footer}>Bank: SBI</Typography>
          <Typography sx={fontStyles.footer}>A/C No: XXXXXX</Typography>
          <Typography sx={fontStyles.footer}>IFSC: SBIN000XXXX</Typography>
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
          p: 1,
          width: "50%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <Box sx={{ mt: 4 }}>
            <Typography sx={fontStyles.footer}>Customer's Seal and Signature</Typography>
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
            <Typography sx={fontStyles.footer}>for NITTUR GRANITE & TILES - J D KATTE SHOWROOM</Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography sx={fontStyles.small}>-Authorised Signatory</Typography>
          </Box>
        </Grid>
      </Grid>
      <Typography align="center" sx={{ mt: 1, ...fontStyles.footer }}>
        SUBJECT TO BHADRAVATI JURISDICTION — This is a Computer Generated Invoice
      </Typography>
    </Paper>
  );
}
