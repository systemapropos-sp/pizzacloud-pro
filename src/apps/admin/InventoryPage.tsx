import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { AlertTriangle, Search } from "lucide-react";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [showLow, setShowLow] = useState(false);
  const { data: items, isLoading } = trpc.inventory.list.useQuery({ search: search || undefined, lowStock: showLow || undefined });

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Inventory</h1><p className="text-gray-500">Track stock levels</p></div>
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm" /></div>
        <button onClick={() => setShowLow(!showLow)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${showLow ? "bg-red-100 text-red-700" : "bg-white border text-gray-600"}`}><AlertTriangle className="w-4 h-4" />Low Stock</button>
      </div>
      {isLoading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Item</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">SKU</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Qty</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Unit</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Reorder</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
            </tr></thead>
            <tbody>{items?.map(item => {
              const qty = parseFloat(item.quantity ?? "0"), reorder = parseFloat(item.reorderPoint ?? "0");
              const isLow = qty <= reorder;
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.sku}</td>
                  <td className="px-4 py-3 font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}">{qty}</td>
                  <td className="px-4 py-3 text-gray-500">{item.unit}</td>
                  <td className="px-4 py-3 text-gray-500">{reorder}</td>
                  <td className="px-4 py-3">{isLow ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Low</span> : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">OK</span>}</td>
                </tr>
              );
            })}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
