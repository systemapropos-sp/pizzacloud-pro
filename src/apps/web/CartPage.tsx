import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getTax, getTotal, setOrderType, orderType, tableNumber, setTableNumber } = useCartStore();

  if (items.length === 0) return (
    <div className="px-4 py-16 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-gray-400" /></div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <button onClick={() => navigate("/web")} className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">Browse Menu</button>
    </div>
  );

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold font-serif text-gray-900 mb-4">Your Order</h2>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Order Type</p>
        <div className="flex gap-2">
          {(["dineIn", "takeout", "delivery"] as const).map(t => (
            <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-2 rounded-lg text-sm font-bold ${orderType === t ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              {t === "dineIn" ? "Dine In" : t === "takeout" ? "Takeout" : "Delivery"}
            </button>
          ))}
        </div>
        {orderType === "dineIn" && <input type="text" placeholder="Table number" value={tableNumber ?? ""} onChange={e => setTableNumber(e.target.value)} className="mt-2 w-full px-3 py-2 border rounded-lg text-sm" />}
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={`${item.menuItemId}-${idx}`} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.selectedSize?.label} &middot; {item.selectedCrust?.label}{item.selectedToppings.length > 0 && ` &middot; +${item.selectedToppings.map(t => t.label).join(", ")}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Minus className="w-3 h-3" /></button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
            </div>
            <div className="text-right">
              <p className="font-bold">${((item.price + (item.selectedSize?.priceModifier ?? 0) + (item.selectedCrust?.priceModifier ?? 0) + item.selectedToppings.reduce((s, t) => s + t.priceModifier, 0)) * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.menuItemId)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-4 mt-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (8.75%)</span><span>${getTax().toFixed(2)}</span></div>
        <div className="border-t pt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-red-600">${getTotal().toFixed(2)}</span></div>
      </div>

      <button onClick={() => navigate("/web/checkout")} className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
        Proceed to Checkout <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
