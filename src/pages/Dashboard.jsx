import { useState } from "react";
import { Package, Heart, MapPin, User, Bell, CreditCard, Star, LogOut, Check } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import { PRODUCTS } from "../lib/data";
import PotArt from "../components/PotArt";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Saved Payments", icon: CreditCard },
  { id: "reviews", label: "Reviews", icon: Star },
];

export default function Dashboard() {
  const { user, logout, orders, wishlist, addresses, go, view } = useApp();
  const [tab, setTab] = useState(view.params?.tab || "orders");

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <p className="text-sm mb-6" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Please sign in to view your dashboard.</p>
        <button onClick={() => go("home")} className="px-6 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Go Home</button>
      </div>
    );
  }

  const wishItems = PRODUCTS.filter((p) => wishlist.has(p.id));

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 grid md:grid-cols-[220px_1fr] gap-10">
      <aside>
        <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl" style={{ backgroundColor: C.cream }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: C.terracotta, fontFamily: "Playfair Display" }}>
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="text-sm truncate" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{user.name}</div>
            <div className="text-xs truncate" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.55 }}>{user.email}</div>
          </div>
        </div>
        <nav className="space-y-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left"
              style={{ backgroundColor: tab === t.id ? C.terracotta + "1A" : "transparent", color: tab === t.id ? C.terracotta : C.charcoal, fontFamily: "Manrope", fontWeight: 600 }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left mt-3" style={{ color: C.danger, fontFamily: "Manrope", fontWeight: 600 }}>
            <LogOut size={15} /> Sign Out
          </button>
        </nav>
      </aside>

      <div>
        {tab === "orders" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Your Orders</h2>
            {orders.length === 0 ? (
              <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>No orders yet. Once you check out, your orders will show up here.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-5 rounded-2xl" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <span className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>#{o.id}</span>
                      <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: C.success + "1A", color: C.success, fontFamily: "Manrope", fontWeight: 600 }}>{o.status}</span>
                    </div>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {o.items.map((i) => (
                        <div key={i.id} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tint(i.tint) + "14" }} title={i.name}>
                          <PotArt shape={i.shape} tint={tint(i.tint)} className="w-7 h-7" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>
                      <span>{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.items.length} items</span>
                      <span style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal, opacity: 1 }}>{fmt(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Wishlist</h2>
            {wishItems.length === 0 ? (
              <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Nothing saved yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {wishItems.map((p) => (
                  <button key={p.id} onClick={() => go("detail", { id: p.id })} className="flex items-center gap-3 p-3 rounded-2xl text-left" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tint(p.tint) + "14" }}>
                      <PotArt shape={p.shape} tint={tint(p.tint)} className="w-9 h-9" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm truncate" style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{p.name}</div>
                      <div className="text-xs mt-0.5" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>{fmt(p.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "addresses" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Saved Addresses</h2>
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl flex items-start gap-3" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                  <MapPin size={16} style={{ color: C.terracotta, marginTop: 2 }} />
                  <div>
                    <div className="text-sm flex items-center gap-2" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>
                      {a.label} {a.isDefault && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: C.terracotta + "1A", color: C.terracotta }}>Default</span>}
                    </div>
                    <div className="text-xs mt-0.5" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>{a.line}, {a.city} - {a.pin}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Profile</h2>
            <div className="space-y-4 max-w-sm">
              <div>
                <div className="text-xs mb-1.5" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.5 }}>Name</div>
                <div className="px-4 py-3 rounded-full text-sm" style={{ border: `1px solid ${C.line}`, color: C.charcoal }}>{user.name}</div>
              </div>
              <div>
                <div className="text-xs mb-1.5" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.5 }}>Email</div>
                <div className="px-4 py-3 rounded-full text-sm" style={{ border: `1px solid ${C.line}`, color: C.charcoal }}>{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "notifications" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Notifications</h2>
            {[
              "Your order #MD482913 has shipped",
              "New festive diyas just launched",
              "Radha Devi shared a new artisan story",
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl mb-2" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                <Check size={14} style={{ color: C.success }} />
                <span className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal }}>{n}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Saved Payments</h2>
            <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>No saved cards yet — you'll be able to save a card at checkout.</p>
          </div>
        )}

        {tab === "reviews" && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.charcoal }}>Your Reviews</h2>
            <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>You haven't written any reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
