import { OrderDetail } from "@/types/checkout";
import Image from "next/image";
import { useOrderStatus } from "@/hooks/useOrderStatus";

interface OrderCardProps {
  order: OrderDetail;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const { text, badgeClass } = useOrderStatus(order.status);
  const firstItem = order.items[0];
  const totalItems = order.items.length;

  const orderDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="bg-orange-400 rounded-t-xl px-6 py-5">
        <div className="grid grid-cols-2 text-white">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-90">Total Payment</p>
            <p className="text-2xl font-bold mt-1">
              Rp{order.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>
        <div className="absolute inset-y-4 left-1/2 w-px bg-white/30" />
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-90">Payment Method</p>
            <p className="text-lg font-semibold mt-1">
              {order.paymentMethod === "TRANSFER"? "Cash on Delivery": "Transfer Manual"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-gray-500">
            Order ID : {order.id.slice(0, 8)}
          </p>
          <p className="text-xs text-gray-500">{orderDate}</p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {firstItem && (
            <>
              <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                  src={
                    firstItem.product?.images[0]?.imageUrl ||
                    "/placeholder-product.png"
                  }
                  alt={firstItem.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                  {firstItem.product?.name || "Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  {firstItem.quantity} Qty
                  {totalItems > 1 &&
                    ` • +${totalItems - 1} produk lainnya`}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${badgeClass}`}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}