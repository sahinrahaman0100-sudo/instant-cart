import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { GlassCard, PageLoader } from "../components/ui";
import { useI18n } from "../hooks/useI18n";
import { apiService } from "../services/api";
import type { Product } from "../types";
import { fallbackProducts } from "../utils/mockData";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiService.getCatalogItem(id).then(setProduct).finally(() => setLoading(false));
  }, [id]);

  const related = useMemo(
    () => fallbackProducts.filter((item) => item.category === product?.category && item.id !== product.id).slice(0, 4),
    [product],
  );

  if (loading) return <PageLoader />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <GlassCard className="space-y-3 p-5">
        <div className="text-6xl">{product.emoji}</div>
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p className="text-slate-300">{product.description}</p>
        <p className="font-bold text-[#34D399]">₹{product.price}</p>
        <Link to="/" className="text-sm text-[#7C6FE9] underline">
          Back to catalog
        </Link>
      </GlassCard>

      <div>
        <h3 className="mb-3 text-lg font-semibold">{t.related}</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
