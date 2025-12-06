import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <AppBar position="fixed" elevation={2}>
        <Toolbar sx={{ display: "flex" }}>
          
          {/* Left-aligned App Name */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", flexGrow: 1, cursor: "pointer" }}
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "white" }}
          >
            NGT Inventory Manager
          </Typography>

          {/* Center-aligned Menu */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 4 }}>
            <Button component={Link} to="/" sx={{ color: "#fff" }}>
              Inventory
            </Button>

            <Button component={Link} to="/add-item" sx={{ color: "#fff" }}>
              Add Item
            </Button>

            <Button component={Link} to="/sales" sx={{ color: "#fff" }}>
              Sales
            </Button>
          </Box>

          {/* Right Spacer */}
          <Box sx={{ width: 80 }} />
        </Toolbar>
      </AppBar>

      {/* Space below navbar */}
      <Box sx={{ height: "70px" }}></Box>
    </>
  );
}
