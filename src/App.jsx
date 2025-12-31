import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import InventoryTable from "./components/InventoryTable";
import AddItem from "./components/AddItem";
import Sales from "./pages/Sales";
import RecentActivityTable from "./components/RecentActivityTable/RecentActivityTable";
import Dashboard from "./pages/Dashboard";
import InvoicePage from "./pages/InvoicePage";
import PurchaseInvoicePage from "./pages/PurchaseInvoicePage";
import StockMovementPage from "./pages/StockMovementPage";
import StockInventoryPage from "./pages/StockInventoryPage";
import StockAdjustmentPage from "./pages/StockAdjustmentPage";
import ReturnPage from "./pages/ReturnPage";

import AddCustomer from "./pages/AddCustomer";
import AddSupplier from "./pages/AddSupplier";
import AddWarehouse from "./pages/AddWarehouse";
import AddCategory from "./pages/AddCategory";
import AddUnit from "./pages/AddUnit";
import AddProduct from "./pages/AddProduct";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* USER + ADMIN */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryTable />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/recent-activity" element={<RecentActivityTable />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/purchase-invoice" element={<PurchaseInvoicePage />} />
          <Route path="/stock-movement" element={<StockMovementPage />} />
          <Route path="/stock-inventory" element={<StockInventoryPage />} />
          <Route path="/master-data/add-customer" element={<AddCustomer />} />
          <Route path="/master-data/add-supplier" element={<AddSupplier />} />
          <Route path="/master-data/add-category" element={<AddCategory />} />
          <Route path="/master-data/add-warehouse" element={<AddWarehouse />} />
          <Route path="/master-data/add-unit" element={<AddUnit />} />
          <Route path="/master-data/add-product" element={<AddProduct />} />
          {/* ... other routes */}
        </Route>
        {/* </Route> */}

        {/* ADMIN ONLY */}
        {/* <Route element={<ProtectedRoute requiredRole="ADMIN" />}> */}
        <Route element={<Navbar />}>
          <Route path="/stock-adjustment" element={<StockAdjustmentPage />} />
          <Route path="/returns" element={<ReturnPage />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
