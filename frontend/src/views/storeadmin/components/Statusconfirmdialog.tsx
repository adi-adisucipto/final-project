import { OrderStatus } from "@/types/order";

interface StatusConfirmDialogProps {
  isOpen: boolean;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  orderNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const statusLabels: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "Menunggu Pembayaran",
  WAITING_CONFIRMATION: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  CANCELLED: "Dibatalkan",
  PRESCRIBED: "Dikemas",
  SHIPPED: "Dikirim",
  DELIVERED: "Terkirim",
};

export default function StatusConfirmDialog({
  isOpen,
  currentStatus,
  nextStatus,
  orderNumber,
  onConfirm,
  onCancel,
}: StatusConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{[nextStatus]}</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Konfirmasi Perubahan Status
          </h3>
          <p className="text-sm text-slate-500">
            Pesanan <span className="font-semibold text-slate-700">{orderNumber}</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="text-center">
              <div className="text-2xl mb-1">{[currentStatus]}</div>
              <p className="text-xs font-medium text-slate-600">
                {statusLabels[currentStatus]}
              </p>
            </div>

            <div className="text-slate-400">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>

            <div className="text-center">
              <div className="text-2xl mb-1">{[nextStatus]}</div>
              <p className="text-xs font-medium text-emerald-600">
                {statusLabels[nextStatus]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:bg-emerald-700 transition-colors shadow-sm"
          >
            Ya, Ubah Status
          </button>
        </div>
      </div>
    </div>
  );
}