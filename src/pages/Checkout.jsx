import { useState } from "react";
import { MapPin, Truck, CreditCard, Smartphone, Wallet, Check, ArrowRight, Plus } from "lucide-react";
import { C, fmt, tint } from "../lib/theme";
import PotArt from "../components/PotArt";
import { useApp } from "../context/AppContext";

const STEPS = ["Address", "Delivery", "Payment", "Review"];

export default function Checkout() {
  const { cart, addresses, setAddresses, coupon, placeOrder, go, user } = useApp();
  const [step, setStep] = useState(0);
  const [addrId, setAddrId] = useState(addresses[0]?.id);
  const [delivery, setDelivery] = useState("standard");
  const [pay, setPay] = useState("card");
  const [order, setOrder] = useState(null);
  const [newAddr, setNewAddr] = useState(false);
  const [form, setForm] = useState({ label: "", line: "", city: "", pin: "" });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = coupon ? subtotal * coupon.pct : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const deliveryFee = delivery === "express" ? 149 : subtotal - discount >= 999 ? 0 : 79;
  const total = subtotal - discount + tax + deliveryFee;
  const selectedAddr = addresses.find((a) => a.id === addrId);

  if (cart.length === 0 && !order) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="text-sm mb-6" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Your cart is empty — add something handmade first.</p>
        <button onClick={() => go("listing")} className="px-6 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Browse Collection</button>
      </div>
    );
  }

  if (order) {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center animate-fadeUp">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: C.success + "1A" }}>
          <Check size={34} style={{ color: C.success }} />
        </div>
        <h1 className="mb-2" style={{ fontFamily: "Playfair Display", fontSize: "1.8rem", color: C.charcoal }}>Order Confirmed!</h1>
        <p className="text-sm mb-1" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>Order #{order.id} · {fmt(order.total)}</p>
        <p className="text-sm mb-8" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>We'll notify you as your handmade pieces make their way to you.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => go("dashboard", { tab: "orders" })} className="px-6 py-3 rounded-full text-sm text-white" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>View Orders</button>
          <button onClick={() => go("listing")} className="px-6 py-3 rounded-full text-sm" style={{ border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  const addNewAddress = () => {
    if (!form.line || !form.city || !form.pin) return;
    const a = { id: Date.now(), label: form.label || "Address", ...form, isDefault: false };
    setAddresses((prev) => [...prev, a]);
    setAddrId(a.id);
    setNewAddr(false);
    setForm({ label: "", line: "", city: "", pin: "" });
  };

  const confirmOrder = () => {
    const o = placeOrder(selectedAddr, pay);
    setOrder(o);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="mb-8" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Checkout</h1>

      <div className="flex items-center gap-2 mb-10 flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button onClick={() => i < step && setStep(i)} className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: i <= step ? C.terracotta : C.card, color: i <= step ? "#fff" : C.charcoal, border: `1px solid ${i <= step ? C.terracotta : C.line}`, fontFamily: "Manrope", fontWeight: 600 }}>
                {i < step ? <Check size={13} /> : i + 1}
              </span>
              <span className="text-xs hidden sm:inline" style={{ fontFamily: "Manrope", fontWeight: 600, color: i <= step ? C.charcoal : C.charcoal + "80" }}>{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-6 h-px" style={{ backgroundColor: C.line }} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        <div>
          {step === 0 && (
            <div className="space-y-3">
              {addresses.map((a) => (
                <button key={a.id} onClick={() => setAddrId(a.id)} className="w-full text-left p-4 rounded-2xl flex items-start gap-3" style={{ border: `1px solid ${addrId === a.id ? C.terracotta : C.line}`, backgroundColor: C.card }}>
                  <MapPin size={16} style={{ color: C.terracotta, marginTop: 2 }} />
                  <div>
                    <div className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{a.label}</div>
                    <div className="text-xs mt-0.5" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>{a.line}, {a.city} - {a.pin}</div>
                  </div>
                </button>
              ))}
              {newAddr ? (
                <div className="p-4 rounded-2xl space-y-2" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                  {["label", "line", "city", "pin"].map((f) => (
                    <input key={f} placeholder={f === "label" ? "Label (Home, Office...)" : f === "line" ? "Address line" : f === "city" ? "City" : "PIN code"}
                      value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-full text-sm outline-none" style={{ border: `1px solid ${C.line}`, color: C.charcoal, backgroundColor: C.bg }} />
                  ))}
                  <button onClick={addNewAddress} className="px-5 py-2.5 rounded-full text-xs text-white" style={{ backgroundColor: C.charcoal, fontFamily: "Manrope", fontWeight: 600 }}>Save Address</button>
                </div>
              ) : (
                <button onClick={() => setNewAddr(true)} className="w-full p-4 rounded-2xl flex items-center justify-center gap-2 text-sm" style={{ border: `1px dashed ${C.line}`, color: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
                  <Plus size={14} /> Add new address
                </button>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard Delivery", d: "4–7 business days", price: subtotal - discount >= 999 ? "Free" : fmt(79) },
                { id: "express", label: "Express Delivery", d: "1–2 business days", price: fmt(149) },
              ].map((o) => (
                <button key={o.id} onClick={() => setDelivery(o.id)} className="w-full text-left p-4 rounded-2xl flex items-center justify-between" style={{ border: `1px solid ${delivery === o.id ? C.terracotta : C.line}`, backgroundColor: C.card }}>
                  <div className="flex items-center gap-3">
                    <Truck size={16} style={{ color: C.terracotta }} />
                    <div>
                      <div className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{o.label}</div>
                      <div className="text-xs mt-0.5" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>{o.d}</div>
                    </div>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{o.price}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {[
                { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                { id: "upi", label: "UPI", icon: Smartphone },
                { id: "cod", label: "Cash on Delivery", icon: Wallet },
              ].map((o) => (
                <button key={o.id} onClick={() => setPay(o.id)} className="w-full text-left p-4 rounded-2xl flex items-center gap-3" style={{ border: `1px solid ${pay === o.id ? C.terracotta : C.line}`, backgroundColor: C.card }}>
                  <o.icon size={16} style={{ color: C.terracotta }} />
                  <span className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{o.label}</span>
                </button>
              ))}
              <p className="text-xs mt-2" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.5 }}>This is a demo checkout — no real payment is processed.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl" style={{ border: `1px solid ${C.line}`, backgroundColor: C.card }}>
                <div className="text-xs uppercase mb-2" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.5 }}>Deliver to</div>
                <div className="text-sm" style={{ fontFamily: "Inter", color: C.charcoal }}>{selectedAddr?.label} — {selectedAddr?.line}, {selectedAddr?.city} - {selectedAddr?.pin}</div>
              </div>
              {cart.map((i) => (
                <div key={i.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: tint(i.tint) + "14" }}>
                    <PotArt shape={i.shape} tint={tint(i.tint)} className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-sm" style={{ fontFamily: "Inter", color: C.charcoal }}>{i.name} × {i.qty}</div>
                  <div className="text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{fmt(i.price * i.qty)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="px-6 py-3 rounded-full text-sm" style={{ border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>Back</button>}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)} className="flex-1 py-3 rounded-full text-sm text-white flex items-center justify-center gap-2" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={confirmOrder} className="flex-1 py-3 rounded-full text-sm text-white flex items-center justify-center gap-2" style={{ backgroundColor: C.success, fontFamily: "Manrope", fontWeight: 600 }}>
                Place Order — {fmt(total)}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-3xl p-6 h-fit" style={{ backgroundColor: C.cream }}>
          <div className="text-sm mb-4" style={{ fontFamily: "Playfair Display", color: C.charcoal }}>Order Summary</div>
          <div className="space-y-1.5 text-xs mb-4" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.75 }}>
            <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between" style={{ color: C.success }}><span>Discount</span><span>-{fmt(discount)}</span></div>}
            <div className="flex justify-between"><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : fmt(deliveryFee)}</span></div>
          </div>
          <div className="flex justify-between text-sm pt-3" style={{ borderTop: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 700, color: C.charcoal }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
