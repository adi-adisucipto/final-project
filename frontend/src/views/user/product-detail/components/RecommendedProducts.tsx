"use client";

import { CatalogProduct } from "@/types/product";
import ProductGrid from "@/views/user/products/components/ProductGrid";

type RecommendedProductsProps = {
  products: CatalogProduct[];
  isLoading: boolean;
  storeId?: string;
  onAddToCart: (productId: string) => void;
};

function RecommendedProducts({
  products,
  isLoading,
  storeId,
  onAddToCart,
}: RecommendedProductsProps) {
  const isEmpty = products.length === 0;
  if (!isLoading && isEmpty) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-black/90">
        Recommended Products
      </h2>
      <div className="mt-4">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          storeId={storeId}
          onAddToCart={onAddToCart}
        />
      </div>
    </section>
  );
}

export default RecommendedProducts;
