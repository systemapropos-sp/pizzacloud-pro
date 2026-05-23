import { Routes, Route, Navigate } from "react-router";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./DashboardPage";
import OrdersPage from "./OrdersPage";
import MenuPage from "./MenuPage";
import InventoryPage from "./InventoryPage";
import StaffPage from "./StaffPage";
import TablesPage from "./TablesPage";

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Route>
    </Routes>
  );
}
