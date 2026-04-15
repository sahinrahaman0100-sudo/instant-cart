import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, Product } from "../types";
import { safeStorage } from "../utils/storage";

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }
          return {
            items: [...state.items, { id: product.id, name: product.name, price: product.price, quantity: 1 }],
          };
        }),
      removeFromCart: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity < 1 ? state.items.filter((item) => item.id !== id) : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "instant-cart-storage",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
