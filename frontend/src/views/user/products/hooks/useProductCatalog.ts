"use client";

import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  getProductCatalog,
  getProductCategories,
} from "@/services/product.services";
import { ProductCatalog, ProductCategory } from "@/types/product";

type CatalogFilters = {
  search: string;
  categoryId?: string;
  sort: "newest" | "price_asc" | "price_desc";
  page: number;
  minPrice: string;
  maxPrice: string;
  coords?: { lat: number; lng: number };
  isReady: boolean;
};

const parsePrice = (value: string) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export function useProductCatalog(filters: CatalogFilters) {
  const [catalog, setCatalog] = useState<ProductCatalog | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const minValue = parsePrice(filters.minPrice);
  const maxValue = parsePrice(filters.maxPrice);
  let priceError: string | undefined;
  if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
    priceError = "Min price must be less than max price.";
  }

  useEffect(() => {
    let active = true;
    getProductCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() =>
        enqueueSnackbar("Failed to load categories", { variant: "error" })
      );
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!filters.isReady || priceError) return;
    let active = true;

    const params: {
      page: number;
      limit: number;
      sort: "newest" | "price_asc" | "price_desc";
      search?: string;
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      lat?: number;
      lng?: number;
    } = {
      page: filters.page,
      limit: 9,
      sort: filters.sort,
    };
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (minValue !== undefined) params.minPrice = minValue;
    if (maxValue !== undefined) params.maxPrice = maxValue;
    if (filters.coords?.lat !== undefined && filters.coords?.lng !== undefined) {
      params.lat = filters.coords.lat;
      params.lng = filters.coords.lng;
    }

    setIsLoading(true);
    getProductCatalog(params)
      .then((data) => {
        if (active) setCatalog(data);
      })
      .catch(() =>
        enqueueSnackbar("Failed to load products", { variant: "error" })
      )
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    filters.categoryId,
    filters.coords?.lat,
    filters.coords?.lng,
    filters.isReady,
    filters.maxPrice,
    filters.minPrice,
    filters.page,
    filters.search,
    filters.sort,
    priceError,
  ]);

  return {
    catalog,
    categories,
    isLoading,
    priceError,
  };
}
