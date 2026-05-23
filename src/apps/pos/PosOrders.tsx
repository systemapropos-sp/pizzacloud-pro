import { useOrders } from "@/hooks/useStaticQueries";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

export default function PosOrders() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Order Lookup</h2>
        <span className="text-sm text-gray-500">{orders?.length ?? 0} orders</span>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
          </tr></thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName || "Guest"}<br/><span className="text-xs text-gray-400">{order.customerPhone}</span></td>
                <td className="px-4 py-3"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{order.orderType}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${order.status === "completed" ? "bg-green-100 text-green-700" : order.status === "baking" ? "bg-orange-100 text-orange-700" : order.status === "ready" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.status === "completed" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {order.paymentStatus} {order.paymentMethod && `(${order.paymentMethod})`}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold">${parseFloat(order.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
