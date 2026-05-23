import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, ShoppingCart, TrendingUp, Pizza } from "lucide-react";

export default function DashboardPage() {
  const { data: analytics } = trpc.analytics.dashboard.useQuery();
  const { data: salesByDay } = trpc.analytics.salesByDay.useQuery({ days: 7 });
  const { data: popularItems } = trpc.analytics.popularItems.useQuery({ limit: 5 });
  const { data: menuItems } = trpc.menu.items.useQuery({});
  const { data: staff } = trpc.staff.list.useQuery({});

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Platform Overview</h1><p className="text-gray-500">System-wide analytics</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">1</p><p className="text-xs text-gray-500">Active Tenants</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div><div><p className="text-2xl font-bold">${analytics?.todayRevenue.toFixed(2) ?? "0.00"}</p><p className="text-xs text-gray-500">Today's Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-purple-600" /></div><div><p className="text-2xl font-bold">{analytics?.todayOrders ?? 0}</p><p className="text-xs text-gray-500">Today's Orders</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">${analytics?.weekRevenue.toFixed(2) ?? "0.00"}</p><p className="text-xs text-gray-500">Week Revenue</p></div></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-red-600" />Revenue (7 Days)</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {salesByDay?.map(day => (
              <div key={day.date} className="flex justify-between items-center"><span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}</span><div className="flex items-center gap-3"><span className="text-xs text-gray-400">{day.orders} orders</span><span className="font-bold text-sm">${day.revenue.toFixed(2)}</span></div></div>
            ))}
          </div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Pizza className="w-5 h-5 text-red-600" />Top Selling Items</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {popularItems?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center"><span className="text-sm font-medium">#{idx + 1} {item.name}</span><div className="flex items-center gap-3"><span className="text-xs text-gray-400">{item.count} sold</span><span className="font-bold text-sm">${item.revenue.toFixed(2)}</span></div></div>
            ))}
          </div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-lg">Tenant Stats</CardTitle></CardHeader>
        <CardContent><div className="grid grid-cols-4 gap-4 text-center">
          <div><p className="text-3xl font-bold text-red-600">{menuItems?.length ?? 0}</p><p className="text-sm text-gray-500">Menu Items</p></div>
          <div><p className="text-3xl font-bold text-blue-600">{staff?.length ?? 0}</p><p className="text-sm text-gray-500">Staff</p></div>
          <div><p className="text-3xl font-bold text-green-600">{analytics?.activeOrders ?? 0}</p><p className="text-sm text-gray-500">Active Orders</p></div>
          <div><p className="text-3xl font-bold text-amber-600">{analytics?.lowStock ?? 0}</p><p className="text-sm text-gray-500">Low Stock</p></div>
        </div></CardContent></Card>
    </div>
  );
}
