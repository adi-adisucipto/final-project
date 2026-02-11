"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { VoucherData } from "@/types/checkout";

interface PromoCodeInputProps {
  appliedVoucher: VoucherData | null;
  onApplyVoucher: (code: string) => Promise<void>;
  onRemoveVoucher: () => void;
  availableVouchers?: VoucherData[];
}

export default function PromoCodeInput({
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
  availableVouchers = [],
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsApplying(true);
    try {
      await onApplyVoucher(code.toUpperCase());
      setCode("");
    } catch (error) {
    } finally {
      setIsApplying(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Punya Kode Promo
      </h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === "Enter" && handleApply()}
          placeholder="Masukkan Kode Promo Anda"
          disabled={!!appliedVoucher || isApplying}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleApply}
          disabled={!code.trim() || !!appliedVoucher || isApplying}
          className="px-6 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApplying ? "..." : "USE"}
        </button>
      </div>

      {appliedVoucher && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-700">
                  {appliedVoucher.code} applied!
                </p>
                <p className="text-sm text-emerald-600">
                  {appliedVoucher.description}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveVoucher}
              className="text-emerald-600 hover:text-emerald-700"
              aria-label="Remove voucher"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!appliedVoucher && availableVouchers.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Available Vouchers:
          </p>
          <div className="space-y-2">
            {availableVouchers.map((voucher) => (
              <button
                key={voucher.code}
                onClick={() => onApplyVoucher(voucher.code)}
                disabled={isApplying}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-cyan-400 hover:bg-cyan-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {voucher.code}
                    </p>
                    <p className="text-xs text-gray-600">
                      {voucher.description}
                    </p>
                    {voucher.minPurchase > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Min. purchase: {formatPrice(voucher.minPurchase)}
                      </p>
                    )}
                  </div>
                  <Tag className="w-4 h-4 text-cyan-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}