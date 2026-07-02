import { useState } from "react";
import { Heart, Plus, Eye, GitCompare, Check } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import PotArt from "./PotArt";
import { Badge, Rating } from "./Bits";
import { useApp } from "../context/AppContext";

export default function ProductCard({ p, list = false }) {
  const { openProduct, wishlist, toggleWish, addToCart, compare, toggleCompare, setQuickView } = useApp();
  const [hover, setHover] = useState(false);
  const inCompare = !!compare.find((i) => i.id === p.id);
  const tintColor = tint(p.tint);

  return (
    <div
      className={`group rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 ${list ? "flex" : ""}`}
      style={{ backgroundColor: C.card, border: `1px solid ${C.line}`, transform: hover ? "translateY(-4px)" : "none", boxShadow: hover ? "0 18px 34px -18px rgba(0,0,0,0.25)" : "0 2px 10px -6px rgba(0,0,0,0.12)" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => openProduct(p)}
    >
      <div className={`relative flex items-center justify-center ${list ? "w-48 shrink-0" : "pt-8 pb-4"}`} style={{ backgroundColor: tintColor + "12" }}>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ backgroundColor: C.card }} title="Wishlist"
          >
            <Heart size={15} fill={wishlist.has(p.id) ? C.terracotta : "none"} stroke={C.terracotta} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(p); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ backgroundColor: inCompare ? C.terracotta : C.card }} title="Compare"
          >
            <GitCompare size={14} color={inCompare ? "#fff" : C.terracotta} />
          </button>
        </div>
        {p.mrp > p.price && <div className="absolute top-3 left-3"><Badge>-{Math.round((1 - p.price / p.mrp) * 100)}%</Badge></div>}
        <PotArt shape={p.shape} tint={tintColor} className={list ? "w-24 h-28 my-4" : "w-28 h-32 transition-transform duration-500"} style={!list ? { transform: hover ? "scale(1.08) rotate(-2deg)" : "none" } : undefined} />

        {hover && !list && (
          <button
            onClick={(e) => { e.stopPropagation(); setQuickView(p); }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition"
            style={{ backgroundColor: C.charcoal, color: C.bg, fontFamily: "Manrope", fontWeight: 600 }}
          >
            <Eye size={13} /> Quick View
          </button>
        )}
      </div>
      <div className="p-4 flex-1">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <Badge tone="success">Handmade</Badge>
          {p.stock === 0 && <Badge tone="danger">Out of stock</Badge>}
          {p.stock > 0 && p.stock <= 5 && <Badge tone="gold">Only {p.stock} left</Badge>}
        </div>
        <h3 className="text-[15px] leading-snug mb-1" style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{p.name}</h3>
        <Rating value={p.rating} count={p.reviews} />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>{fmt(p.price)}</span>
            {p.mrp > p.price && <span className="text-xs line-through opacity-40">{fmt(p.mrp)}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
            disabled={p.stock === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition disabled:opacity-40"
            style={{ backgroundColor: C.terracotta }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
