import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { name: "Inventory", path: "/" },
    { name: "Add Item", path: "/add-item" },
    { name: "Sales", path: "/sales" }
  ];

  const drawer = (
    <List>
      {navLinks.map((item) => (
        <ListItem button component={Link} to={item.path} key={item.name} onClick={handleDrawerToggle}>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Brand left aligned */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Inventory Manager
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navLinks.map((item) => (
              <Button key={item.name} component={Link} to={item.path} sx={{ color: "#fff" }}>
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Mobile menu icon */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" }, color: "#fff" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Box sx={{ height: "70px" }}></Box>
    </>
  );
}
