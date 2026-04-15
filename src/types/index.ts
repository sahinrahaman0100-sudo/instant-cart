export type Category =
  | "Grocery"
  | "Dairy"
  | "Snacks"
  | "Beverages"
  | "Household"
  | "Electronics"
  | "Male Fashion"
  | "Female Fashion";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  emoji: string;
  description: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type DeliveryType = "delivery" | "pickup";

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export interface OrderPayload {
  items: CartItem[];
  deliveryType: DeliveryType;
  customer: CheckoutForm;
  amount: number;
}

export interface OrderResponse {
  order_ref: string;
  message: string;
}

export type OrderStatus = "Verified" | "Accepted" | "Paid" | "Shipped" | "Delivered";

export interface TrackingResponse {
  order_ref: string;
  status: OrderStatus;
  shippingDetails?: string;
}
