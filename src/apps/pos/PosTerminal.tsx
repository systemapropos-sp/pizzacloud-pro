import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";
import { useCan } from "@/store/permissionStore";
import { PERMISSIONS } from "@contracts/constants";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, CheckCircle } from "lucide-react";

export default function PosTerminal() {
  const { data: menuItems } = trpc.menu.items.useQuery({});
  const [search, setSearch] = useState("");
  const { items, addItem, removeItem, updateQuantity, getSubtotal, getTax, getTotal, clearCart } = useCartStore();
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [receipt, setReceipt] = useState<any>(null);
  const canDiscount = useCan(PERMISSIONS.POS_DISCOUNT);
  const canRefund = useCan(PERMISSIONS.POS_REFUND);

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => { setReceipt({ orderNumber: data.orderNumber, total: getTotal() }); clearCart(); },
  });

  const filtered = menuItems?.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()));

  const quickAdd = (item: any) => addItem({
    menuItemId: item.id, name: item.name, price: parseFloat(item.price), quantity: 1,
    image: item.image, selectedSize: null, selectedCrust: null, selectedToppings: [], selectedExtras: [],
  });

  const processPay = () => {
    if (items.length === 0) return;
    createOrder.mutate({
      orderType: "takeout", source: "pos",
      subtotal: getSubtotal().toFixed(2), tax: getTax().toFixed(2), total: getTotal().toFixed(2),
      items: items.map(item => ({ menuItemId: item.menuItemId, name: item.name, quantity: item.quantity, unitPrice: item.price.toFixed(2), totalPrice: (item.price * item.quantity).toFixed(2) })),
    });
  };

  if (receipt) return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="bg-white rounded-2xl border shadow-lg p-8 text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
        <h2 className="text-xl font-bold mb-1">Payment Complete</h2>
        <p className="text-gray-500 mb-4">{receipt.orderNumber}</p>
        <p className="text-3xl font-bold text-red-600 mb-6">${receipt.total.toFixed(2)}</p>
        <button onClick={() => setReceipt(null)} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl">New Transaction</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 overflow-auto">
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm" />
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered?.map(item => (
            <button key={item.id} onClick={() => quickAdd(item)} className="bg-white rounded-xl border p-3 text-left hover:shadow-md hover:border-red-300 transition-all">
              <img src={item.image ?? ""} alt={item.name} className="w-full h-20 object-cover rounded-lg mb-2" />
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-red-600 font-bold text-sm">${item.price}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="w-96 bg-white border-l flex flex-col">
        <div className="p-4 border-b"><h2 className="font-bold text-lg">Current Order</h2></div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {items.length === 0 && <p className="text-center text-gray-400 py-8">Tap items to add</p>}
          {items.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between"><span className="font-medium text-sm">{item.name}</span><span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span></div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => removeItem(item.menuItemId)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-600">Tax</span><span>${getTax().toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-bold border-t pt-2"><span>Total</span><span className="text-red-600">${getTotal().toFixed(2)}</span></div>
          <div className="flex gap-2">
            <button onClick={() => setMethod("cash")} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 ${method === "cash" ? "bg-emerald-500 text-white" : "bg-gray-100"}`}><Banknote className="w-5 h-5" /> Cash</button>
            <button onClick={() => setMethod("card")} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 ${method === "card" ? "bg-blue-500 text-white" : "bg-gray-100"}`}><CreditCard className="w-5 h-5" /> Card</button>
          </div>
          <button onClick={processPay} disabled={items.length === 0} className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-lg font-bold rounded-xl">Charge ${getTotal().toFixed(2)}</button>
        </div>
      </div>
    </div>
  );
}
