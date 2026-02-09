import { OrderDetail } from "@/types/checkout";
import Image from "next/image";
import { X } from "lucide-react";
import { useOrderStatus } from "@/hooks/useOrderStatus";

interface OrderDetailModalProps {
  order: OrderDetail;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { text, color, alert, trackSteps } = useOrderStatus(order.status);
  const firstItem = order.items[0];
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full z-20"
        >
          <X size={20} />
        </button>

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
          <div className="flex justify-between mb-6">
            <p className="text-sm text-gray-500">Order ID : {order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-500">{orderDate}</p>
          </div>

          {firstItem && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden border">
                <Image
                  src={firstItem.product?.images[0]?.imageUrl || "/placeholder-product.png"}
                  alt={firstItem.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{firstItem.product?.name}</h3>
                <p className="text-sm text-gray-500">{firstItem.quantity} Qty</p>
              </div>
            </div>
          )}

          {alert && (
            <div className={`border rounded-lg p-4 mb-6 ${alert.wrapperClass}`}>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${alert.badgeClass}`}>
                  {alert.label}
                </span>
                <span className="text-sm text-gray-700">{alert.message}</span>
              </div>
            </div>
          )}

          <div className="bg-gray-100 rounded-lg p-6 mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold">Status :</h3>
            <span className={`px-4 py-2 rounded-lg text-white font-semibold ${color}`}>
              {text}
            </span>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-6">Track History</h3>

            <div className="relative">
              <div className="flex justify-between">
                {trackSteps.map((step) => (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                        step.completed
                          ? "bg-green-500 border-green-500"
                          : "bg-gray-300 border-gray-300"
                      }`}
                    >
                      {step.completed && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <p className={`mt-2 text-sm ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}