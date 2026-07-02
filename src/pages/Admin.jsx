import { useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Boxes, Tag, Users, Star, TrendingUp } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import { PRODUCTS, COUPONS } from "../lib/data";
import PotArt from "../components/PotArt";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "analytics", label: "Analytics", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
];

const MONTHLY = [
  ["Jan", 42000], ["Feb", 51000], ["Mar", 47000], ["Apr", 63000],
  ["May", 58000], ["Jun", 71000],
];

export default function Admin() {
  const { orders, go } = useApp();
  const [tab, setTab] = useState("analytics");
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = PRODUCTS.filter((p) => p.stock <= 5);
  const maxMonth = Math.max(...MONTHLY.map((m) => m[1]));

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Admin Dashboard</h1>
        <button onClick={() => go("home")} className="text-xs px-4 py-2 rounded-full" style={{ border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>Exit Admin</button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs whitespace-nowrap"
            style={{ backgroundColor: tab === t.id ? C.terracotta : C.card, color: tab === t.id ? "#fff" : C.charcoal, border: `1px solid ${tab === t.id ? C.terracotta : C.line}`, fontFamily: "Manrope", fontWeight: 600 }}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "analytics" && (
        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              ["Total Revenue", fmt(totalRevenue || 332000)],
              ["Orders", orders.length || 128],
              ["Products", PRODUCTS.length],
              ["Avg Rating", "4.6"],
            ].map(([l, v]) => (
              <div key={l} className="p-5 rounded-2xl" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
                <div className="text-xs mb-1" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.55 }}>{l}</div>
                <div style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2 mb-6"><TrendingUp size={15} style={{ color: C.terracotta }} /><span className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>Revenue (last 6 months)</span></div>
            <div className="flex items-end gap-4 h-40">
              {MONTHLY.map(([m, v]) => (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${(v / maxMonth) * 100}%`, backgroundColor: C.terracotta, minHeight: 6 }} />
                  <span className="text-[10px]" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.5 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          <table className="w-full text-sm">
            <thead><tr style={{ backgroundColor: C.cream }}>
              {["Product", "Category", "Price", "Stock", "Rating"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="px-4 py-3 flex items-center gap-2" style={{ color: C.charcoal, fontFamily: "Inter" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tint(p.tint) + "14" }}><PotArt shape={p.shape} tint={tint(p.tint)} className="w-6 h-6" /></div>
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.charcoal, opacity: 0.65 }}>{p.cat}</td>
                  <td className="px-4 py-3" style={{ color: C.charcoal, fontFamily: "Manrope", fontWeight: 600 }}>{fmt(p.price)}</td>
                  <td className="px-4 py-3"><span style={{ color: p.stock === 0 ? C.danger : p.stock <= 5 ? C.gold : C.success, fontFamily: "Manrope", fontWeight: 600 }}>{p.stock}</span></td>
                  <td className="px-4 py-3" style={{ color: C.charcoal }}>{p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>No orders placed yet in this session.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl flex items-center justify-between flex-wrap gap-2" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                  <span className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>#{o.id}</span>
                  <span className="text-xs" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>{o.items.length} items · {o.payMethod?.toUpperCase()}</span>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: C.success + "1A", color: C.success, fontFamily: "Manrope", fontWeight: 600 }}>{o.status}</span>
                  <span style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>{fmt(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "inventory" && (
        <div>
          <h3 className="text-sm mb-4" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>Low Stock Alerts</h3>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: p.stock === 0 ? C.danger + "10" : C.gold + "10" }}>
                <span className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal }}>{p.name}</span>
                <span className="text-xs" style={{ fontFamily: "Manrope", fontWeight: 700, color: p.stock === 0 ? C.danger : C.gold }}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "coupons" && (
        <div className="grid sm:grid-cols-3 gap-4">
          {Object.entries(COUPONS).map(([code, pct]) => (
            <div key={code} className="p-5 rounded-2xl" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
              <div style={{ fontFamily: "Playfair Display", fontSize: "1.1rem", color: C.terracotta }}>{code}</div>
              <div className="text-xs mt-1" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>{pct * 100}% off · Active</div>
            </div>
          ))}
        </div>
      )}

      {tab === "customers" && (
        <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Customer records connect to your backend/database — not available in this frontend-only demo.</p>
      )}

      {tab === "reviews" && (
        <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Review moderation connects to your backend/database — not available in this frontend-only demo.</p>
      )}
    </div>
  );
}
