import { useState } from "react";

interface RejectDialogProps {
  isOpen: boolean;
  orderNumber: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectDialog({
  isOpen,
  orderNumber,
  onConfirm,
  onCancel,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim() === "") {
      return;
    }
    onConfirm(reason.trim());
    setReason("");
  };

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Tolak Pesanan
          </h3>
          <p className="text-sm text-slate-500">
            Pesanan <span className="font-semibold text-slate-700">{orderNumber}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alasan Penolakan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Masukkan alasan penolakan pesanan..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
            rows={4}
            autoFocus
          />
          {reason.trim() === "" && (
            <p className="text-xs text-slate-400 mt-1">
              Alasan penolakan wajib diisi
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={reason.trim() === ""}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Tolak Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}