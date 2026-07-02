import { Heart } from "lucide-react";
import { C } from "../lib/theme";
import { PRODUCTS } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

export default function Wishlist() {
  const { wishlist, go } = useApp();
  const items = PRODUCTS.filter((p) => wishlist.has(p.id));

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <h1 className="mb-8" style={{ fontFamily: "Playfair Display", fontSize: "2rem", color: C.charcoal }}>Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={40} style={{ color: C.line }} className="mx-auto mb-4" />
          <p className="text-sm mb-6" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>Nothing saved yet — tap the heart on any piece to add it here.</p>
          <button onClick={() => go("listing")} className="px-6 py-2.5 rounded-full text-white text-sm" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>Browse Collection</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
