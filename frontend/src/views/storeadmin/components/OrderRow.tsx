import { Order } from "@/types/order";
import { cn } from "@/lib/utils";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActionsMenu from "./OrderActionMenu";

interface OrderRowProps {
  order: Order;
  index: number;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function OrderRow({
  order,
  index,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}: OrderRowProps) {
  const customerName =
    `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() ||
    order.user.email;

  return (
    <tr
      className={cn(
        "border-t border-slate-200",
        index % 2 === 1 && "bg-slate-50"
      )}
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-800">{order.orderNumber}</p>
          <p className="text-xs text-slate-400">
            {order.orderItems.length} item
            {order.orderItems.length > 1 ? "s" : ""}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-slate-700">{customerName}</p>
          <p className="text-xs text-slate-400 max-w-[200px] truncate">
            {order.userAddress.address}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 font-semibold text-slate-800">
        {formatCurrency(Number(order.totalAmount))}
      </td>
      <td className="px-6 py-4">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="px-6 py-4 text-slate-600">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 text-right">
        <OrderActionsMenu
          orderId={order.id}
          orderStatus={order.status}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={onApprove}
          onReject={onReject}
        />
      </td>
    </tr>
  );
}
