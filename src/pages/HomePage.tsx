import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, FloatingCart, SkeletonCard } from "../components/ui";
import { useI18n } from "../hooks/useI18n";
import { apiService } from "../services/api";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types";
import { categories } from "../utils/mockData";

export default function HomePage() {
  const { t } = useI18n();
  const totalItems = useCartStore((state) => state.totalItems());
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiService
      .getCatalog()
      .then(setProducts)
      .catch(() => setError("Unable to load catalog right now."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      (Array.isArray(products) ? products : []).filter((item) => {
        const categoryMatch = activeCategory === "All" || item.category === activeCategory;
        const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, products, search],
  );

  return (
    <section className="space-y-5">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} className="w-full rounded-xl border border-white/20 bg-white/10 p-3 outline-none placeholder:text-slate-400 focus:border-[#7C6FE9]" />
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-3 py-1 text-sm ${activeCategory === category ? "bg-[#7C6FE9]" : "border border-white/20 bg-white/5"}`} type="button">
            {category}
          </button>
        ))}
      </div>
      {error && <ErrorState message={error} />}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
        {loading ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />) : filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {totalItems > 0 && <FloatingCart count={totalItems} />}
    </section>
  );
}
