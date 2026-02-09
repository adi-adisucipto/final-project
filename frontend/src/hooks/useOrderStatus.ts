type OrderStatus =
  | "WAITING_PAYMENT"
  | "WAITING_CONFIRMATION"
  | "CONFIRMED"
  | "PRESCRIBED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusConfig {
  text: string;
  color: string;
  alert?: {
    label: string;
    message: string;
    wrapperClass: string;
    badgeClass: string;
  };
  trackIndex?: number;
}

const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  WAITING_PAYMENT: {
    text: "Waiting Payment",
    color: "bg-yellow-500",
    alert: {
      label: "Waiting Payment",
      message: "Please complete your payment to proceed.",
      wrapperClass: "bg-yellow-50 border-yellow-200",
      badgeClass: "bg-yellow-100 text-yellow-800",
    },
  },
  WAITING_CONFIRMATION: {
    text: "Waiting Confirmation",
    color: "bg-orange-500",
    alert: {
      label: "Ordered",
      message: "Your order has been placed and is waiting for confirmation.",
      wrapperClass: "bg-orange-50 border-orange-200",
      badgeClass: "bg-orange-100 text-orange-800",
    },
    trackIndex: 0,
  },
  CONFIRMED: {
    text: "Approved",
    color: "bg-green-500",
    alert: {
      label: "Approved",
      message: "Your order has been approved.",
      wrapperClass: "bg-green-50 border-green-200",
      badgeClass: "bg-green-100 text-green-800",
    },
    trackIndex: 1,
  },
  PRESCRIBED: {
    text: "Prescribed",
    color: "bg-green-500",
    alert: {
      label: "Prescribed",
      message: "Your order has been prescribed by the pharmacist.",
      wrapperClass: "bg-green-50 border-green-200",
      badgeClass: "bg-green-100 text-green-800",
    },
    trackIndex: 2,
  },
  SHIPPED: {
    text: "Shipped",
    color: "bg-blue-500",
    alert: {
      label: "Shipped",
      message: "Your order is on the way.",
      wrapperClass: "bg-blue-50 border-blue-200",
      badgeClass: "bg-blue-100 text-blue-800",
    },
    trackIndex: 3,
  },
  DELIVERED: {
    text: "Delivered",
    color: "bg-green-600",
    alert: {
      label: "Delivered",
      message: "Your order has been delivered successfully.",
      wrapperClass: "bg-emerald-50 border-emerald-200",
      badgeClass: "bg-emerald-100 text-emerald-800",
    },
    trackIndex: 4,
  },
  CANCELLED: {
    text: "Cancelled",
    color: "bg-red-500",
    alert: {
      label: "Cancelled",
      message: "This order has been cancelled.",
      wrapperClass: "bg-red-50 border-red-200",
      badgeClass: "bg-red-100 text-red-800",
    },
  },
};

const TRACK_STEPS = [
  { key: "WAITING_CONFIRMATION", label: "Ordered" },
  { key: "CONFIRMED", label: "Approved" },
  { key: "PRESCRIBED", label: "Prescribed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export function useOrderStatus(status: OrderStatus) {
  const config = ORDER_STATUS_MAP[status];

  const trackSteps = TRACK_STEPS.map((step, index) => ({
    ...step,
    completed:
      config.trackIndex !== undefined && index <= config.trackIndex,
  }));

  return {
    text: config.text,
    color: config.color,
    badgeClass:
      config.alert?.badgeClass ?? "bg-gray-100 text-gray-800",
    alert: config.alert,
    trackSteps,
    trackIndex: config.trackIndex,
  };
}