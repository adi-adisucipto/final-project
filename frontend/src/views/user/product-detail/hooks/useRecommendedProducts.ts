"use client";

import { useEffect, useState } from "react";
import { getProductCatalog } from "@/services/product.services";
import { CatalogProduct } from "@/types/product";

export function useRecommendedProducts(
  coords: { lat: number; lng: number } | undefined,
  isReady: boolean
) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    let active = true;
    setIsLoading(true);
    const params: {
      page: number;
      limit: number;
      sort: "newest";
      lat?: number;
      lng?: number;
    } = {
      page: 1,
      limit: 4,
      sort: "newest",
    };
    if (coords?.lat !== undefined && coords?.lng !== undefined) {
      params.lat = coords.lat;
      params.lng = coords.lng;
    }
    getProductCatalog(params)
      .then((data) => {
        if (active) setProducts(data.products);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [coords?.lat, coords?.lng, isReady]);

  return { products, isLoading };
}
