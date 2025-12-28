import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Left side - Image/Branding */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 500 }}>
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            NITTUR GRANITE & TILES
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
            Inventory Management System
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
            Streamline your granite and tiles inventory with our powerful
            management system. Track stock, manage invoices, and monitor sales
            all in one place.
          </Typography>
        </Box>
      </Grid>

      {/* Right side - Login Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access your dashboard
          </Typography>

          {error && (
            <Typography
              color="error"
              align="center"
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "error.lighter",
                borderRadius: 1,
                width: "100%",
              }}
            >
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
              },
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              borderRadius: 2,
              mb: 3,
            }}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Typography variant="caption" color="text.secondary" align="center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
