import { Star } from "lucide-react";
import { C } from "../lib/theme";

export function Rating({ value, count }) {
  return (
    <div className="flex items-center gap-1 text-xs" style={{ color: C.charcoal, opacity: 0.75 }}>
      <Star size={13} fill={C.gold} stroke={C.gold} />
      <span style={{ fontFamily: "Manrope" }}>{value}</span>
      {count != null && <span>· {count} reviews</span>}
    </div>
  );
}

export function Badge({ children, tone = "terracotta" }) {
  const bg = tone === "terracotta" ? C.terracotta : tone === "success" ? C.success : tone === "danger" ? C.danger : C.gold;
  return (
    <span
      className="px-2 py-1 text-[10px] tracking-wide uppercase rounded-full"
      style={{ backgroundColor: bg + "1A", color: bg, fontFamily: "Manrope", fontWeight: 600 }}
    >
      {children}
    </span>
  );
}

export function StockBadge({ stock }) {
  if (stock === 0) return <Badge tone="danger">Out of stock</Badge>;
  if (stock <= 5) return <Badge tone="gold">Only {stock} left</Badge>;
  return <Badge tone="success">In stock</Badge>;
}
