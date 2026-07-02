import { useEffect, useRef, useState } from "react";
import { ArrowRight, Hammer, Leaf, MapPin, ShieldCheck, Star, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { C, tint } from "../lib/theme";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, GALLERY } from "../lib/data";
import PotArt from "../components/PotArt";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, start;
    const dur = 1200;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return val;
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Stat({ n, label, suffix = "" }) {
  const [ref, inView] = useInView();
  const val = useCountUp(n, inView);
  return (
    <div ref={ref}>
      <div style={{ fontFamily: "Playfair Display", fontSize: "1.8rem", color: C.terracotta }}>{val}{suffix}</div>
      <div className="text-xs mt-1" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.6 }}>{label}</div>
    </div>
  );
}

function TestimonialSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const r = TESTIMONIALS[i];
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="rounded-3xl p-8" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
        <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={14} fill={C.gold} stroke={C.gold} />)}</div>
        <p className="text-base leading-relaxed" style={{ fontFamily: "Playfair Display", color: C.charcoal, fontStyle: "italic" }}>"{r.t}"</p>
        <div className="mt-5 text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>{r.n} <span className="font-normal opacity-50">· {r.city}</span></div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-5">
        <button onClick={() => setI((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}><ChevronLeft size={15} /></button>
        <div className="flex gap-1.5">
          {TESTIMONIALS.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: k === i ? C.terracotta : C.line, width: k === i ? "16px" : "6px" }} />
          ))}
        </div>
        <button onClick={() => setI((v) => (v + 1) % TESTIMONIALS.length)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

export default function Home() {
  const { go } = useApp();
  const bestSellers = PRODUCTS.slice(0, 8);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="inline-block mb-5 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: C.terracotta + "1A", color: C.terracotta, fontFamily: "Manrope", fontWeight: 600, letterSpacing: "0.04em" }}>
              HANDMADE BY RURAL ARTISANS
            </span>
            <h1 style={{ fontFamily: "Playfair Display", color: C.charcoal, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.05 }}>
              Bring the Earth's<br />Warmth Home
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.75 }}>
              Celebrate India's timeless pottery traditions with handcrafted terracotta made by skilled rural artisans — one wheel-turn at a time.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button onClick={() => go("listing")} className="px-7 py-3.5 rounded-full text-white text-sm flex items-center gap-2 transition hover:opacity-90" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
                Explore Collection <ArrowRight size={15} />
              </button>
              <button onClick={() => go("home", { scrollTo: "artisan" })} className="px-7 py-3.5 rounded-full text-sm transition hover:bg-black/5" style={{ border: `1px solid ${C.charcoal}33`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>
                Meet Our Artisans
              </button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full" style={{ backgroundColor: C.clay + "26" }} />
            <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full translate-x-10 -translate-y-6" style={{ backgroundColor: C.gold + "22" }} />
            <PotArt shape="pot" tint={C.terracotta} className="relative w-56 md:w-72 drop-shadow-xl" />
            <PotArt shape="diya" tint={C.gold} className="absolute -bottom-2 -left-4 w-24 md:w-32" rotate={-8} />
            <PotArt shape="mug" tint={C.clay} className="absolute top-2 -right-2 w-20 md:w-28" rotate={10} />
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "60px" }}>
          <path d="M0,40 C360,90 1080,0 1440,40 L1440,80 L0,80 Z" fill={C.bg} />
        </svg>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Shop by Category</h2>
          <button onClick={() => go("listing")} className="text-sm hidden sm:flex items-center gap-1" style={{ fontFamily: "Manrope", color: C.terracotta }}>View all <ArrowRight size={14} /></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <button key={c.name} onClick={() => go("listing", { cat: c.name })} className="group text-left rounded-3xl p-6 transition hover:-translate-y-1" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
              <PotArt shape={c.shape} tint={C.terracotta} className="w-16 h-16 mb-4" />
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{c.name}</span>
                <ArrowRight size={15} className="opacity-0 group-hover:opacity-100 transition" style={{ color: C.terracotta }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Hammer, t: "Handcrafted", d: "Every piece thrown, shaped, and fired by hand." },
            { icon: Leaf, t: "Eco Friendly", d: "Natural clay, zero plastic, fully biodegradable." },
            { icon: MapPin, t: "Rural Artisans", d: "70% of each sale goes directly to the potter." },
            { icon: ShieldCheck, t: "Made in India", d: "Sourced from potter villages across five states." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="text-center px-2">
              <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: C.terracotta + "1A" }}>
                <Icon size={22} style={{ color: C.terracotta }} />
              </div>
              <h3 style={{ fontFamily: "Playfair Display", color: C.charcoal }}>{t}</h3>
              <p className="text-sm mt-1.5" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Best Sellers</h2>
            <p className="text-sm mt-1" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Loved by homes across India</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ARTISAN STORY */}
      <section id="artisan" className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div className="relative flex items-center justify-center order-2 md:order-1">
          <div className="absolute w-64 h-64 rounded-full" style={{ backgroundColor: C.gold + "20" }} />
          <PotArt shape="vase" tint={C.clay} className="relative w-52" />
        </div>
        <div className="order-1 md:order-2">
          <span className="text-xs uppercase" style={{ fontFamily: "Manrope", letterSpacing: "0.1em", color: C.terracotta, fontWeight: 600 }}>Featured Artisan</span>
          <h2 className="mt-3" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>MR.RAJ-KISHOR PANDIT</h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.75 }}>
           For over four decades, our family has preserved the art of traditional pottery, crafting authentic handmade clay products with passion, precision, and a commitment to timeless Indian craftsmanship.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <Stat n={28} label="Years" />
            <Stat n={1200} suffix="+" label="Pieces / yr" />
            <Stat n={12} label="Artisans trained" />
          </div>
          <button onClick={() => go("listing")} className="mt-8 px-6 py-3 rounded-full text-sm inline-flex items-center gap-2" style={{ backgroundColor: C.terracotta, color: "#fff", fontFamily: "Manrope", fontWeight: 600 }}>
            Shop her collection <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* FESTIVAL BANNER */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 items-center" style={{ backgroundColor: C.charcoal }}>
          <div className="p-10 md:p-14">
            <span className="text-xs uppercase" style={{ fontFamily: "Manrope", letterSpacing: "0.1em", color: C.gold, fontWeight: 600 }}>Festive Collection</span>
            <h2 className="mt-3" style={{ fontFamily: "Playfair Display", fontSize: "1.9rem", color: C.bg }}>Light Up This Diwali</h2>
            <p className="mt-3 text-sm leading-relaxed max-w-sm" style={{ fontFamily: "Inter", color: C.bg, opacity: 0.7 }}>
              Hand-pressed diyas and festival lamps, sun-dried and fired for the warmest glow at home.
            </p>
            <button onClick={() => go("listing", { cat: "Festive Diyas" })} className="mt-6 px-6 py-3 rounded-full text-sm inline-flex items-center gap-2" style={{ backgroundColor: C.gold, color: C.charcoal, fontFamily: "Manrope", fontWeight: 700 }}>
              Shop Diyas <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex items-center justify-center py-10 gap-2">
            <PotArt shape="diya" tint={C.gold} className="w-24" rotate={-6} />
            <PotArt shape="diya" tint={C.terracotta} className="w-32" />
            <PotArt shape="diya" tint={C.clay} className="w-24" rotate={6} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">
          <h2 className="text-center mb-10" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>What Our Customers Say</h2>
          <TestimonialSlider />
        </div>
      </section>

      {/* GALLERY */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <h2 className="text-center mb-10" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>@MittiDesh on Instagram</h2>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
          {GALLERY.map((g) => (
            <div key={g.id} className="rounded-2xl overflow-hidden flex items-center justify-center break-inside-avoid transition hover:opacity-90" style={{ backgroundColor: tint(g.tint) + "16", height: g.h }}>
              <PotArt shape={g.shape} tint={tint(g.tint)} className="w-16 h-20" />
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 text-center">
        <PotArt shape="diya" tint={C.gold} className="w-16 h-16 mx-auto mb-5" />
        <h2 style={{ fontFamily: "Playfair Display", fontSize: "1.8rem", color: C.charcoal }}>Join the Mitti-Desh Circle</h2>
        <p className="text-sm mt-2 mb-7" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.65 }}>New collections, artisan stories, and festive offers — no spam, ever.</p>
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-sm" style={{ fontFamily: "Manrope", fontWeight: 600, color: C.success }}>
            <Check size={16} /> You're subscribed — welcome to the circle!
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex max-w-md mx-auto rounded-full p-1.5" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@email.com" className="flex-1 bg-transparent outline-none px-4 text-sm" style={{ fontFamily: "Inter", color: C.charcoal }} />
            <button className="px-5 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Subscribe</button>
          </form>
        )}
      </section>
    </>
  );
}
