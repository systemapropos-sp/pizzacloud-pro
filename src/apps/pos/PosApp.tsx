import { Routes, Route, Navigate } from "react-router";
import PosLayout from "./PosLayout";
import PosTerminal from "./PosTerminal";
import PosOrders from "./PosOrders";
import PosReports from "./PosReports";
import { useCanAny } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";

export default function PosApp() {
  const canPos = useCanAny([PERMISSIONS.POS_SELL, PERMISSIONS.POS_REFUND, PERMISSIONS.POS_DISCOUNT, PERMISSIONS.POS_REPORTS]);

  if (!canPos) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to access the POS system. Contact your manager.</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<PosLayout />}>
        <Route path="/" element={<PosTerminal />} />
        <Route path="/orders" element={<PosOrders />} />
        <Route path="/reports" element={<PosReports />} />
        <Route path="*" element={<Navigate to="/pos" />} />
      </Route>
    </Routes>
  );
}
