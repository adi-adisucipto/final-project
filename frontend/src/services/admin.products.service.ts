import axios from "axios";
import { PaginationMeta } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiResponse<T> = {
  data: T;
};

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: { id: string; name: string } | null;
  store: { id: string; name: string } | null;
  images: string[];
};

export type AdminProductList = {
  products: AdminProduct[];
  pagination: PaginationMeta;
};

export type AdminProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  storeId: string;
  isActive: boolean;
  previousStoreId?: string;
};

export type AdminProductQuery = {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  storeId?: string;
  sort?: "newest" | "price_asc" | "price_desc";
};

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
});

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined");
};

export async function getAdminProducts(
  params: AdminProductQuery,
  accessToken: string
) {
  ensureApiUrl();
  const { data } = await axios.get<ApiResponse<AdminProductList>>(
    `${API_BASE_URL}/admin/products`,
    { params, headers: getAuthHeaders(accessToken) }
  );
  return data.data;
}

export async function createAdminProduct(
  payload: AdminProductPayload,
  accessToken: string
) {
  ensureApiUrl();
  const { data } = await axios.post<ApiResponse<AdminProduct>>(
    `${API_BASE_URL}/admin/products`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  );
  return data.data;
}

export async function updateAdminProduct(
  productId: string,
  payload: AdminProductPayload,
  accessToken: string
) {
  ensureApiUrl();
  const { data } = await axios.patch<ApiResponse<AdminProduct>>(
    `${API_BASE_URL}/admin/products/${productId}`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  );
  return data.data;
}

export async function deleteAdminProduct(
  productId: string,
  accessToken: string
) {
  ensureApiUrl();
  const { data } = await axios.delete<ApiResponse<{ message: string }>>(
    `${API_BASE_URL}/admin/products/${productId}`,
    { headers: getAuthHeaders(accessToken) }
  );
  return data.data;
}

export async function uploadAdminProductImages(
  productId: string,
  files: File[],
  accessToken: string
) {
  ensureApiUrl();
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const { data } = await axios.post<ApiResponse<unknown>>(
    `${API_BASE_URL}/admin/products/${productId}/images`,
    formData,
    { headers: getAuthHeaders(accessToken) }
  );
  return data.data;
}
