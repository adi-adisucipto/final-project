import { OrderStatus } from "@/types/order";
import { Eye } from "lucide-react";

interface OrderActionsMenuProps {
  orderId: string;
  orderStatus: OrderStatus;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetail?: (orderId: string) => void;
  isMobile?: boolean;
}

export default function OrderActionsMenu({
  orderId,
  orderStatus,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  onUpdateStatus,
  onViewDetail,
  isMobile = false,
}: OrderActionsMenuProps) {
  const isProcessing = isApproving || isRejecting;

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const ViewDetailButton = () => {
    if (!onViewDetail) return null;

    if (isMobile) {
      return (
        <button
          onClick={() => onViewDetail(orderId)}
          className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Lihat Detail
        </button>
      );
    }

    return (
      <button
        onClick={() => onViewDetail(orderId)}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Detail
      </button>
    );
  };

  if (orderStatus === "WAITING_CONFIRMATION") {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(orderId)}
              disabled={isProcessing}
              className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isApproving ? (
                <>
                  <LoadingSpinner />
                  <span>Memproses...</span>
                </>
              ) : (
                "Konfirmasi"
              )}
            </button>

            <button
              onClick={() => onReject(orderId)}
              disabled={isProcessing}
              className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isRejecting ? (
                <>
                  <LoadingSpinner />
                  <span>Memproses...</span>
                </>
              ) : (
                "Tolak"
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-2 justify-end">
        <ViewDetailButton />
        
        <button
          onClick={() => onApprove(orderId)}
          disabled={isProcessing}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApproving ? "Memproses..." : "Konfirmasi"}
        </button>

        <button
          onClick={() => onReject(orderId)}
          disabled={isProcessing}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRejecting ? "Memproses..." : "Tolak"}
        </button>
      </div>
    );
  }

  if (orderStatus === "CONFIRMED" && onUpdateStatus) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          <button
            onClick={() => onUpdateStatus(orderId, "PRESCRIBED")}
            disabled={isProcessing}
            className="w-full rounded-lg bg-purple-500 py-2.5 text-sm font-medium text-white hover:bg-purple-600 active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tandai Diresepkan
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 justify-end">
        <ViewDetailButton />
        <button
          onClick={() => onUpdateStatus(orderId, "PRESCRIBED")}
          disabled={isProcessing}
          className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Tandai Diresepkan
        </button>
      </div>
    );
  }

  if (orderStatus === "PRESCRIBED" && onUpdateStatus) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          <button
            onClick={() => onUpdateStatus(orderId, "SHIPPED")}
            disabled={isProcessing}
            className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tandai Dikirim
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 justify-end">
        <ViewDetailButton />
        <button
          onClick={() => onUpdateStatus(orderId, "SHIPPED")}
          disabled={isProcessing}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Tandai Dikirim
        </button>
      </div>
    );
  }

  if (orderStatus === "SHIPPED" && onUpdateStatus) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          <button
            onClick={() => onUpdateStatus(orderId, "DELIVERED")}
            disabled={isProcessing}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tandai Terkirim
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 justify-end">
        <ViewDetailButton />
        <button
          onClick={() => onUpdateStatus(orderId, "DELIVERED")}
          disabled={isProcessing}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Tandai Terkirim
        </button>
      </div>
    );
  }

  if (orderStatus === "DELIVERED" || orderStatus === "CANCELLED") {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          <p className="text-xs text-center text-slate-400 py-2">
            Pesanan sudah selesai
          </p>
        </div>
      );
    }

    return <ViewDetailButton />;
  }

  if (orderStatus === "WAITING_PAYMENT") {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <ViewDetailButton />
          <p className="text-xs text-center text-slate-400 py-2">
            Menunggu pembayaran pelanggan
          </p>
        </div>
      );
    }

    return <ViewDetailButton />;
  }

  return <ViewDetailButton />;
}