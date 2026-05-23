import { trpc } from "@/providers/trpc";
import { Clock, Flame, ChefHat, CheckCircle, Package, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

const statusConfig: Record<string, { label: string; color: string; border: string; bg: string; icon: any }> = {
  pending: { label: "New", color: "text-red-400", border: "border-red-500", bg: "bg-red-900/30", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-purple-400", border: "border-purple-500", bg: "bg-purple-900/30", icon: CheckCircle },
  preparing: { label: "Prepping", color: "text-amber-400", border: "border-amber-500", bg: "bg-amber-900/30", icon: Flame },
  baking: { label: "Baking", color: "text-orange-400", border: "border-orange-500", bg: "bg-orange-900/30", icon: Flame },
  ready: { label: "Ready", color: "text-green-400", border: "border-green-500", bg: "bg-green-900/30", icon: Package },
};

export default function KitchenDisplay() {
  const navigate = useNavigate();
  const { data: tickets } = trpc.kitchen.tickets.useQuery(undefined, { refetchInterval: 3000 });
  const { data: stats } = trpc.kitchen.stats.useQuery(undefined, { refetchInterval: 3000 });
  const utils = trpc.useUtils();
  const updateItem = trpc.kitchen.updateItemStatus.useMutation({ onSuccess: () => utils.kitchen.tickets.invalidate() });
  const updateOrder = trpc.kitchen.updateOrderStatus.useMutation({ onSuccess: () => utils.kitchen.tickets.invalidate() });

  const getElapsed = (d: Date) => { const diff = Date.now() - new Date(d).getTime(); const m = Math.floor(diff / 60000), s = Math.floor((diff % 60000) / 1000); return `${m}m ${s}s`; };

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      <header className="bg-[#0f0f23] border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 hover:bg-white/10 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div className="flex items-center gap-2"><ChefHat className="w-6 h-6 text-red-400" /><h1 className="text-xl font-bold font-serif">Kitchen Display</h1></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><p className="text-2xl font-bold text-red-400">{stats?.pendingItems ?? 0}</p><p className="text-xs text-gray-400">Pending</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-amber-400">{stats?.preparingItems ?? 0}</p><p className="text-xs text-gray-400">Cooking</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-green-400">{stats?.readyItems ?? 0}</p><p className="text-xs text-gray-400">Ready</p></div>
          </div>
        </div>
      </header>

      <div className="p-4">
        {!tickets?.length ? (
          <div className="text-center py-12"><ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-xl text-gray-500">No active tickets</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tickets.map(ticket => {
              const cfg = statusConfig[ticket.status] ?? statusConfig.pending;
              const Icon = cfg.icon;
              return (
                <div key={ticket.id} className={`bg-[#0f0f23] rounded-xl border-2 ${cfg.border} overflow-hidden`}>
                  <div className={`${cfg.bg} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2"><Icon className={`w-5 h-5 ${cfg.color}`} /><span className={`font-bold ${cfg.color}`}>{ticket.orderNumber}</span></div>
                    <div className="flex items-center gap-1 text-gray-400"><Clock className="w-4 h-4" /><span className="text-sm font-mono">{getElapsed(ticket.createdAt)}</span></div>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-700 flex justify-between text-sm"><span className="text-gray-300">{ticket.orderType === "dineIn" ? `Table ${ticket.tableNumber}` : ticket.orderType}</span><span className="text-gray-400">{ticket.customerName || "Guest"}</span></div>
                  <div className="p-4 space-y-2">
                    {ticket.items.map((item: any) => (
                      <div key={item.id} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2"><span className="font-bold">{item.quantity}x</span><span className="font-medium text-gray-200">{item.name}</span></div>
                            {item.selectedToppings?.length > 0 && <p className="text-xs text-gray-400 mt-0.5">+{item.selectedToppings.map((t: any) => t.label).join(", ")}</p>}
                            {item.specialInstructions && <p className="text-xs text-amber-400 mt-0.5">Note: {item.specialInstructions}</p>}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "pending" ? "bg-gray-700 text-gray-300" : item.status === "preparing" ? "bg-orange-900/50 text-orange-400" : "bg-green-900/50 text-green-400"}`}>{item.status}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {item.status === "pending" && <button onClick={() => updateItem.mutate({ itemId: item.id, status: "preparing" })} className="flex-1 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg"><Flame className="w-3 h-3 inline mr-1" />Start</button>}
                          {item.status === "preparing" && <button onClick={() => updateItem.mutate({ itemId: item.id, status: "ready" })} className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg"><CheckCircle className="w-3 h-3 inline mr-1" />Ready</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    {ticket.status === "pending" && <button onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "confirmed" })} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg">Confirm</button>}
                    {ticket.status === "confirmed" && <button onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "preparing" })} className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg">Start All</button>}
                    {ticket.status === "preparing" && <button onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "baking" })} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg">In Oven</button>}
                    {ticket.status === "baking" && <button onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "ready" })} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg">Done Baking</button>}
                    {ticket.items.every((i: any) => i.status === "ready" || i.status === "served") && <button onClick={() => updateOrder.mutate({ orderId: ticket.id, status: "completed" })} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg">Complete</button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
