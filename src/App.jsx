import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import InventoryTable from "./components/InventoryTable";
import AddItem from "./components/AddItem";
import Sales from "./pages/Sales";
import RecentActivityTable from "./components/RecentActivityTable/RecentActivityTable";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<InventoryTable />} />
          <Route path="/inventory" element={<InventoryTable />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/recent-activity" element={<RecentActivityTable />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
