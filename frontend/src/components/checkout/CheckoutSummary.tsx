"use client";

interface CheckoutSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number | null;
  total: number;
  onCheckout: () => void;
  isProcessing: boolean;
  isValid: boolean;
}

export default function CheckoutSummary({
  subtotal,
  discount,
  shipping,
  total,
  onCheckout,
  isProcessing,
  isValid,
}: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Ringkasan Pembayaran
      </h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-emerald-600">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatPrice(shipping!)
            )}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={!isValid || isProcessing}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `PAY - ${formatPrice(total)}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Dengan melanjutkan, Anda menyetujui{" "}
        <a href="/terms" className="text-cyan-600 hover:underline">
          syarat dan ketentuan
        </a>{" "}
        kami
      </p>
    </div>
  );
}