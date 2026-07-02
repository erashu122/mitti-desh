import { useEffect } from "react";
import { Check, LayoutDashboard } from "lucide-react";
import { AppProvider, useApp } from "./context/AppContext";
import { C } from "./lib/theme";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import QuickView from "./components/QuickView";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Detail from "./pages/Detail";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function AppShell() {
  const { view, toast, go } = useApp();

  useEffect(() => {
    if (view.name === "home" && view.params?.scrollTo) {
      setTimeout(() => document.getElementById(view.params.scrollTo)?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [view]);

  const pages = {
    home: <Home />,
    listing: <Listing />,
    detail: <Detail />,
    wishlist: <Wishlist />,
    compare: <Compare />,
    checkout: <Checkout />,
    dashboard: <Dashboard />,
    admin: <Admin />,
  };

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "100%", fontFamily: "Inter" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700&display=swap');
      `}</style>

      <Nav />
      {pages[view.name] || <Home />}
      {view.name !== "checkout" && <Footer />}

      <CartDrawer />
      <QuickView />
      <AuthModal />

      {/* hidden dev shortcut to admin dashboard */}
      <button onClick={() => go("admin")} className="fixed bottom-5 left-5 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-70 hover:opacity-100 transition"
        style={{ backgroundColor: C.charcoal }} title="Admin Dashboard (demo)">
        <LayoutDashboard size={15} color={C.bg} />
      </button>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-full text-white text-sm flex items-center gap-2 shadow-lg animate-fadeUp" style={{ backgroundColor: C.success, fontFamily: "Manrope", fontWeight: 600 }}>
          <Check size={15} /> {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
