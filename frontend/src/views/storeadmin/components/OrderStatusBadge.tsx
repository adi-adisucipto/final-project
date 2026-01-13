import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  WAITING_PAYMENT: {
    label: "Waiting Payment",
    className: "bg-yellow-100 text-yellow-700",
  },
  WAITING_CONFIRMATION: {
    label: "Waiting Confirmation",
    className: "bg-blue-100 text-blue-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-green-100 text-green-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
  PRESCRIBED: {
    label: "Prescribed",
    className: "bg-purple-100 text-purple-700",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-100 text-indigo-700",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700",
  },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusInfo = STATUS_MAP[status] || {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        statusInfo.className
      )}
    >
      {statusInfo.label}
    </span>
  );
}