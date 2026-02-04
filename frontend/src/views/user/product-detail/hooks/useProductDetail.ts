"use client";

import { useEffect, useState } from "react";
import { getProductDetail } from "@/services/product.services";
import { ProductDetail } from "@/types/product";

export function useProductDetail(
  productId: string,
  coords: { lat: number; lng: number } | undefined,
  isReady: boolean,
  storeId?: string
) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!productId || !isReady) return;
    let active = true;
    setIsLoading(true);
    setError(null);
    const params: { lat?: number; lng?: number; storeId?: string } = {};
    if (coords?.lat !== undefined && coords?.lng !== undefined) {
      params.lat = coords.lat;
      params.lng = coords.lng;
    }
    if (storeId) {
      params.storeId = storeId;
    }

    const hasParams = Object.keys(params).length > 0;
    getProductDetail(productId, hasParams ? params : undefined)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch(() => {
        if (active) setError("Product not available in this store.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [coords?.lat, coords?.lng, isReady, productId, storeId]);

  return { detail, isLoading, error };
}
