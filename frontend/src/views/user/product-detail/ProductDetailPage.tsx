"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import useGeolocation from "@/hooks/useGeolocation";
import { cartService } from "@/services/cart.services";
import { useProductDetail } from "./hooks/useProductDetail";
import { useRecommendedProducts } from "./hooks/useRecommendedProducts";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import PurchaseCard from "./components/PurchaseCard";
import RecommendedProducts from "./components/RecommendedProducts";

type ProductDetailPageProps = {
  productId: string;
};

const clampQuantity = (value: number, stock: number) => {
  if (stock <= 0) return 0;
  return Math.max(1, Math.min(stock, value));
};

function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const { loaded, coordinates, error: locationError } = useGeolocation();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storeId = searchParams.get("storeId") || undefined;

  let coords: { lat: number; lng: number } | undefined;
  if (loaded && !locationError) {
    const lat = Number(coordinates.lat);
    const lng = Number(coordinates.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      coords = { lat, lng };
    }
  }

  const { detail, isLoading, error } = useProductDetail(
    productId,
    coords,
    loaded,
    storeId
  );

  const { products: recommended, isLoading: isRecLoading } =
    useRecommendedProducts(coords, loaded);

  const stock = detail?.product.stock ?? 0;
  const price = detail?.product.price ?? 0;
  const subtotal = price * quantity;

  useEffect(() => {
    if (stock > 0) setQuantity(1);
  }, [stock]);

  const handleQuantityChange = (value: string) => {
    if (!value) {
      setQuantity(1);
      return;
    }
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    setQuantity(clampQuantity(parsed, stock));
  };

  const addToCart = async (targetId: string, qty: number) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    if (!detail?.store.id) return;
    await cartService.addToCart({
      productId: targetId,
      storeId: detail.store.id,
      quantity: qty,
    });
  };

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      await addToCart(productId, quantity);
      enqueueSnackbar("Added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add to cart", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = async (targetId: string) => {
    try {
      await addToCart(targetId, 1);
      enqueueSnackbar("Added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add to cart", { variant: "error" });
    }
  };

  if (!detail && !isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-black/60">
        {error || "Product not found for this store."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      {locationError ? (
        <p className="mb-4 text-sm text-black/50">
          Location blocked. Showing main store product.
        </p>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
        <ProductGallery
          images={detail?.product.images ?? []}
          name={detail?.product.name || "Product"}
          isLoading={isLoading || !loaded}
        />
        <ProductInfo
          name={detail?.product.name || ""}
          description={detail?.product.description || ""}
          categoryName={detail?.product.category?.name || "Uncategorized"}
          productId={detail?.product.id || ""}
          isLoading={isLoading || !loaded}
        />
        <PurchaseCard
          price={price}
          stock={stock}
          quantity={quantity}
          subtotal={subtotal}
          isLoading={isLoading || !loaded}
          isSubmitting={isSubmitting}
          isLoggedIn={status === "authenticated"}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
        />
      </div>
      {detail ? (
        <RecommendedProducts
          products={recommended}
          isLoading={isRecLoading || !loaded}
          storeId={detail.store.id}
          onAddToCart={handleQuickAdd}
        />
      ) : null}
    </div>
  );
}

export default ProductDetailPage;
