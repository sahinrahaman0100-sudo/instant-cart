import { useMemo } from "react";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/ui";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";

export default function ProfilePage() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const users = useAuthStore((state) => state.users);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const orders = useOrderStore((state) => state.orders);
  const user = users.find((item) => item.id === currentUserId) ?? null;
  const userOrders = useMemo(
    () => (user ? orders.filter((order) => order.userId === user.id) : []),
    [orders, user],
  );

  if (!hasHydrated && !currentUserId) {
    return (
      <GlassCard className="mx-auto max-w-xl space-y-3 p-6">
        <h2 className="text-xl font-semibold">Loading profile...</h2>
      </GlassCard>
    );
  }

  if (!user) {
    return (
      <GlassCard className="mx-auto max-w-xl space-y-3 p-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-slate-300">Please login to view your profile and orders.</p>
        <Link to="/auth" className="inline-block rounded-lg bg-[#7C6FE9] px-4 py-2 font-medium">
          Go to Login
        </Link>
      </GlassCard>
    );
  }

  const currentOrders = userOrders.filter((order) => order.status !== "Delivered");
  const previousOrders = userOrders.filter((order) => order.status === "Delivered");

  return (
    <div className="space-y-6">
      <GlassCard className="space-y-2 p-5">
        <h2 className="text-xl font-semibold">My Profile</h2>
        <p className="text-sm text-slate-300">Name: {user.name}</p>
        <p className="text-sm text-slate-300">Email: {user.email}</p>
        <p className="text-sm text-slate-300">Mobile: {user.mobile}</p>
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <h3 className="text-lg font-semibold">Current Orders</h3>
        {currentOrders.length === 0 ? (
          <p className="text-sm text-slate-400">No active orders.</p>
        ) : (
          currentOrders.map((order) => (
            <div key={order.orderRef} className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{order.orderRef}</p>
                <p className="text-sm text-[#34D399]">{order.status}</p>
              </div>
              <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm">Amount: ₹{order.amount}</p>
              <Link to={`/track/${order.orderRef}`} className="text-sm text-[#7C6FE9] underline">
                Track Order
              </Link>
            </div>
          ))
        )}
      </GlassCard>

      <GlassCard className="space-y-3 p-5">
        <h3 className="text-lg font-semibold">Previous Orders</h3>
        {previousOrders.length === 0 ? (
          <p className="text-sm text-slate-400">No previous orders yet.</p>
        ) : (
          previousOrders.map((order) => (
            <div key={order.orderRef} className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{order.orderRef}</p>
                <p className="text-sm text-[#34D399]">{order.status}</p>
              </div>
              <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-sm">Amount: ₹{order.amount}</p>
            </div>
          ))
        )}
      </GlassCard>
    </div>
  );
}
