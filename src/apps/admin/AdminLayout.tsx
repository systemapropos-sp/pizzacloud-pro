import { Outlet, useNavigate, useLocation } from "react-router";
import { useCanAny } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";
import { LayoutDashboard, ClipboardList, Utensils, Package, Users, Armchair, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, perm: PERMISSIONS.ADMIN_DASHBOARD },
    { path: "/admin/orders", label: "Orders", icon: ClipboardList, perm: PERMISSIONS.ORDERS_VIEW },
    { path: "/admin/menu", label: "Menu", icon: Utensils, perm: PERMISSIONS.MENU_VIEW },
    { path: "/admin/inventory", label: "Inventory", icon: Package, perm: PERMISSIONS.INVENTORY_VIEW },
    { path: "/admin/staff", label: "Staff", icon: Users, perm: PERMISSIONS.STAFF_VIEW },
    { path: "/admin/tables", label: "Tables", icon: Armchair, perm: PERMISSIONS.ORDERS_VIEW },
  ].filter(item => useCanAny([item.perm]));

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#166534] text-white flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center"><Utensils className="w-5 h-5" /></div>
            <div><h1 className="font-bold leading-tight">Admin</h1><p className="text-xs text-green-300">Napoli Pizza</p></div>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? "bg-red-600 text-white" : "text-green-100 hover:bg-white/10"}`}>
                <item.icon className="w-5 h-5" />{item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-200 hover:bg-white/10"><LogOut className="w-5 h-5" />Exit</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto"><Outlet /></main>
    </div>
  );
}
