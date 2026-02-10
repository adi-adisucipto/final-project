"use client";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  onCheckout: () => void;
  isProcessing?: boolean;
}

export default function CartSummary({
  subtotal,
  discount = 0,
  onCheckout,
  isProcessing = false,
}: CartSummaryProps) {
  const total = subtotal - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Ringkasan Belanja</h2>

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
        disabled={isProcessing || subtotal === 0}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Buy"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
      </p>
    </div>
  );
}