import { useNavigate } from "react-router";
import { Pizza, Monitor, CreditCard, ChefHat, Shield, LayoutDashboard } from "lucide-react";

const apps = [
  { id: "web", name: "Order Online", desc: "Browse menu, customize pizzas, order for delivery or pickup", icon: Pizza, color: "bg-red-600", path: "/web" },
  { id: "pos", name: "Cashier POS", desc: "Process payments with role-based access control", icon: CreditCard, color: "bg-emerald-700", path: "/pos" },
  { id: "kitchen", name: "Kitchen Display", desc: "Real-time order tickets and bake tracking", icon: ChefHat, color: "bg-amber-600", path: "/kitchen" },
  { id: "admin", name: "Restaurant Admin", desc: "Menu, orders, staff, inventory & RBAC settings", icon: LayoutDashboard, color: "bg-slate-700", path: "/admin" },
  { id: "superadmin", name: "SaaS Owner", desc: "Tenant management and system-wide settings", icon: Shield, color: "bg-red-900", path: "/superadmin" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      {/* Italian Checkered Border Top */}
      <div className="h-3 bg-[repeating-linear-gradient(90deg,#DC2626_0px,#DC2626_20px,white_20px,white_40px,#16A34A_40px,#16A34A_60px,white_60px,white_80px)]" />

      {/* Header */}
      <header className="bg-[#166534] text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
              <Pizza className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif tracking-wide">PizzaCloud Pro</h1>
              <p className="text-[10px] text-green-200 -mt-0.5 tracking-wider uppercase">Pizzeria Management Suite</p>
            </div>
          </div>
          <button onClick={() => navigate("/login")} className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-full text-sm font-medium transition-colors">
            Staff Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#166534] via-[#15803d] to-[#16A34A] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border-4 border-white rounded-full" />
          <div className="absolute top-20 right-40 w-20 h-20 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Multi-Tenant Restaurant SaaS with RBAC
          </div>
          <h2 className="text-5xl font-bold font-serif mb-4">
            <span className="text-red-300">Authentic</span> Pizza Management
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            A complete pizzeria ecosystem with role-based access control. Order online, manage the kitchen, process payments — all in one platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate("/web")} className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl">
              Order Now
            </button>
            <button onClick={() => navigate("/pos")} className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full font-bold text-lg transition-all">
              Open POS
            </button>
          </div>
        </div>
      </section>

      {/* App Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 font-serif">Choose Your App</h3>
          <div className="w-16 h-1 bg-red-600 mx-auto mt-2 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {apps.map((app) => (
            <button key={app.id} onClick={() => navigate(app.path)} className="group bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm hover:shadow-lg hover:border-red-300 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${app.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-lg">&rarr;</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{app.name}</h3>
              <p className="text-sm text-gray-500">{app.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "RBAC Security", value: "Granular Permissions" },
              { label: "Real-Time", value: "Live Order Sync" },
              { label: "Multi-Tenant", value: "Unlimited Pizzerias" },
              { label: "Supabase", value: "PostgreSQL + Bucket" },
            ].map((f) => (
              <div key={f.label} className="p-3 rounded-xl bg-[#FFF8F0]">
                <p className="text-sm font-bold text-red-700">{f.label}</p>
                <p className="text-xs text-gray-600 mt-1">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#166534] text-green-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Pizza className="w-4 h-4" />
            <span className="font-bold text-white font-serif">PizzaCloud Pro</span>
          </div>
          <p className="text-xs">Multi-Tenant Pizzeria SaaS v1.0 &mdash; Built with React 19 + Supabase</p>
        </div>
      </footer>
      <div className="h-2 bg-[repeating-linear-gradient(90deg,#DC2626_0px,#DC2626_20px,white_20px,white_40px,#16A34A_40px,#16A34A_60px,white_60px,white_80px)]" />
    </div>
  );
}
