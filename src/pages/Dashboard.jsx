
import StatsCard from "../components/StatsCard/StatsCard";
import CategoryChart from "../components/CategoryChart/CategoryChart";
import RecentActivityTable from "../components/RecentActivityTable/RecentActivityTable";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
 // ⬅ Import CSS

export default function Dashboard() {
  return (
   
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Total Items" value="1500" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Low Stock" value="50" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard title="Categories" value="18" />
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
          <Grid item xs={12} md={6}>
            <CategoryChart />
          </Grid>
        </Grid>
      </Box>
  
  );
}
