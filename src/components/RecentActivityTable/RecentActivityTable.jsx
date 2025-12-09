import { DataGrid } from "@mui/x-data-grid";
import "./RecentActivityTable.css"; 



export default function RecentActivityTable() {
  const columns = [
    { field: "item", headerName: "Item", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 }
  ];

  const rows = [
    { id: 1, item: "Tile A",stock:10, status: "Added", date: "2025-01-01" },
    { id: 2, item: "Sanitary B",stock:11, status: "Updated", date: "2025-01-03" },
    { id: 3, item: "Tile C",stock:13, status: "Removed", date: "2025-01-04" }
  ];

  return (
    <div className="recent-table-container">
      <h3 className="recent-table-title">Recent Activity</h3>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableRowSelectionOnClick
        sx={{ width: "100%" }}  // MUI internal
      />
    </div>
  );
}
