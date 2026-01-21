import { CartItem } from "./cart";

export type PaymentMethod = "TRANSFER" | "COD";

export interface CheckoutData {
  cartItems: CartItem[];
  subtotal: number;

  addressId: string | null;
  paymentMethod: PaymentMethod | null;
  voucherCode?: string;
  notes?: string;

  paymentProof?: File | null;

  shipping: number;
  discount: number;
  total: number;
}

export interface ShippingAddressData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface VoucherData {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  description: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  storeName: string;
}