import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Leaf, Star, Plus, Minus, ShoppingCart } from "lucide-react";

const defaultSizes = [
  { label: "Small (10\")", priceModifier: -3, inches: 10 },
  { label: "Medium (12\")", priceModifier: 0, inches: 12 },
  { label: "Large (14\")", priceModifier: 3, inches: 14 },
  { label: "XL (16\")", priceModifier: 5, inches: 16 },
];

const defaultCrusts = [
  { label: "Hand Tossed", priceModifier: 0 },
  { label: "Thin Crust", priceModifier: 0 },
  { label: "Stuffed Crust", priceModifier: 2.50 },
  { label: "Gluten Free", priceModifier: 2 },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const { data: categories } = trpc.menu.categories.useQuery();
  const { data: menuItems } = trpc.menu.items.useQuery();
  const { data: popular } = trpc.menu.popular.useQuery();
  const addToCart = useCartStore(s => s.addItem);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(defaultSizes[1]);
  const [crust, setCrust] = useState(defaultCrusts[0]);
  const [toppings, setToppings] = useState<string[]>([]);

  const filtered = activeCategory ? menuItems?.filter(i => i.categoryId === activeCategory) : menuItems;

  const openItem = (item: any) => {
    setSelected(item);
    setQty(1);
    setSize(defaultSizes[1]);
    setCrust(defaultCrusts[0]);
    setToppings([]);
  };

  const calcPrice = () => {
    if (!selected) return 0;
    let p = parseFloat(selected.price);
    p += size.priceModifier + crust.priceModifier;
    if (selected.toppings) {
      for (const t of selected.toppings) {
        if (toppings.includes(t.label)) p += t.priceModifier;
      }
    }
    return p * qty;
  };

  const handleAdd = () => {
    if (!selected) return;
    const selToppings = selected.toppings?.filter((t: any) => toppings.includes(t.label)).map((t: any) => ({ label: t.label, priceModifier: t.priceModifier })) ?? [];
    addToCart({
      menuItemId: selected.id, name: selected.name, price: parseFloat(selected.price), quantity: qty,
      image: selected.image, selectedSize: size, selectedCrust: crust, selectedToppings: selToppings, selectedExtras: [],
    });
    setSelected(null);
  };

  return (
    <div className="pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-serif mb-1">Order Online</h2>
          <p className="text-red-100">Wood-fired pizzas, fresh ingredients, delivered hot</p>
        </div>
      </div>

      {/* Popular */}
      {popular && popular.length > 0 && (
        <div className="bg-white border-b px-4 py-5">
          <div className="max-w-6xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Flame className="w-5 h-5 text-red-600" /> Popular</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {popular.map(item => (
                <button key={item.id} onClick={() => openItem(item)} className="snap-start flex-shrink-0 w-44 bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md text-left">
                  <img src={item.image ?? ""} alt={item.name} className="w-full h-28 object-cover" />
                  <div className="p-2.5">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-red-600 font-bold text-sm">${item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white border-b px-4 py-3 sticky top-14 z-40">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === null ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>All</button>
          {categories?.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === cat.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>{cat.name}</button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map(item => (
            <div key={item.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative">
                <img src={item.image ?? ""} alt={item.name} className="w-full h-40 object-cover" />
                {item.isPopular && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1"><Star className="w-3 h-3" />Popular</span>}
                {item.isSpicy && <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">Spicy</span>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div><h4 className="font-bold text-gray-900">{item.name}</h4><p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p></div>
                  <span className="font-bold text-red-600 whitespace-nowrap">${item.price}</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {item.isVegetarian && <Badge variant="outline" className="text-green-600 border-green-300 text-[10px]"><Leaf className="w-3 h-3 mr-0.5" />Veg</Badge>}
                  {item.calories && <span className="text-[10px] text-gray-400">{item.prepTimeMinutes}min bake</span>}
                </div>
                <button onClick={() => openItem(item)} className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors">
                  <Plus className="w-4 h-4" /> Customize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-xl font-serif">{selected?.name}</DialogTitle></DialogHeader>
          {selected?.image && <img src={selected.image} alt={selected.name} className="w-full h-44 object-cover rounded-lg" />}
          <p className="text-sm text-gray-600">{selected?.description}</p>

          {/* Size */}
          <div className="space-y-2"><h4 className="font-medium text-sm">Size</h4>
            <div className="grid grid-cols-2 gap-2">{defaultSizes.map(s => (
              <button key={s.label} onClick={() => setSize(s)} className={`px-3 py-2 rounded-lg text-sm border-2 transition-colors text-left ${size.label === s.label ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"}`}>
                {s.label}{s.priceModifier !== 0 && <span className={`ml-1 ${s.priceModifier > 0 ? "text-red-600" : "text-green-600"}`}>{s.priceModifier > 0 ? "+" : ""}${s.priceModifier}</span>}
              </button>
            ))}</div>
          </div>

          {/* Crust */}
          <div className="space-y-2"><h4 className="font-medium text-sm">Crust</h4>
            <div className="flex flex-wrap gap-2">{defaultCrusts.map(c => (
              <button key={c.label} onClick={() => setCrust(c)} className={`px-4 py-2 rounded-lg text-sm border-2 transition-colors ${crust.label === c.label ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"}`}>
                {c.label}{c.priceModifier > 0 && <span className="text-red-600 ml-1">+${c.priceModifier}</span>}
              </button>
            ))}</div>
          </div>

          {/* Toppings */}
          {selected?.toppings && selected.toppings.length > 0 && (
            <div className="space-y-2"><h4 className="font-medium text-sm">Extra Toppings</h4>
              <div className="flex flex-wrap gap-2">{selected.toppings.map((t: any) => {
                const sel = toppings.includes(t.label);
                return (
                  <button key={t.label} onClick={() => setToppings(prev => sel ? prev.filter(x => x !== t.label) : [...prev, t.label])} className={`px-3 py-1.5 rounded-full text-xs border-2 transition-colors ${sel ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200"}`}>
                    {t.label} +${t.priceModifier}
                  </button>
                );
              })}</div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <button onClick={handleAdd} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors">
            <ShoppingCart className="w-5 h-5" /> Add to Cart &mdash; ${calcPrice().toFixed(2)}
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
