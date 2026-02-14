import { Order } from "@/types/order";
import { X } from "lucide-react";
import Image from "next/image";

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderDetailModal({
  isOpen,
  order,
  onClose,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const customerName =
    `${order.user?.first_name || ""} ${order.user?.last_name || ""}`.trim() ||
    order.user?.email ||
    "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Detail Pesanan
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {order.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
          <section className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Informasi Pelanggan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama:</span>
                <span className="font-medium text-slate-900">
                  {customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900">
                  {order.user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Order:</span>
                <span className="font-medium text-slate-900">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Alamat Pengiriman
            </h3>
            <div className="text-sm text-slate-700">
              <p className="mb-1">{order.userAddress?.address}</p>
              {order.userAddress?.postal_code && (
                <p className="text-slate-500">
                  Kode Pos: {order.userAddress.postal_code}
                </p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Produk yang Dipesan
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">
                      Produk
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.orderItems?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.product?.name}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Diskon Produk:</span>
                  <span className="font-medium text-emerald-600">
                    -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Ongkos Kirim:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(order.shippingCost)}
                </span>
              </div>
              {order.shippingDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Diskon Ongkir:</span>
                  <span className="font-medium text-emerald-600">
                    -{formatCurrency(order.shippingDiscount)}
                  </span>
                </div>
              )}
              {order.voucherCodeUsed && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Kode Voucher:</span>
                  <span className="font-medium text-purple-600">
                    {order.voucherCodeUsed}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-300 flex justify-between">
                <span className="font-semibold text-slate-900">
                  Total Pembayaran:
                </span>
                <span className="font-bold text-lg text-emerald-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          {order.paymentProof && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Bukti Transfer
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4">
                <div className="relative w-full aspect-4/3 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={order.paymentProof}
                    alt="Bukti Transfer"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <a
                  href={order.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Buka di Tab Baru
                </a>
              </div>
            </section>
          )}

          {(order.estimatedDelivery ||
            order.confirmedAt ||
            order.shippedAt ||
            order.cancelledAt) && (
            <section className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Informasi Tambahan
              </h3>
              <div className="space-y-2 text-sm">
                {order.confirmedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Dikonfirmasi pada:
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatDate(order.confirmedAt)}
                    </span>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dikirim pada:</span>
                    <span className="font-medium text-slate-900">
                      {formatDate(order.shippedAt)}
                    </span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Estimasi Pengiriman:
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatDate(order.estimatedDelivery)}
                    </span>
                  </div>
                )}
                {order.cancelledAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dibatalkan pada:</span>
                    <span className="font-medium text-red-600">
                      {formatDate(order.cancelledAt)}
                    </span>
                  </div>
                )}
                {order.cancellationReason && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <span className="text-slate-600 block mb-1">
                      Alasan Pembatalan:
                    </span>
                    <p className="text-slate-900 font-medium">
                      {order.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-slate-600 py-2.5 text-sm font-medium text-white hover:bg-slate-700 active:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}