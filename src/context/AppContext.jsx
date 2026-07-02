import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { COUPONS } from "../lib/data";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [view, setView] = useState({ name: "home", params: {} });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [compare, setCompare] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([
    { id: 1, label: "Home", line: "12 Lotus Enclave, Sector 21", city: "Bengaluru", pin: "560102", isDefault: true },
  ]);
  const [dark, setDark] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const go = useCallback((name, params = {}) => {
    setView({ name, params });
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  const openProduct = (p) => go("detail", { id: p.id });

  const toggleWish = (id) => {
    setWishlist((w) => {
      const n = new Set(w);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleCompare = (p) => {
    setCompare((c) => {
      if (c.find((i) => i.id === p.id)) return c.filter((i) => i.id !== p.id);
      if (c.length >= 4) { notify("You can compare up to 4 items"); return c; }
      return [...c, p];
    });
  };

  const addToCart = (p, qty = 1) => {
    if (p.stock === 0) { notify("This piece is out of stock"); return; }
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i));
      return [...c, { ...p, qty: Math.min(qty, p.stock) }];
    });
    notify(`${p.name} added to cart`);
    setCartOpen(true);
  };

  const updateQty = (id, delta) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(i.qty + delta, i.stock)) } : i)));

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const applyCoupon = (code) => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      setCoupon({ code: key, pct: COUPONS[key] });
      notify(`Coupon ${key} applied — ${COUPONS[key] * 100}% off`);
      return true;
    }
    notify("Invalid coupon code");
    return false;
  };

  const login = (name, email) => {
    setUser({ name, email });
    setAuthOpen(false);
    notify(`Welcome, ${name.split(" ")[0]}!`);
  };
  const logout = () => { setUser(null); go("home"); notify("Signed out"); };

  const placeOrder = (address, payMethod) => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = coupon ? subtotal * coupon.pct : 0;
    const shipping = subtotal - discount >= 999 ? 0 : 79;
    const total = subtotal - discount + shipping;
    const order = {
      id: "MD" + Math.floor(100000 + Math.random() * 900000),
      items: cart,
      address,
      payMethod,
      subtotal, discount, shipping, total,
      date: new Date().toISOString(),
      status: "Confirmed",
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    setCoupon(null);
    return order;
  };

  const value = {
    view, go, openProduct,
    cart, addToCart, updateQty, removeFromCart,
    wishlist, toggleWish,
    compare, toggleCompare,
    cartOpen, setCartOpen,
    authOpen, setAuthOpen,
    quickView, setQuickView,
    user, login, logout,
    orders, placeOrder,
    addresses, setAddresses,
    dark, setDark,
    coupon, setCoupon, applyCoupon,
    toast, notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
