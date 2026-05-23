import { trpc } from "@/providers/trpc";
import { useCan } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";
import { CreditCard, CheckCircle } from "lucide-react";

export default function PosOrders() {
  const { data: orders, isLoading } = trpc.order.list.useQuery({});
  const utils = trpc.useUtils();
  const canPay = useCan();
  const updatePayment = trpc.order.updatePayment.useMutation({ onSuccess: () => utils.order.list.invalidate() });

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Lookup</h2>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Order #</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
            <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
          </tr></thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName || "Guest"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{order.status}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{order.paymentStatus}</span></td>
                <td className="px-4 py-3 font-bold">${parseFloat(order.total).toFixed(2)}</td>
                <td className="px-4 py-3">{canPay && order.paymentStatus === "pending" && (
                  <div className="flex gap-1">
                    <button onClick={() => updatePayment.mutate({ id: order.id, paymentStatus: "paid", paymentMethod: "cash" })} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Cash</button>
                    <button onClick={() => updatePayment.mutate({ id: order.id, paymentStatus: "paid", paymentMethod: "card" })} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"><CreditCard className="w-3 h-3" /> Card</button>
                  </div>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
