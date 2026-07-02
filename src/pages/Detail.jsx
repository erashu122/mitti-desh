import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronDown, Heart, Minus, Plus, MapPin, Truck, RotateCw, Share2, Check } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import { PRODUCTS } from "../lib/data";
import PotArt from "../components/PotArt";
import { Badge, Rating } from "../components/Bits";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

function RotateViewer({ shape, color }) {
  const [angle, setAngle] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const start = (x) => { dragging.current = true; lastX.current = x; };
  const move = (x) => {
    if (!dragging.current) return;
    setAngle((a) => a + (x - lastX.current) * 0.6);
    lastX.current = x;
  };
  const end = () => (dragging.current = false);

  return (
    <div
      className="rounded-3xl flex items-center justify-center py-16 select-none cursor-grab active:cursor-grabbing relative"
      style={{ backgroundColor: color + "12" }}
      onMouseDown={(e) => start(e.clientX)}
      onMouseMove={(e) => move(e.clientX)}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchStart={(e) => start(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={end}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]" style={{ backgroundColor: C.card, color: C.charcoal, fontFamily: "Manrope", fontWeight: 600 }}>
        <RotateCw size={11} /> Drag to rotate
      </div>
      <PotArt shape={shape} tint={color} className="w-52 h-64" style={{ transform: `perspective(600px) rotateY(${angle}deg)`, transition: dragging.current ? "none" : "transform 0.3s ease" }} />
    </div>
  );
}

export default function Detail() {
  const { view, addToCart, wishlist, toggleWish, go, openProduct, notify } = useApp();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === view.params.id) || PRODUCTS[0], [view.params.id]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [shared, setShared] = useState(false);
  const p = product;
  const color = tint(p.tint);
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);

  const share = () => {
    setShared(true);
    notify("Link copied to clipboard");
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <button onClick={() => go("listing")} className="flex items-center gap-1.5 text-sm mb-8" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>
        <ChevronLeft size={15} /> Back to Shop
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <RotateViewer shape={p.shape} color={color} />
          <div className="flex gap-3 mt-4">
            {[color, C.gold, C.charcoal].map((t, i) => (
              <div key={i} className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: t + "12", border: `1px solid ${C.line}` }}>
                <PotArt shape={p.shape} tint={t} className="w-10 h-10" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Badge tone="success">Handmade</Badge>
          <h1 className="mt-3" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>{p.name}</h1>
          <div className="mt-2"><Rating value={p.rating} count={p.reviews} /></div>
          <div className="flex items-baseline gap-3 mt-5">
            <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: "1.6rem", color: C.charcoal }}>{fmt(p.price)}</span>
            {p.mrp > p.price && <span className="line-through opacity-40 text-sm">{fmt(p.mrp)}</span>}
            {p.mrp > p.price && <Badge>-{Math.round((1 - p.price / p.mrp) * 100)}% off</Badge>}
          </div>
          <div className="mt-2">
            {p.stock === 0 ? <Badge tone="danger">Out of stock</Badge> : p.stock <= 5 ? <Badge tone="gold">Only {p.stock} left</Badge> : <Badge tone="success">In stock</Badge>}
          </div>

          <div className="flex items-center gap-4 mt-7">
            <div className="flex items-center rounded-full" style={{ border: `1px solid ${C.line}` }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock || 99, q + 1))} className="w-10 h-10 flex items-center justify-center"><Plus size={14} /></button>
            </div>
            <button onClick={() => toggleWish(p.id)} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}>
              <Heart size={16} fill={wishlist.has(p.id) ? C.terracotta : "none"} stroke={C.terracotta} />
            </button>
            <button onClick={share} className="w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}>
              {shared ? <Check size={16} style={{ color: C.success }} /> : <Share2 size={16} style={{ color: C.charcoal }} />}
            </button>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => addToCart(p, qty)} disabled={p.stock === 0} className="flex-1 py-3.5 rounded-full text-sm text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
              {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button onClick={() => { addToCart(p, qty); go("checkout"); }} disabled={p.stock === 0} className="flex-1 py-3.5 rounded-full text-sm transition hover:bg-black/5 disabled:opacity-40" style={{ border: `1px solid ${C.charcoal}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>
              Buy Now
            </button>
          </div>

          <div className="flex items-center gap-2 mt-6 text-xs" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>
            <Truck size={14} /> Estimated delivery in 4–7 days · Free returns within 10 days
          </div>

          <div className="mt-8" style={{ borderTop: `1px solid ${C.line}` }}>
            {["Description", "Specifications", "Care Guide"].map((t) => (
              <div key={t} style={{ borderBottom: `1px solid ${C.line}` }}>
                <button onClick={() => setTab(tab === t ? "" : t)} className="w-full flex items-center justify-between py-4 text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>
                  {t} <ChevronDown size={15} style={{ transform: tab === t ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                {tab === t && (
                  <p className="pb-4 text-sm leading-relaxed" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.7 }}>
                    {t === "Description" && p.desc}
                    {t === "Specifications" && `Material: ${p.material} · Finish: ${p.finish} · Handmade: yes, dimensions vary slightly piece to piece.`}
                    {t === "Care Guide" && "Hand wash with warm water, avoid harsh detergents. Air dry fully before storing. Natural clay may develop a patina with use — this is part of its character."}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl p-6" style={{ backgroundColor: C.cream }}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={15} style={{ color: C.terracotta }} />
              <span className="text-xs" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{p.village} · {p.artisan}, {p.years} yrs experience</span>
            </div>
            <p className="text-sm leading-relaxed mt-2 mb-4" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.75 }}>This purchase directly supports rural Indian potters.</p>
            <div className="flex items-center justify-between text-xs mb-1.5" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>
              <span>Revenue to artisan</span><span>70%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.line }}>
              <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: C.success }} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-8" style={{ fontFamily: "Playfair Display", fontSize: "1.6rem", color: C.charcoal }}>You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
