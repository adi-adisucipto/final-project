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

export interface OrderItemPayload {
  productId: string;
  price: number;
  quantity: number;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateOrderPayload {
  userAddressId: string;
  storeId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  voucherCodeUsed?: string;
  paymentMethod: PaymentMethod;
}

export interface DiscountPreviewPayload {
  storeId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface DiscountPreviewResponse {
  subtotal: number;
  discountAmount: number;
}

export interface UploadPaymentProofPayload {
  paymentProofUrl: string;
}

export interface Order {
  id: string;
  storeId: string;
  userAddressId: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: "TRANSFER" | "COD";
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  items: OrderItemPayload[];
}
