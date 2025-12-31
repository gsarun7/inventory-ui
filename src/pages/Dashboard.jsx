// pages/Dashboard.jsx
import React from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock Data
const mockStats = {
  totalCategories: 18,
  totalProducts: 1500,
  lowStockProducts: 50,
  totalSuppliers: 25,
  totalCustomers: 340,
  totalSales: 128,
};

const categoryWiseProducts = [
  { category: "Granite", count: 320 },
  { category: "Tiles", count: 450 },
  { category: "Marble", count: 280 },
  { category: "Sanitary", count: 190 },
  { category: "Adhesives", count: 85 },
  { category: "Others", count: 175 },
];

const supplierWiseProducts = [
  { supplier: "Kajaria", count: 145 },
  { supplier: "Asian Granito", count: 132 },
  { supplier: "Somany", count: 118 },
  { supplier: "Nitco", count: 95 },
  { supplier: "Johnson", count: 88 },
  { supplier: "RAK", count: 76 },
  { supplier: "Cera", count: 65 },
  { supplier: "Orient Bell", count: 58 },
];

const topGraniteProducts = [
  { product: "Black Galaxy", sales: 245 },
  { product: "Absolute Black", sales: 198 },
  { product: "Kashmir White", sales: 176 },
  { product: "Tan Brown", sales: 165 },
  { product: "Steel Grey", sales: 142 },
  { product: "River White", sales: 128 },
  { product: "Imperial Red", sales: 115 },
  { product: "Multicolor Red", sales: 98 },
  { product: "Crystal Yellow", sales: 87 },
  { product: "Moon White", sales: 76 },
];

const topTileProducts = [
  { product: "Vitrified 600x600", sales: 485 },
  { product: "Ceramic Wall", sales: 412 },
  { product: "Glossy Floor", sales: 368 },
  { product: "Matt Finish", sales: 325 },
  { product: "Digital Print", sales: 298 },
  { product: "Wooden Finish", sales: 265 },
  { product: "Marble Look", sales: 234 },
  { product: "Subway Tiles", sales: 198 },
  { product: "Mosaic Tiles", sales: 176 },
  { product: "Anti-Skid", sales: 145 },
];

const topSanitaryProducts = [
  { product: "Wall Mounted WC", sales: 156 },
  { product: "Table Top Basin", sales: 132 },
  { product: "Single Lever Tap", sales: 124 },
  { product: "Floor Mounted WC", sales: 118 },
  { product: "Pedestal Basin", sales: 95 },
  { product: "Health Faucet", sales: 87 },
  { product: "Concealed Cistern", sales: 76 },
  { product: "Basin Mixer", sales: 68 },
  { product: "Shower Panel", sales: 54 },
  { product: "Bath Tub", sales: 42 },
];

const lowSaleTileProducts = [
  { product: "Hexagon Tiles", sales: 8 },
  { product: "Penny Round", sales: 12 },
  { product: "Fish Scale", sales: 15 },
  { product: "Arabesque", sales: 18 },
  { product: "Chevron Pattern", sales: 22 },
  { product: "Encaustic", sales: 25 },
  { product: "Terrazzo", sales: 28 },
  { product: "Zellige", sales: 31 },
  { product: "Subway Small", sales: 34 },
  { product: "Herringbone", sales: 38 },
];

// Stats Card Component with fixed height
const StatsCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    elevation={1}
    sx={{
      height: 120, // Fixed height
      background: `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`,
      border: `1px solid ${color}20`,
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 8px 16px ${color}20`,
      },
    }}
  >
    <CardContent sx={{ width: "100%", textAlign: "center", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 1.5,
            p: 1.2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: color, my: 0.3 }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.65rem", display: "block" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Chart Container Component with fixed height
const ChartContainer = ({ title, children }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2.5,
      height: 400, // Fixed height for all charts
      display: "flex",
      flexDirection: "column",
      border: "1px solid",
      borderColor: "grey.200",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: 3,
      },
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{
        mb: 2,
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "text.primary",
        textAlign: "center",
      }}
    >
      {title}
    </Typography>
    <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
  </Paper>
);

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
        >
          {payload[0].payload.product ||
            payload[0].payload.category ||
            payload[0].payload.supplier}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.7rem", color: payload[0].fill }}
        >
          {payload[0].name}: {payload[0].value}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
      >
        Dashboard Overview
      </Typography>

      {/* Stats Cards - Row 1: 3 cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Categories"
            value={mockStats.totalCategories}
            icon={<CategoryIcon />}
            color="#9c27b0"
            subtitle="Product categories"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Products"
            value={mockStats.totalProducts}
            icon={<InventoryIcon />}
            color="#1976d2"
            subtitle="In catalog"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Low Stock Products"
            value={mockStats.lowStockProducts}
            icon={<WarningIcon />}
            color="#f44336"
            subtitle="Needs reorder"
          />
        </Grid>
      </Grid>

      {/* Stats Cards - Row 2: 3 cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Suppliers"
            value={mockStats.totalSuppliers}
            icon={<LocalShippingIcon />}
            color="#ff9800"
            subtitle="Active suppliers"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Total Customers"
            value={mockStats.totalCustomers}
            icon={<PeopleIcon />}
            color="#2e7d32"
            subtitle="Registered"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <StatsCard
            title="Number of Sales"
            value={mockStats.totalSales}
            icon={<TrendingUpIcon />}
            color="#0288d1"
            subtitle="This month"
          />
        </Grid>
      </Grid>

      {/* Charts Section - Row 1: 2 charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <ChartContainer title="Category-wise Product Count">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryWiseProducts} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="category"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                  stroke="#666"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#9c27b0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Supplier-wise Product Count">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierWiseProducts} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="supplier"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                  stroke="#666"
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#ff9800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Charts Section - Row 2: 2 charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <ChartContainer title="Top 10 Granite Products (High Sales)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topGraniteProducts}
                layout="vertical"
                barSize={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis
                  dataKey="product"
                  type="category"
                  width={110}
                  tick={{ fontSize: 9 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#8b4513" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Top 10 Tile Products (High Sales)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTileProducts} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis
                  dataKey="product"
                  type="category"
                  width={110}
                  tick={{ fontSize: 9 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#1976d2" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Charts Section - Row 3: 2 charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartContainer title="Top 10 Sanitary Ware Products (High Sales)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topSanitaryProducts}
                layout="vertical"
                barSize={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis
                  dataKey="product"
                  type="category"
                  width={110}
                  tick={{ fontSize: 9 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#2e7d32" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartContainer title="Top 10 Tile Products (Low Sales)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lowSaleTileProducts}
                layout="vertical"
                barSize={12}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#666" />
                <YAxis
                  dataKey="product"
                  type="category"
                  width={110}
                  tick={{ fontSize: 9 }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#f44336" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
