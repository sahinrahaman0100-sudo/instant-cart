import { Link } from "react-router-dom";
import { useI18n } from "../hooks/useI18n";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types";
import { GlassCard, QuantityStepper } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const { items, addToCart, updateQuantity } = useCartStore();
  const inCart = items.find((item) => item.id === product.id);

  return (
    <GlassCard className="flex h-full flex-col gap-3 p-4 transition hover:border-[#7C6FE9]/70">
      <Link to={`/product/${product.id}`} className="space-y-2">
        <div className="text-5xl">{product.emoji}</div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-slate-300">{product.description}</p>
      </Link>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold text-[#34D399]">₹{product.price}</span>
        {inCart ? (
          <QuantityStepper
            quantity={inCart.quantity}
            onIncrement={() => updateQuantity(product.id, inCart.quantity + 1)}
            onDecrement={() => updateQuantity(product.id, inCart.quantity - 1)}
          />
        ) : (
          <button className="rounded-lg bg-[#7C6FE9] px-3 py-2 text-sm font-medium hover:brightness-110" onClick={() => addToCart(product)} type="button">
            {t.add}
          </button>
        )}
      </div>
    </GlassCard>
  );
}
