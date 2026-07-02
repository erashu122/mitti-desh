import { useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, GitCompare } from "lucide-react";
import { C } from "../lib/theme";
import { useApp } from "../context/AppContext";

export default function Nav() {
  const { go, cart, wishlist, compare, setCartOpen, user, setAuthOpen, dark, setDark } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const links = ["Home", "Shop", "Collections", "Artisans", "About", "Contact"];
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const submitSearch = (e) => {
    e.preventDefault();
    go("listing", { q: search });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: C.bg + "F2", borderBottom: `1px solid ${C.line}` }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-4">
        <button onClick={() => go("home")} className="flex flex-col items-start shrink-0">
          <span style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.terracotta, lineHeight: 1 }}>Mitti-Desh</span>
          <span style={{ fontFamily: "Manrope", fontSize: "10px", letterSpacing: "0.14em", color: C.charcoal, opacity: 0.55 }}>ROOTED IN TRADITION</span>
        </button>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <button key={l} onClick={() => go(l === "Shop" ? "listing" : l === "Artisans" || l === "About" || l === "Contact" ? "home" : "home")}
              className="text-sm transition hover:opacity-100" style={{ fontFamily: "Manrope", color: C.charcoal, opacity: 0.75 }}>
              {l}
            </button>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 max-w-xs rounded-full px-4 py-2 gap-2" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
          <Search size={15} style={{ color: C.charcoal, opacity: 0.5 }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Kullhads, Diyas, Pots..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ fontFamily: "Inter", color: C.charcoal }}
          />
        </form>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setDark((d) => !d)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5" title="Toggle dark mode">
            {dark ? <Sun size={16} style={{ color: C.charcoal }} /> : <Moon size={16} style={{ color: C.charcoal }} />}
          </button>
          <button onClick={() => go("compare")} className="relative hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-black/5" title="Compare">
            <GitCompare size={16} style={{ color: C.charcoal }} />
            {compare.length > 0 && <span className="absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: C.terracotta }}>{compare.length}</span>}
          </button>
          <button onClick={() => (user ? go("dashboard") : setAuthOpen(true))} className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center hover:bg-black/5" title="Account">
            <User size={17} style={{ color: C.charcoal }} />
          </button>
          <button onClick={() => go("wishlist")} className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5" title="Wishlist">
            <Heart size={17} style={{ color: C.charcoal }} />
            {wishlist.size > 0 && <span className="absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: C.terracotta }}>{wishlist.size}</span>}
          </button>
          <button onClick={() => setCartOpen(true)} className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5" title="Cart">
            <ShoppingBag size={17} style={{ color: C.charcoal }} />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 text-[9px] w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: C.terracotta }}>{cartCount}</span>}
          </button>
          <button className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={18} style={{ color: C.charcoal }} /> : <Menu size={18} style={{ color: C.charcoal }} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden px-5 pb-4 flex flex-col gap-3">
          <form onSubmit={submitSearch} className="flex items-center rounded-full px-4 py-2 gap-2" style={{ backgroundColor: C.card, border: `1px solid ${C.line}` }}>
            <Search size={14} style={{ color: C.charcoal, opacity: 0.5 }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-sm w-full" style={{ color: C.charcoal }} />
          </form>
          {links.map((l) => (
            <button key={l} onClick={() => { go(l === "Shop" ? "listing" : "home"); setMobileOpen(false); }}
              className="text-left text-sm py-1" style={{ fontFamily: "Manrope", color: C.charcoal }}>{l}</button>
          ))}
          <button onClick={() => { user ? go("dashboard") : setAuthOpen(true); setMobileOpen(false); }} className="text-left text-sm py-1" style={{ fontFamily: "Manrope", color: C.terracotta }}>
            {user ? "My Account" : "Sign In"}
          </button>
        </div>
      )}
    </header>
  );
}
