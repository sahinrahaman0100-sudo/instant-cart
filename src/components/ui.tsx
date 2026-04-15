import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return <div className={clsx("rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg", className)} {...props} />;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black/30 px-3 py-1">
      <button className="text-lg text-white hover:text-[#34D399]" onClick={onDecrement} type="button">
        -
      </button>
      <span className="min-w-5 text-center text-sm">{quantity}</span>
      <button className="text-lg text-white hover:text-[#34D399]" onClick={onIncrement} type="button">
        +
      </button>
    </div>
  );
}

export function PageLoader() {
  return <div className="p-10 text-center text-slate-300">Loading Instant Cart...</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">{message}</div>;
}

export function SkeletonCard() {
  return <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5" />;
}

export function FloatingCart({ count }: { count: number }) {
  return (
    <Link to="/checkout" className="fixed bottom-5 right-5 z-20 rounded-full bg-[#7C6FE9] px-5 py-3 text-sm font-semibold shadow-lg hover:brightness-110">
      Cart ({count})
    </Link>
  );
}
