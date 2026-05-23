import { useState } from "react";
import { useMenuCategories, useMenuItems } from "@/hooks/useStaticQueries";
import { Flame, Leaf, Search } from "lucide-react";

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { data: categories } = useMenuCategories();
  const { data: menuItems, isLoading } = useMenuItems(activeCategory ?? undefined);

  const filtered = menuItems?.filter(item => !search || item.name.toLowerCase().includes(search.toLowerCase()));
  const getCatName = (id: number) => categories?.find(c => c.id === id)?.name ?? "Unknown";

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Menu Manager</h1><p className="text-gray-500">{menuItems?.length ?? 0} items across {categories?.length ?? 0} categories</p></div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm" /></div>
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === null ? "bg-[#166534] text-white" : "bg-white border text-gray-600"}`}>All</button>
          {categories?.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === c.id ? "bg-[#166534] text-white" : "bg-white border text-gray-600"}`}>{c.name}</button>
          ))}
        </div>
      </div>
      {isLoading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Item</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Cost</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Margin</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tags</th>
            </tr></thead>
            <tbody>{filtered?.map(item => {
              const price = parseFloat(item.price);
              const cost = parseFloat(item.costPrice);
              const margin = ((price - cost) / price * 100).toFixed(1);
              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={item.image ?? ""} alt={item.name} className="w-10 h-10 rounded-lg object-cover" /><div><p className="font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.prepTimeMinutes}min &middot; {item.calories}cal</p></div></div></td>
                  <td className="px-4 py-3 text-gray-600">{getCatName(item.categoryId)}</td>
                  <td className="px-4 py-3 font-bold">${item.price}</td>
                  <td className="px-4 py-3 text-gray-500">${item.costPrice}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{margin}%</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">{item.isPopular && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="w-3 h-3" />Popular</span>}{item.isVegetarian && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Leaf className="w-3 h-3" />Veg</span>}{item.isSpicy && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Spicy</span>}</div></td>
                </tr>
              );
            })}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
