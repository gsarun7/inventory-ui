import { Box } from "@mui/material";

export default function PageContainer({ children }) {
  return (
    <Box
maxWidth="md"
      sx={{
        mt: 3,
        px: { xs: 1.5, sm: 3 }, // responsive side padding
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      {children}
    </Box>
  );
}
