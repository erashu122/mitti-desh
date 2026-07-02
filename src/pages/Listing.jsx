import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Grid2x2, List, SlidersHorizontal, X } from "lucide-react";
import { C } from "../lib/theme";
import { PRODUCTS, CATEGORIES } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

const PAGE_SIZE = 8;

export default function Listing() {
  const { view } = useApp();
  const params = view.params || {};
  const [cat, setCat] = useState(params.cat || "All");
  const [search, setSearch] = useState(params.q || "");
  const [sort, setSort] = useState("Popularity");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCat(params.cat || "All");
    setSearch(params.q || "");
    setPage(1);
  }, [params.cat, params.q]);

  const cats = ["All", ...CATEGORIES.map((c) => c.name)];

  const items = useMemo(() => {
    let out = PRODUCTS.filter((p) =>
      (cat === "All" || p.cat === cat) &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      p.price <= maxPrice &&
      p.rating >= minRating &&
      (!inStockOnly || p.stock > 0)
    );
    if (sort === "Price: Low to High") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "Rating") out = [...out].sort((a, b) => b.rating - a.rating);
    if (sort === "Newest") out = [...out].sort((a, b) => b.id - a.id);
    return out;
  }, [cat, sort, search, maxPrice, minRating, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearFilters = () => { setCat("All"); setSearch(""); setMaxPrice(1200); setMinRating(0); setInStockOnly(false); setPage(1); };

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <div className="text-xs uppercase mb-3" style={{ fontFamily: "Manrope", letterSpacing: "0.08em", color: C.charcoal, opacity: 0.5 }}>Category</div>
        <div className="space-y-1.5">
          {cats.map((c) => (
            <button key={c} onClick={() => { setCat(c); setPage(1); }} className="block w-full text-left text-sm py-1"
              style={{ fontFamily: "Inter", color: cat === c ? C.terracotta : C.charcoal, fontWeight: cat === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs uppercase mb-3" style={{ fontFamily: "Manrope", letterSpacing: "0.08em", color: C.charcoal, opacity: 0.5 }}>Max Price: ₹{maxPrice}</div>
        <input type="range" min="99" max="1200" step="50" value={maxPrice} onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }} className="w-full accent-current" style={{ color: C.terracotta }} />
      </div>
      <div>
        <div className="text-xs uppercase mb-3" style={{ fontFamily: "Manrope", letterSpacing: "0.08em", color: C.charcoal, opacity: 0.5 }}>Minimum Rating</div>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button key={r} onClick={() => { setMinRating(r); setPage(1); }} className="px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: minRating === r ? C.terracotta : C.card, color: minRating === r ? "#fff" : C.charcoal, border: `1px solid ${minRating === r ? C.terracotta : C.line}`, fontFamily: "Manrope", fontWeight: 600 }}>
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ fontFamily: "Inter", color: C.charcoal }}>
        <input type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }} />
        In stock only
      </label>
      <button onClick={clearFilters} className="text-xs" style={{ fontFamily: "Manrope", color: C.terracotta, fontWeight: 600 }}>Clear all filters</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs uppercase" style={{ fontFamily: "Manrope", letterSpacing: "0.1em", color: C.terracotta, fontWeight: 600 }}>Shop All</span>
        <h1 className="mt-2" style={{ fontFamily: "Playfair Display", fontSize: "2.2rem", color: C.charcoal }}>The Full Collection</h1>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden md:block">{FilterPanel}</aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
            <button onClick={() => setFiltersOpen(true)} className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full text-xs" style={{ border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}>
              <SlidersHorizontal size={13} /> Filters
            </button>
            <span className="text-xs" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.55 }}>{items.length} pieces</span>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setLayout("grid")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: layout === "grid" ? C.terracotta : C.card, border: `1px solid ${C.line}` }}>
                <Grid2x2 size={13} color={layout === "grid" ? "#fff" : C.charcoal} />
              </button>
              <button onClick={() => setLayout("list")} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: layout === "list" ? C.terracotta : C.card, border: `1px solid ${C.line}` }}>
                <List size={13} color={layout === "list" ? "#fff" : C.charcoal} />
              </button>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-4 pr-9 py-2 rounded-full text-xs outline-none"
                  style={{ fontFamily: "Manrope", fontWeight: 600, backgroundColor: C.card, border: `1px solid ${C.line}`, color: C.charcoal }}>
                  {["Popularity", "Newest", "Price: Low to High", "Price: High to Low", "Rating"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.charcoal }} />
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>
              No pieces match your filters. <button onClick={clearFilters} className="underline" style={{ color: C.terracotta }}>Clear filters</button>
            </div>
          ) : (
            <>
              <div className={layout === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-5" : "flex flex-col gap-4"}>
                {paged.map((p) => <ProductCard key={p.id} p={p} list={layout === "list"} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className="w-9 h-9 rounded-full text-xs"
                      style={{ backgroundColor: page === i + 1 ? C.terracotta : C.card, color: page === i + 1 ? "#fff" : C.charcoal, border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600 }}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={() => setFiltersOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-xs p-6 overflow-y-auto" style={{ backgroundColor: C.bg }}>
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: "Playfair Display", color: C.charcoal, fontSize: "1.1rem" }}>Filters</span>
              <button onClick={() => setFiltersOpen(false)}><X size={18} style={{ color: C.charcoal }} /></button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
