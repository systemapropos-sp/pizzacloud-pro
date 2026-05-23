import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Building2, Settings, Shield, LogOut } from "lucide-react";

const navItems = [
  { path: "/superadmin", label: "Overview", icon: LayoutDashboard },
  { path: "/superadmin/tenants", label: "Tenants", icon: Building2 },
  { path: "/superadmin/settings", label: "Settings", icon: Settings },
];

export default function SuperadminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#991B1B] text-white flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5" /></div>
            <div><h1 className="font-bold leading-tight">Superadmin</h1><p className="text-xs text-red-200">PizzaCloud Pro</p></div>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? "bg-white/20 text-white" : "text-red-200 hover:bg-white/10"}`}>
                <item.icon className="w-5 h-5" />{item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-800">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-200 hover:bg-white/10"><LogOut className="w-5 h-5" />Exit</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto"><Outlet /></main>
    </div>
  );
}
