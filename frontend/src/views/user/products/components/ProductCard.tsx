"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CatalogProduct } from "@/types/product";

type ProductCardProps = {
  product: CatalogProduct;
  storeId?: string;
  onAddToCart: (productId: string) => void;
  disabled?: boolean;
};

const formatPrice = (price: number) => {
  return Number(price).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
};

function ProductCard({
  product,
  storeId,
  onAddToCart,
  disabled,
}: ProductCardProps) {
  let isOutOfStock = false;
  if (product.stock <= 0) isOutOfStock = true;

  let isDisabled = false;
  if (disabled || isOutOfStock) isDisabled = true;

  let detailHref = `/products/${product.id}`;
  if (storeId) {
    detailHref = `/products/${product.id}?storeId=${storeId}`;
  }

  let buttonClass =
    "mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white";
  if (isDisabled) {
    buttonClass += " cursor-not-allowed bg-black/20";
  } else {
    buttonClass += " bg-emerald-500 hover:bg-emerald-600";
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
      <Link href={detailHref} className="block">
        <div className="flex h-44 items-center justify-center rounded-xl border border-black/10 bg-black/5">
          <Image
            src={product.imageUrl || "/paper-bag.png"}
            alt={product.name}
            width={140}
            height={140}
            className="object-contain"
          />
        </div>
        <div className="pt-3">
          <p className="text-xs font-semibold text-black/40">
            {product.category?.name || "Uncategorized"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
            {product.name}
          </h3>
          <p className="mt-3 text-lg font-bold">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onAddToCart(product.id)}
        className={buttonClass}
      >
        {isOutOfStock ? "Out of Stock" : "Add Cart"}
        <ShoppingCart className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ProductCard;
