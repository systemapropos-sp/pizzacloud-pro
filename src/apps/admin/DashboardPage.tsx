import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { data: stats } = trpc.analytics.dashboard.useQuery();
  const { data: todayOrders } = trpc.order.today.useQuery();
  const { data: salesByDay } = trpc.analytics.salesByDay.useQuery({ days: 7 });

  const statCards = [
    { label: "Today's Revenue", value: stats ? `$${stats.todayRevenue.toFixed(2)}` : "—", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Today's Orders", value: stats?.todayOrders ?? "—", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Orders", value: stats?.activeOrders ?? "—", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Low Stock", value: stats?.lowStock ?? "—", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Total Staff", value: stats?.totalStaff ?? "—", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Week Revenue", value: stats ? `$${stats.weekRevenue.toFixed(2)}` : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Dashboard</h1><p className="text-gray-500">Pizzeria performance overview</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map(card => (
          <Card key={card.label}><CardContent className="p-4">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}><card.icon className={`w-5 h-5 ${card.color}`} /></div>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-lg">Revenue (7 Days)</CardTitle></CardHeader><CardContent>
          <div className="space-y-2">
            {salesByDay?.map(day => (
              <div key={day.date} className="flex justify-between items-center"><span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}</span>
                <div className="flex items-center gap-3"><span className="text-xs text-gray-400">{day.orders} orders</span><span className="font-bold text-sm">${day.revenue.toFixed(2)}</span></div>
              </div>
            ))}
          </div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg">Today's Orders</CardTitle></CardHeader><CardContent>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {todayOrders?.length === 0 && <p className="text-gray-400 text-sm">No orders today</p>}
            {todayOrders?.slice(0, 8).map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div><p className="font-medium text-sm">{order.orderNumber}</p><p className="text-xs text-gray-500">{order.customerName || "Guest"} &middot; {order.orderType}</p></div>
                <div className="text-right"><p className="font-bold text-sm">${parseFloat(order.total).toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === "completed" ? "bg-green-100 text-green-700" : order.status === "baking" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}
