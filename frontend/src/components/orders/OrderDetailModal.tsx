import { OrderDetail } from "@/types/checkout";
import Image from "next/image";
import { X, Download, Store, Package } from "lucide-react";
import { useOrderStatus } from "@/hooks/useOrderStatus";

interface OrderDetailModalProps {
  order: OrderDetail;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { text, color, alert, trackSteps } = useOrderStatus(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleDownloadProof = () => {
    if (order.paymentProof) {
      window.open(order.paymentProof, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto relative sm:rounded-2xl rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 p-2 rounded-full z-20"
        >
          <X size={20} />
        </button>

        <div className="bg-orange-400 rounded-t-xl px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 text-white">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-90">Total Payment</p>
            <p className="text-2xl font-bold mt-1">
              Rp{order.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>
        <div className="hidden sm:block absolute inset-y-4 left-1/2 w-px bg-white/30" />
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-90">Payment Method</p>
            <p className="text-lg font-semibold mt-1">
              {order.paymentMethod === "TRANSFER"? "Transfer Manual": "Cash on Delivery"}
            </p>
          </div>
        </div>
      </div>

        <div className="p-6">
          <div className="flex justify-between mb-6">
            <p className="text-sm text-gray-500">Order ID : {order.orderNumber}</p>
            <p className="text-sm text-gray-500">{orderDate}</p>
          </div>

          {order.store && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <Store className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{order.store.name}</span>
          </div>
        )}

          {order.items && order.items.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-700">
                  Produk yang Dibeli ({order.items.length} item)
                </h3>
              </div>
              
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden border shrink-0">
                      <Image
                        src={item.product?.images?.[0]?.imageUrl || "/placeholder-product.png"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.product?.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          {item.quantity} x Rp{item.price?.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          Rp{item.subtotal?.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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

          {order.paymentMethod === "TRANSFER" && order.paymentProof && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Bukti Transfer</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="relative w-32 h-32 bg-white rounded-lg overflow-hidden shrink-0 border-2 border-blue-300">
                  <Image
                    src={order.paymentProof}
                    alt="Payment Proof"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-3">
                    Bukti pembayaran telah diupload dan sedang dalam proses verifikasi.
                  </p>
                  <button
                    onClick={handleDownloadProof}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Lihat Bukti Transfer
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-6">Track History</h3>

            <div className="relative overflow-x-auto">
              <div className="flex justify-between overflow-x-auto pb-2">
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