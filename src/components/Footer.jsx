import { C } from "../lib/theme";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { go } = useApp();
  return (
    <footer style={{ backgroundColor: C.charcoal }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <span style={{ fontFamily: "Playfair Display", fontSize: "1.4rem", color: C.bg }}>Mitti-Desh</span>
          <p className="text-xs mt-3 leading-relaxed" style={{ fontFamily: "Inter", color: C.bg, opacity: 0.55 }}>Rooted in Tradition. Handmade terracotta from India's potter villages.</p>
        </div>
        {[
          ["Shop", ["Kullhads", "Diyas", "Planters", "Home Decor"]],
          ["Company", ["About", "Artisans", "Sustainability", "Contact"]],
          ["Support", ["Shipping", "Returns", "FAQs", "Track Order"]],
        ].map(([h, items]) => (
          <div key={h}>
            <div className="text-xs uppercase mb-3" style={{ fontFamily: "Manrope", letterSpacing: "0.08em", color: C.bg, opacity: 0.4 }}>{h}</div>
            <ul className="space-y-2">
              {items.map((i) => (
                <li key={i}>
                  <button onClick={() => go(h === "Shop" ? "listing" : "home")} className="text-sm text-left" style={{ fontFamily: "Inter", color: C.bg, opacity: 0.7 }}>{i}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t px-5 md:px-8 py-5 text-center text-xs" style={{ borderColor: C.bg + "1A", fontFamily: "Manrope", color: C.bg, opacity: 0.4 }}>
        © 2026 Mitti-Desh. Crafted with the earth, for the home.
      </div>
    </footer>
  );
}
