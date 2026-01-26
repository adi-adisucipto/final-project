"use client";

import { CatalogProduct } from "@/types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: CatalogProduct[];
  isLoading: boolean;
  storeId?: string;
  onAddToCart: (productId: string) => void;
};

function ProductGrid({
  products,
  isLoading,
  storeId,
  onAddToCart,
}: ProductGridProps) {
  const isEmpty = products.length === 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-black/60">
        Loading products...
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-6 text-center text-sm text-black/60">
        No products found for this store.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          storeId={storeId}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
