import { Box } from "@mui/material";

export default function PageContainer({ children }) {
  return (
    <Box
      sx={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        mt: 2, // Ensures consistent gap below navbar
        alignItems: "center",
        textAlign: "center"
        
      }}
    >
      {children}
    </Box>
  );
}
