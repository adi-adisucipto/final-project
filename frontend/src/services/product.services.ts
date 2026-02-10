import axios from "axios";
import { ProductCatalog, ProductCategory, ProductDetail } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type CatalogQueryParams = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  lat?: number;
  lng?: number;
  storeId?: string;
};

type ApiResponse<T> = {
  data: T;
};

export async function getProductCatalog(params: CatalogQueryParams) {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");
  const { data } = await axios.get<ApiResponse<ProductCatalog>>(
    `${API_BASE_URL}/products`,
    { params }
  );
  return data.data;
}

export async function getProductCategories() {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");
  const { data } = await axios.get<ApiResponse<ProductCategory[]>>(
    `${API_BASE_URL}/products/categories`
  );
  return data.data;
}

export async function getProductDetail(
  productId: string,
  params?: { lat?: number; lng?: number; storeId?: string }
) {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");
  const { data } = await axios.get<ApiResponse<ProductDetail>>(
    `${API_BASE_URL}/products/${productId}`,
    { params }
  );
  return data.data;
}
