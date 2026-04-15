import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui";
import { useI18n } from "../hooks/useI18n";
import { apiService } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import type { CheckoutForm, DeliveryType } from "../types";
import { DELIVERY_FEE } from "../utils/mockData";

const initialForm: CheckoutForm = { name: "", email: "", phone: "", address: "", notes: "" };

export default function CheckoutPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { items, totalPrice } = useCartStore();
  const users = useAuthStore((state) => state.users);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const user = users.find((item) => item.id === currentUserId) ?? null;
  const addOrder = useOrderStore((state) => state.addOrder);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const subtotal = totalPrice();
  const deliveryCharge = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const grandTotal = subtotal + deliveryCharge;

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login or signup to place order.");
      navigate("/auth");
      return;
    }
    if (!items.length) return toast.error(t.emptyCart);
    if (!form.name || !form.email || !form.phone) return toast.error("Please complete required fields.");
    if (deliveryType === "delivery" && !form.address.trim()) {
      return toast.error("Please enter delivery address.");
    }
    setLoading(true);
    try {
      const response = await apiService.createOrder({
        items,
        customer: form,
        deliveryType,
        amount: grandTotal,
      });
      addOrder({
        orderRef: response.order_ref,
        userId: user.id,
        items,
        amount: grandTotal,
        deliveryType,
        status: "Verified",
        createdAt: new Date().toISOString(),
      });
      toast.success(response.message);
      navigate(`/verify/${response.order_ref}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <GlassCard className="space-y-3 p-5">
        <h2 className="text-xl font-semibold">{t.checkout}</h2>
        <div className="flex gap-2">
          <button className={`rounded-lg px-3 py-2 ${deliveryType === "delivery" ? "bg-[#7C6FE9]" : "bg-white/10"}`} onClick={() => setDeliveryType("delivery")} type="button">
            {t.delivery} (₹40)
          </button>
          <button className={`rounded-lg px-3 py-2 ${deliveryType === "pickup" ? "bg-[#7C6FE9]" : "bg-white/10"}`} onClick={() => setDeliveryType("pickup")} type="button">
            {t.pickup} ({t.free})
          </button>
        </div>
        {["name", "email", "phone"].map((field) => (
          <input key={field} className="w-full rounded-lg border border-white/20 bg-white/10 p-2 outline-none focus:border-[#7C6FE9]" placeholder={field[0].toUpperCase() + field.slice(1)} value={form[field as keyof CheckoutForm]} onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} />
        ))}
        <textarea
          className="w-full rounded-lg border border-white/20 bg-white/10 p-2 outline-none focus:border-[#7C6FE9]"
          placeholder="Delivery Address"
          value={form.address}
          onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
        />
        <textarea className="w-full rounded-lg border border-white/20 bg-white/10 p-2 outline-none focus:border-[#7C6FE9]" placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
        <button className="w-full rounded-lg bg-[#34D399] px-4 py-3 font-semibold text-slate-900 disabled:opacity-70" disabled={loading} onClick={placeOrder} type="button">
          {loading ? "Placing..." : t.placeOrder}
        </button>
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="border-white/10" />
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>{deliveryType === "delivery" ? `₹${DELIVERY_FEE}` : t.free}</span></div>
        <div className="flex justify-between font-semibold text-[#34D399]"><span>Total</span><span>₹{grandTotal}</span></div>
      </GlassCard>
    </div>
  );
}
