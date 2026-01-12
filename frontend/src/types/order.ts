export type OrderStatus =
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELLED"
  | "PRESCRIBED"
  | "SHIPPED"
  | "DELIVERED";

export interface Order {
  id: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  shippingDiscount: number;
  totalAmount: number;
  estimatedDelivery: string | null;
  voucherCodeUsed: string | null;
  status: OrderStatus;
  paymentProof: string | null;
  paymentConfirmedAt: string | null;
  shippedAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  userAddress: {
    address: string;
    city: number;
    province: number;
    postal_code: string | null;
  };
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  discountAmount: number;
  subtotal: number;
  product: {
    name: string;
    price: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  todayOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}