import { Outlet, useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { Pizza, ShoppingCart } from "lucide-react";

export default function WebLayout() {
  const navigate = useNavigate();
  const itemCount = useCartStore(s => s.getItemCount());

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#166534] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/web")} className="flex items-center gap-2">
            <Pizza className="w-6 h-6 text-red-400" />
            <span className="font-bold font-serif">Napoli Pizza</span>
          </button>
          <button onClick={() => navigate("/web/cart")} className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{itemCount}</span>
            )}
          </button>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-[#166534] text-green-200 py-4 text-center text-sm">
        <p>Napoli Pizza &mdash; Authentic Italian Pizzeria</p>
      </footer>
    </div>
  );
}
