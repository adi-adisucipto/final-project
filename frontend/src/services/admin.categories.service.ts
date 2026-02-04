import axios from "axios"
import { PaginationMeta } from "@/types/product"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiResponse<T> = {
  data: T
}

export type AdminCategory = {
  id: string
  name: string
  productCount: number
  createdAt: string
}

export type AdminCategoryStats = {
  totalCategories: number
  totalProducts: number
  avgProducts: number
}

export type AdminCategoryList = {
  categories: AdminCategory[]
  pagination: PaginationMeta
  stats: AdminCategoryStats
}

export type AdminCategoryQuery = {
  page: number
  limit: number
  search?: string
}

export type AdminCategoryPayload = {
  name: string
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined")
}

export async function getAdminCategories(
  params: AdminCategoryQuery,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<AdminCategoryList>>(
    `${API_BASE_URL}/admin/categories`,
    { params, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function createAdminCategory(
  payload: AdminCategoryPayload,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.post<ApiResponse<AdminCategory>>(
    `${API_BASE_URL}/admin/categories`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function updateAdminCategory(
  categoryId: string,
  payload: AdminCategoryPayload,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.patch<ApiResponse<AdminCategory>>(
    `${API_BASE_URL}/admin/categories/${categoryId}`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function deleteAdminCategory(
  categoryId: string,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.delete<ApiResponse<{ message: string }>>(
    `${API_BASE_URL}/admin/categories/${categoryId}`,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}
