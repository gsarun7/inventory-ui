import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Typography,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import TuneIcon from "@mui/icons-material/Tune";
import StorageIcon from "@mui/icons-material/Storage";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import StraightenIcon from "@mui/icons-material/Straighten";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [masterDataAnchor, setMasterDataAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("USER");
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMasterDataOpen = (event) =>
    setMasterDataAnchor(event.currentTarget);
  const handleMasterDataClose = () => setMasterDataAnchor(null);

  // Get user data and role
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user);

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        setUserRole(data?.role || "USER");
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleMenuClose();
    navigate("/login", { replace: true });
  };

  const getUserName = () => {
    if (!user) return "";
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name;
    if (fullName) return fullName;
    return user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Invoice",
      path: "/invoice",
      icon: <ReceiptIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Purchase Invoice",
      path: "/purchase-invoice",
      icon: <ShoppingCartIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Stock Movement",
      path: "/stock-movement",
      icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Stock Inventory",
      path: "/stock-inventory",
      icon: <InventoryIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Stock Adjustment",
      path: "/stock-adjustment",
      icon: <TuneIcon sx={{ fontSize: 18 }} />,
      adminOnly: true,
    },
    {
      name: "Returns",
      path: "/returns",
      icon: <AssignmentReturnIcon sx={{ fontSize: 18 }} />,
      adminOnly: true,
    },
  ];

  // Master Data submenu items
  const masterDataItems = [
    {
      name: "Add Product",
      path: "/master-data/add-product",
      icon: <AddBoxIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Add Category",
      path: "/master-data/add-category",
      icon: <CategoryIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Add Warehouse",
      path: "/master-data/add-warehouse",
      icon: <WarehouseIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Add Unit",
      path: "/master-data/add-unit",
      icon: <StraightenIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Add Customer",
      path: "/master-data/add-customer",
      icon: <PersonAddIcon sx={{ fontSize: 18 }} />,
    },
    {
      name: "Add Supplier",
      path: "/master-data/add-supplier",
      icon: <LocalShippingIcon sx={{ fontSize: 18 }} />,
    },
  ];

  const filteredNavLinks = navLinks.filter(
    (link) => !link.adminOnly || userRole === "ADMIN"
  );
  const isActiveRoute = (path) => location.pathname === path;
  const isMasterDataActive = () => location.pathname.startsWith("/master-data");

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2.5, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
          NGT
        </Typography>
        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
          Inventory Management
        </Typography>
      </Box>

      <List sx={{ px: 2, py: 2 }}>
        {filteredNavLinks.map((item) => (
          <ListItemButton
            key={item.name}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            selected={isActiveRoute(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.light",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              },
            }}
          >
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              {item.icon}
            </Box>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: isActiveRoute(item.path) ? 600 : 400,
              }}
            />
          </ListItemButton>
        ))}

        {/* Master Data in Mobile Drawer */}
        <ListItemButton
          selected={isMasterDataActive()}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            "&.Mui-selected": {
              bgcolor: "primary.light",
              color: "primary.main",
            },
          }}
        >
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            <StorageIcon sx={{ fontSize: 18 }} />
          </Box>
          <ListItemText
            primary="Master Data"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              fontWeight: isMasterDataActive() ? 600 : 400,
            }}
          />
        </ListItemButton>

        {/* Master Data Submenu in Mobile */}
        <Box sx={{ pl: 4 }}>
          {masterDataItems.map((item) => (
            <ListItemButton
              key={item.name}
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={isActiveRoute(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 0.75,
              }}
            >
              <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: "0.8rem",
                }}
              />
            </ListItemButton>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, color: "error.main" }}
        >
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            <LogoutIcon sx={{ fontSize: 18 }} />
          </Box>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: "0.875rem" }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 56 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h6"
                component={Link}
                to="/dashboard"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "1rem",
                }}
              >
                <InventoryIcon sx={{ fontSize: 22 }} />
                NGT
              </Typography>

              {userRole === "ADMIN" && (
                <Chip
                  label="ADMIN"
                  size="small"
                  color="primary"
                  sx={{
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    display: { xs: "none", md: "flex" },
                  }}
                />
              )}
            </Box>

            {/* Desktop menu */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {filteredNavLinks.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActiveRoute(item.path)
                      ? "primary.main"
                      : "text.secondary",
                    textTransform: "none",
                    fontWeight: isActiveRoute(item.path) ? 600 : 400,
                    fontSize: "0.875rem",
                    borderBottom: isActiveRoute(item.path) ? 2 : 0,
                    borderColor: "primary.main",
                    borderRadius: 0,
                    px: 1.5,
                    py: 0.5,
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}

              {/* Master Data with Dropdown */}
              <Button
                onMouseEnter={handleMasterDataOpen}
                startIcon={<StorageIcon sx={{ fontSize: 18 }} />}
                sx={{
                  color: isMasterDataActive()
                    ? "primary.main"
                    : "text.secondary",
                  textTransform: "none",
                  fontWeight: isMasterDataActive() ? 600 : 400,
                  fontSize: "0.875rem",
                  borderBottom: isMasterDataActive() ? 2 : 0,
                  borderColor: "primary.main",
                  borderRadius: 0,
                  px: 1.5,
                  py: 0.5,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Master Data
              </Button>
            </Box>

            {/* Right side - User info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {getUserName()}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {userRole}
                  </Typography>
                </Box>
                <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                  {getUserAvatar() ? (
                    <Avatar
                      src={getUserAvatar()}
                      alt={getUserName()}
                      sx={{ width: 36, height: 36 }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {getUserName().charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </Box>

              <IconButton
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: "inline-flex", lg: "none" } }}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Master Data Dropdown Menu */}
      <Menu
        anchorEl={masterDataAnchor}
        open={Boolean(masterDataAnchor)}
        onClose={handleMasterDataClose}
        MenuListProps={{
          onMouseLeave: handleMasterDataClose,
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 0.5,
            minWidth: 200,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.2,
              fontSize: "0.875rem",
              "&:hover": {
                bgcolor: "action.hover",
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {masterDataItems.map((item) => (
          <MenuItem
            key={item.name}
            component={Link}
            to={item.path}
            onClick={handleMasterDataClose}
            selected={isActiveRoute(item.path)}
          >
            <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
              {item.icon}
            </Box>
            {item.name}
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.2,
              borderRadius: 1,
              mx: 1,
              fontSize: "0.875rem",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2.5, py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            {getUserAvatar() ? (
              <Avatar src={getUserAvatar()} sx={{ width: 44, height: 44 }} />
            ) : (
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "primary.main",
                  fontSize: "1.25rem",
                }}
              >
                {getUserName().charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, fontSize: "0.9rem" }}
              >
                {getUserName()}
              </Typography>
              <Chip
                label={userRole}
                size="small"
                color="primary"
                sx={{ height: 18, fontSize: "0.65rem", mt: 0.5 }}
              />
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
          >
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
        >
          <AccountCircleIcon sx={{ mr: 1.5, fontSize: 18 }} />
          My Profile
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar sx={{ minHeight: 56 }} />

      <Box
        component="main"
        sx={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: "background.default",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
