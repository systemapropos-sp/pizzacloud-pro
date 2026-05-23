import { Routes, Route, Navigate } from "react-router";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./DashboardPage";
import OrdersPage from "./OrdersPage";
import MenuPage from "./MenuPage";
import InventoryPage from "./InventoryPage";
import StaffPage from "./StaffPage";
import TablesPage from "./TablesPage";
import { useCanAny } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";

export default function AdminApp() {
  const canAdmin = useCanAny([PERMISSIONS.ADMIN_DASHBOARD, PERMISSIONS.ADMIN_ANALYTICS, PERMISSIONS.ADMIN_SETTINGS]);

  if (!canAdmin) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🔒</span></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have admin permissions. Contact your manager.</p>
        </div>
      </div>
    );
  }

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
