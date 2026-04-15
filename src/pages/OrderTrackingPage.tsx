import confetti from "canvas-confetti";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { GlassCard, PageLoader } from "../components/ui";
import { useI18n } from "../hooks/useI18n";
import { apiService } from "../services/api";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import type { OrderStatus, TrackingResponse } from "../types";

const statusFlow: OrderStatus[] = ["Verified", "Accepted", "Paid", "Shipped", "Delivered"];

export default function OrderTrackingPage() {
  const { orderRef = "" } = useParams();
  const { t } = useI18n();
  const clearCart = useCartStore((state) => state.clearCart);
  const getOrderByRef = useOrderStore((state) => state.getOrderByRef);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const localOrder = getOrderByRef(orderRef);
  const [tracking, setTracking] = useState<TrackingResponse | undefined>(() =>
    localOrder
      ? {
          order_ref: localOrder.orderRef,
          status: localOrder.status,
          shippingDetails: "Rider Rahul (DLV-45) is assigned.",
        }
      : undefined,
  );

  useEffect(() => {
    apiService.trackOrder(orderRef).then((data) =>
      setTracking((prev) => ({
        order_ref: data.order_ref,
        status: statusFlow[Math.max(statusFlow.indexOf(prev?.status ?? "Verified"), statusFlow.indexOf(data.status))],
        shippingDetails: data.shippingDetails ?? "Rider Rahul (DLV-45) is assigned.",
      })),
    );
  }, [orderRef]);

  const activeIndex = useMemo(() => statusFlow.indexOf(tracking?.status ?? "Verified"), [tracking?.status]);

  const payNow = () => {
    setTracking((prev) => {
      if (!prev) return prev;
      updateOrderStatus(orderRef, "Paid");
      return { ...prev, status: "Paid" };
    });
    confetti({ particleCount: 130, spread: 75, origin: { y: 0.65 } });
    clearCart();
    toast.success(t.paymentSuccess);
  };

  if (!tracking) return <PageLoader />;

  return (
    <GlassCard className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-xl font-semibold">{t.trackOrder}</h2>
      <p className="text-sm text-slate-300">Ref: {tracking.order_ref}</p>
      <div className="space-y-3">
        {statusFlow.map((status, idx) => (
          <div key={status} className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${idx <= activeIndex ? "bg-[#34D399]" : "bg-white/20"}`} />
            <p className={idx <= activeIndex ? "text-white" : "text-slate-400"}>{status}</p>
          </div>
        ))}
      </div>
      {tracking.status === "Accepted" && (
        <button className="rounded-lg bg-[#7C6FE9] px-4 py-2 font-semibold" onClick={payNow} type="button">
          Pay Now
        </button>
      )}
      {(tracking.status === "Shipped" || tracking.status === "Delivered") && (
        <div className="rounded-lg border border-[#34D399]/30 bg-[#34D399]/10 p-3 text-sm text-[#86efac]">
          {tracking.shippingDetails}
        </div>
      )}
    </GlassCard>
  );
}
