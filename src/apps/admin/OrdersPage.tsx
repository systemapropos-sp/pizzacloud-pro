import { useState } from "react";
import { useOrders } from "@/hooks/useStaticQueries";
import { Search } from "lucide-react";

const statusFilters = ["all", "pending", "confirmed", "preparing", "baking", "ready", "completed", "cancelled"];

export default function OrdersPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const { data: orders, isLoading } = useOrders(status === "all" ? undefined : status);

  const filtered = orders?.filter(o => !search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()));

  const sColor = (s: string) => { switch (s) { case "completed": return "bg-green-100 text-green-700"; case "cancelled": return "bg-red-100 text-red-700"; case "baking": return "bg-orange-100 text-orange-700"; case "ready": return "bg-blue-100 text-blue-700"; case "preparing": return "bg-amber-100 text-amber-700"; default: return "bg-gray-100 text-gray-700"; } };

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Orders</h1><p className="text-gray-500">Manage customer orders &middot; {filtered?.length ?? 0} total</p></div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm" /></div>
        <div className="flex gap-2 overflow-x-auto">{statusFilters.map(s => <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${status === s ? "bg-[#166534] text-white" : "bg-white border text-gray-600"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>)}</div>
      </div>
      {isLoading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Table/Source</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
            </tr></thead>
            <tbody>{filtered?.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName || "Guest"}<br/><span className="text-xs text-gray-400">{order.customerPhone}</span></td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{order.orderType}</span></td>
                <td className="px-4 py-3 text-gray-500">{order.tableNumber ? `Table ${order.tableNumber}` : order.source}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sColor(order.status)}`}>{order.status}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{order.paymentStatus} {order.paymentMethod && `(${order.paymentMethod})`}</span></td>
                <td className="px-4 py-3 font-bold">${parseFloat(order.total).toFixed(2)}</td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
