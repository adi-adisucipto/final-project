import { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const base = "px-3 py-1 text-xs font-semibold rounded-full inline-block whitespace-nowrap";

  const statusConfig: Record<
    OrderStatus,
    { bg: string; text: string; label: string }
  > = {
    WAITING_PAYMENT: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: "Menunggu Pembayaran",
    },
    WAITING_CONFIRMATION: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Menunggu Konfirmasi",
    },
    CONFIRMED: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Dikonfirmasi",
    },
    CANCELLED: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Dibatalkan",
    },
    PRESCRIBED: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "Dikemas",
    },
    SHIPPED: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      label: "Dikirim",
    },
    DELIVERED: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Terkirim",
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: status,
  };

  return (
    <span className={`${base} ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}