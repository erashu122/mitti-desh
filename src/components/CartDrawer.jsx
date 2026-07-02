import { useState } from "react";
import { X, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import PotArt from "./PotArt";
import { useApp } from "../context/AppContext";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, go, coupon, applyCoupon, setCoupon, user, setAuthOpen } = useApp();
  const [code, setCode] = useState("");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = coupon ? subtotal * coupon.pct : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const shipping = subtotal - discount >= 999 ? 0 : subtotal === 0 ? 0 : 79;
  const total = subtotal - discount + tax + shipping;
  const close = () => setCartOpen(false);

  const checkout = () => {
    close();
    if (!user) { setAuthOpen(true); return; }
    go("checkout");
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={close} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`} style={{ backgroundColor: C.bg }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.line}` }}>
          <h2 style={{ fontFamily: "Playfair Display", fontSize: "1.3rem", color: C.charcoal }}>Your Cart</h2>
          <button onClick={close}><X size={19} style={{ color: C.charcoal }} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center mt-20">
              <PotArt shape="pot" tint={C.line} className="w-20 h-20 mx-auto mb-4" />
              <p className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.55 }}>Your cart is waiting to be filled with handmade warmth.</p>
              <button onClick={() => { close(); go("listing"); }} className="mt-5 px-6 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Continue Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((i) => (
                <div key={i.id} className="flex gap-3 pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: tint(i.tint) + "14" }}>
                    <PotArt shape={i.shape} tint={tint(i.tint)} className="w-10 h-10" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate" style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{i.name}</div>
                    <div className="text-xs mt-0.5" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.55 }}>{fmt(i.price)}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center rounded-full" style={{ border: `1px solid ${C.line}` }}>
                        <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 flex items-center justify-center"><Minus size={11} /></button>
                        <span className="w-6 text-center text-xs" style={{ color: C.charcoal }}>{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 flex items-center justify-center"><Plus size={11} /></button>
                      </div>
                      <button onClick={() => removeFromCart(i.id)} className="text-xs" style={{ fontFamily: "Manrope", color: C.terracotta }}>Remove</button>
                    </div>
                  </div>
                  <div className="text-sm shrink-0" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{fmt(i.price * i.qty)}</div>
                </div>
              ))}

              {/* coupon */}
              <div className="pt-2">
                {coupon ? (
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-full text-xs" style={{ backgroundColor: C.success + "1A", color: C.success, fontFamily: "Manrope", fontWeight: 600 }}>
                    <span className="flex items-center gap-1.5"><Tag size={13} /> {coupon.code} applied</span>
                    <button onClick={() => setCoupon(null)}><X size={13} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try MITTI10)"
                      className="flex-1 px-4 py-2.5 rounded-full text-xs outline-none" style={{ border: `1px solid ${C.line}`, fontFamily: "Inter", color: C.charcoal, backgroundColor: C.card }} />
                    <button onClick={() => applyCoupon(code)} className="px-4 py-2.5 rounded-full text-xs" style={{ backgroundColor: C.charcoal, color: C.bg, fontFamily: "Manrope", fontWeight: 600 }}>Apply</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="space-y-1.5 mb-4 text-xs" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.7 }}>
              <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between" style={{ color: C.success }}><span>Discount ({coupon.code})</span><span>-{fmt(discount)}</span></div>}
              <div className="flex justify-between"><span>Tax (5%)</span><span>{fmt(tax)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : fmt(shipping)}</span></div>
            </div>
            <div className="flex justify-between text-sm mb-4" style={{ fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>
              <span>Total</span><span>{fmt(total)}</span>
            </div>
            <button onClick={checkout} className="w-full py-3.5 rounded-full text-white text-sm flex items-center justify-center gap-2" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
              Checkout — {fmt(total)} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
