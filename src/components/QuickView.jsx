import { useState } from "react";
import { X, Heart, Plus, Minus, ArrowRight } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import PotArt from "./PotArt";
import { Badge, Rating } from "./Bits";
import { useApp } from "../context/AppContext";

export default function QuickView() {
  const { quickView, setQuickView, addToCart, wishlist, toggleWish, openProduct } = useApp();
  const [qty, setQty] = useState(1);
  if (!quickView) return null;
  const p = quickView;
  const close = () => { setQuickView(null); setQty(1); };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden animate-fadeUp grid sm:grid-cols-2" style={{ backgroundColor: C.card }} onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: C.bg }}>
          <X size={16} style={{ color: C.charcoal }} />
        </button>
        <div className="flex items-center justify-center py-10" style={{ backgroundColor: tint(p.tint) + "12" }}>
          <PotArt shape={p.shape} tint={tint(p.tint)} className="w-44 h-52" />
        </div>
        <div className="p-6">
          <Badge tone="success">Handmade</Badge>
          <h2 className="mt-2 mb-1" style={{ fontFamily: "Playfair Display", fontSize: "1.3rem", color: C.charcoal }}>{p.name}</h2>
          <Rating value={p.rating} count={p.reviews} />
          <div className="flex items-baseline gap-2 mt-3">
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.2rem", color: C.charcoal }}>{fmt(p.price)}</span>
            {p.mrp > p.price && <span className="text-xs line-through opacity-40">{fmt(p.mrp)}</span>}
          </div>
          <p className="text-xs mt-3 leading-relaxed line-clamp-3" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>{p.desc}</p>

          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center rounded-full" style={{ border: `1px solid ${C.line}` }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center"><Minus size={12} /></button>
              <span className="w-6 text-center text-xs" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center"><Plus size={12} /></button>
            </div>
            <button onClick={() => toggleWish(p.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}>
              <Heart size={14} fill={wishlist.has(p.id) ? C.terracotta : "none"} stroke={C.terracotta} />
            </button>
          </div>

          <button
            onClick={() => { addToCart(p, qty); close(); }}
            disabled={p.stock === 0}
            className="w-full mt-4 py-3 rounded-full text-white text-sm disabled:opacity-40"
            style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}
          >
            {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button onClick={() => { close(); openProduct(p); }} className="w-full mt-2 py-2 text-xs flex items-center justify-center gap-1" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>
            View full details <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
