import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function PosReports() {
  const { data: stats } = trpc.analytics.dashboard.useQuery();
  const { data: salesByDay } = trpc.analytics.salesByDay.useQuery({ days: 7 });
  const { data: popularItems } = trpc.analytics.popularItems.useQuery({ limit: 5 });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">POS Reports</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div><div><p className="text-2xl font-bold">${stats?.todayRevenue.toFixed(2) ?? "0"}</p><p className="text-xs text-gray-500">Today's Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{stats?.todayOrders ?? 0}</p><p className="text-xs text-gray-500">Today's Orders</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-amber-600" /></div><div><p className="text-2xl font-bold">${stats?.weekRevenue.toFixed(2) ?? "0"}</p><p className="text-xs text-gray-500">Week Revenue</p></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg">Sales by Day</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salesByDay?.map(day => (
                <div key={day.date} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}</span>
                  <div className="flex items-center gap-4"><span className="text-xs text-gray-400">{day.orders} orders</span><span className="font-bold text-sm">${day.revenue.toFixed(2)}</span></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Top Selling Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm font-medium">#{idx + 1} {item.name}</span>
                  <div className="flex items-center gap-4"><span className="text-xs text-gray-400">{item.count} sold</span><span className="font-bold text-sm">${item.revenue.toFixed(2)}</span></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
