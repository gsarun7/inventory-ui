import { Box, Typography } from "@mui/material";

export default function StockSummary({ summary }) {
  return (
    <Box sx={{ p: 2, bgcolor: "#f5f5f5", mb: 2, borderRadius: 1 }}>
      <Typography>
        <b>Opening:</b> {summary.opening} &nbsp; | &nbsp;
        <b>IN:</b> {summary.totalIn} &nbsp; | &nbsp;
        <b>OUT:</b> {summary.totalOut} &nbsp; | &nbsp;
        <b>Closing:</b> {summary.closing}
      </Typography>
    </Box>
  );
}
