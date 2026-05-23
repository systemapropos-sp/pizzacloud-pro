import { Outlet, useNavigate, useLocation } from "react-router";
import { useCan } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";
import { CreditCard, ClipboardList, BarChart3, Home } from "lucide-react";

export default function PosLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const canReports = useCan(PERMISSIONS.POS_REPORTS);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#1a1a2e] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>
          <div><h1 className="font-bold text-sm leading-tight">Cashier POS</h1><p className="text-[10px] text-gray-400">Napoli Pizza</p></div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/pos")} className={`px-3 py-1.5 rounded text-xs font-medium ${location.pathname === "/pos" ? "bg-red-600" : "text-gray-300 hover:bg-white/10"}`}>Terminal</button>
          <button onClick={() => navigate("/pos/orders")} className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 ${location.pathname === "/pos/orders" ? "bg-red-600" : "text-gray-300 hover:bg-white/10"}`}><ClipboardList className="w-3 h-3" /> Orders</button>
          {canReports && <button onClick={() => navigate("/pos/reports")} className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 ${location.pathname === "/pos/reports" ? "bg-red-600" : "text-gray-300 hover:bg-white/10"}`}><BarChart3 className="w-3 h-3" /> Reports</button>}
          <button onClick={() => navigate("/")} className="p-1.5 text-gray-400 hover:text-white"><Home className="w-4 h-4" /></button>
        </div>
      </header>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}
