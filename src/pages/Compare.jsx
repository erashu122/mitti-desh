import { GitCompare, X, Plus } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import PotArt from "../components/PotArt";
import { useApp } from "../context/AppContext";

export default function Compare() {
  const { compare, toggleCompare, go, addToCart } = useApp();

  if (compare.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-24 text-center">
        <GitCompare size={40} style={{ color: C.line }} className="mx-auto mb-4" />
        <h1 className="mb-2" style={{ fontFamily: "Playfair Display", fontSize: "1.6rem", color: C.charcoal }}>Nothing to compare yet</h1>
        <p className="text-sm mb-6" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Tap the compare icon on any product card to add it here — compare up to 4 at once.</p>
        <button onClick={() => go("listing")} className="px-6 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Browse Collection</button>
      </div>
    );
  }

  const rows = [
    ["Price", (p) => fmt(p.price)],
    ["Rating", (p) => `${p.rating} (${p.reviews})`],
    ["Category", (p) => p.cat],
    ["Material", (p) => p.material],
    ["Finish", (p) => p.finish],
    ["Village", (p) => p.village],
    ["Artisan", (p) => `${p.artisan}, ${p.years} yrs`],
    ["Stock", (p) => (p.stock === 0 ? "Out of stock" : `${p.stock} available`)],
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 overflow-x-auto">
      <h1 className="mb-8" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Compare Products</h1>
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <td className="w-32"></td>
            {compare.map((p) => (
              <td key={p.id} className="p-4 align-bottom">
                <div className="rounded-2xl p-4 relative" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
                  <button onClick={() => toggleCompare(p)} className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: C.bg }}>
                    <X size={12} style={{ color: C.charcoal }} />
                  </button>
                  <PotArt shape={p.shape} tint={tint(p.tint)} className="w-16 h-20 mx-auto mb-2" />
                  <div className="text-xs text-center" style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{p.name}</div>
                  <button onClick={() => addToCart(p)} disabled={p.stock === 0} className="w-full mt-3 py-2 rounded-full text-xs text-white disabled:opacity-40" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
                    Add to Cart
                  </button>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fn]) => (
            <tr key={label} style={{ borderTop: `1px solid ${C.line}` }}>
              <td className="py-3 text-xs" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal, opacity: 0.6 }}>{label}</td>
              {compare.map((p) => (
                <td key={p.id} className="py-3 text-sm text-center" style={{ fontFamily: "Inter", color: C.charcoal }}>{fn(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
