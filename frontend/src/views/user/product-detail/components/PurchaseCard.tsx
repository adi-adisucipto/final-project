"use client";

type PurchaseCardProps = {
  price: number;
  stock: number;
  quantity: number;
  subtotal: number;
  isLoading: boolean;
  isSubmitting: boolean;
  isLoggedIn: boolean;
  onQuantityChange: (value: string) => void;
  onAddToCart: () => void;
};

const formatPrice = (price: number) =>
  Number(price).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });

function PurchaseCard({
  price,
  stock,
  quantity,
  subtotal,
  isLoading,
  isSubmitting,
  isLoggedIn,
  onQuantityChange,
  onAddToCart,
}: PurchaseCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
        Loading purchase info...
      </div>
    );
  }

  let isOutOfStock = false;
  if (stock <= 0) isOutOfStock = true;

  let stockLabel = "In Stock";
  let stockClass = "text-emerald-600";
  if (isOutOfStock) {
    stockLabel = "Out of Stock";
    stockClass = "text-red-500";
  }

  let buttonText = "Add to Cart";
  if (!isLoggedIn) buttonText = "Login to add";

  let buttonClass =
    "mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white";
  if (isOutOfStock || isSubmitting) {
    buttonClass += " cursor-not-allowed bg-black/20";
  } else {
    buttonClass += " bg-emerald-500 hover:bg-emerald-600";
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <p className="text-2xl font-bold">{formatPrice(price)}</p>
      <p className={`text-sm font-semibold ${stockClass}`}>{stockLabel}</p>
      <div className="mt-4">
        <label className="text-sm font-semibold text-black/70">Quantity</label>
        <input
          type="number"
          min={1}
          max={stock}
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
          disabled={isOutOfStock}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400 disabled:bg-black/5"
        />
      </div>
      <div className="mt-5 space-y-2 text-sm text-black/70">
        <div className="flex items-center justify-between">
          <span>Item</span>
          <span>
            {formatPrice(price)} x {quantity}
          </span>
        </div>
        <div className="flex items-center justify-between font-semibold text-black/90">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
      <button
        type="button"
        disabled={isOutOfStock || isSubmitting}
        onClick={onAddToCart}
        className={buttonClass}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default PurchaseCard;
