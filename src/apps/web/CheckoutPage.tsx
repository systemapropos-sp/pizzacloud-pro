import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";
import { CreditCard, Banknote, CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, orderType, clearCart } = useCartStore();
  const [name, setName] = useState("");
  const [method, setMethod] = useState<"card" | "cash">("card");
  const [done, setDone] = useState(false);
  const [orderNum, setOrderNum] = useState("");
  const [processing, setProcessing] = useState(false);

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => { setOrderNum(data.orderNumber); setDone(true); clearCart(); },
  });

  const handlePay = async () => {
    setProcessing(true);
    await createOrder.mutateAsync({
      orderType, source: "web",
      subtotal: getSubtotal().toFixed(2), tax: getTax().toFixed(2), total: getTotal().toFixed(2),
      items: items.map(item => ({
        menuItemId: item.menuItemId, name: item.name, quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
        totalPrice: ((item.price + (item.selectedSize?.priceModifier ?? 0) + (item.selectedCrust?.priceModifier ?? 0) + item.selectedToppings.reduce((s, t) => s + t.priceModifier, 0)) * item.quantity).toFixed(2),
        selectedSize: item.selectedSize, selectedCrust: item.selectedCrust, selectedToppings: item.selectedToppings,
      })),
    });
    setProcessing(false);
  };

  if (done) return (
    <div className="px-4 py-16 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-600" /></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-3xl font-bold text-red-600 mb-4">{orderNum}</p>
      <p className="text-gray-500 mb-8">Your pizza will be ready in 15-20 minutes</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate("/web")} className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">Order More</button>
        <button onClick={() => navigate("/")} className="px-6 py-2 border rounded-lg font-medium">Home</button>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6">Checkout</h2>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <p className="font-medium mb-3">Customer Info</p>
        <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg text-sm mb-2" />
      </div>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <p className="font-medium mb-3">Payment Method</p>
        <div className="flex gap-3">
          <button onClick={() => setMethod("card")} className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 ${method === "card" ? "border-red-500 bg-red-50" : "border-gray-200"}`}><CreditCard className={`w-8 h-8 ${method === "card" ? "text-red-600" : "text-gray-400"}`} /><span className="font-bold">Card</span></button>
          <button onClick={() => setMethod("cash")} className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 ${method === "cash" ? "border-red-500 bg-red-50" : "border-gray-200"}`}><Banknote className={`w-8 h-8 ${method === "cash" ? "text-red-600" : "text-gray-400"}`} /><span className="font-bold">Cash</span></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-6">
        <p className="font-medium mb-3">Order Summary</p>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm mb-1"><span className="text-gray-600">{item.quantity}x {item.name}</span><span>${((item.price + (item.selectedSize?.priceModifier ?? 0) + (item.selectedCrust?.priceModifier ?? 0) + item.selectedToppings.reduce((s, t) => s + t.priceModifier, 0)) * item.quantity).toFixed(2)}</span></div>
        ))}
        <div className="border-t mt-3 pt-3 space-y-1">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${getTax().toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-bold border-t pt-2"><span>Total</span><span className="text-red-600">${getTotal().toFixed(2)}</span></div>
        </div>
      </div>

      <button onClick={handlePay} disabled={processing} className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white text-xl font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
        {processing ? <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</> : `Pay $${getTotal().toFixed(2)}`}
      </button>
    </div>
  );
}
