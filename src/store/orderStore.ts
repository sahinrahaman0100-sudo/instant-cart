import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, DeliveryType, OrderStatus } from "../types";
import { safeStorage } from "../utils/storage";

export interface UserOrder {
  orderRef: string;
  userId: string;
  items: CartItem[];
  amount: number;
  deliveryType: DeliveryType;
  status: OrderStatus;
  createdAt: string;
}

interface OrderStore {
  orders: UserOrder[];
  addOrder: (order: UserOrder) => void;
  updateOrderStatus: (orderRef: string, status: OrderStatus) => void;
  getOrderByRef: (orderRef: string) => UserOrder | undefined;
  getOrdersByUser: (userId: string) => UserOrder[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderRef, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.orderRef === orderRef ? { ...order, status } : order)),
        })),
      getOrderByRef: (orderRef) => get().orders.find((order) => order.orderRef === orderRef),
      getOrdersByUser: (userId) => get().orders.filter((order) => order.userId === userId),
    }),
    {
      name: "instant-cart-orders",
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
