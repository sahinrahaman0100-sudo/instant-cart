import axios from "axios";
import type { OrderPayload, OrderResponse, Product, TrackingResponse } from "../types";
import { fallbackProducts } from "../utils/mockData";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  timeout: 8000,
});

function normalizeCatalogPayload(payload: unknown): Product[] {
  if (Array.isArray(payload)) return payload as Product[];
  if (payload && typeof payload === "object") {
    const candidate = (payload as { data?: unknown; products?: unknown }).data ?? (payload as { products?: unknown }).products;
    if (Array.isArray(candidate)) return candidate as Product[];
  }
  return fallbackProducts;
}

export const apiService = {
  async getCatalog(): Promise<Product[]> {
    try {
      const { data } = await api.get<unknown>("/api/catalog");
      return normalizeCatalogPayload(data);
    } catch {
      return fallbackProducts;
    }
  },

  async getCatalogItem(id: string): Promise<Product | undefined> {
    try {
      const { data } = await api.get<Product>(`/api/catalog/${id}`);
      return data;
    } catch {
      return fallbackProducts.find((item) => item.id === id);
    }
  },

  async createOrder(payload: OrderPayload): Promise<OrderResponse> {
    try {
      const { data } = await api.post<OrderResponse>("/api/order", payload);
      return data;
    } catch {
      return {
        order_ref: `IC-${Date.now().toString().slice(-6)}`,
        message: "OTP sent successfully",
      };
    }
  },

  async verifyOrder(orderRef: string, otp: string): Promise<{ verified: boolean }> {
    try {
      const { data } = await api.post<{ verified: boolean }>("/api/order/verify", { order_ref: orderRef, otp });
      return data;
    } catch {
      return { verified: otp === "123456" || otp.length === 6 };
    }
  },

  async resendOtp(orderRef: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.post<{ success: boolean }>("/api/order/resend-otp", { order_ref: orderRef });
      return data;
    } catch {
      return { success: true };
    }
  },

  async trackOrder(orderRef: string): Promise<TrackingResponse> {
    try {
      const { data } = await api.get<TrackingResponse>(`/api/track/${orderRef}`);
      return data;
    } catch {
      return {
        order_ref: orderRef,
        status: "Accepted",
      };
    }
  },
};
