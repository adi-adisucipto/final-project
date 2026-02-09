import axios from "axios"
import { PaginationMeta } from "@/types/product"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiResponse<T> = {
  data: T
}

export type AdminDiscount = {
  id: string
  storeId: string
  storeName: string
  productId: string
  productName: string
  rule: "MANUAL" | "MIN_PURCHASE" | "BOGO"
  type: "PERCENT" | "NOMINAL"
  value: number
  minPurchase: number | null
  maxDiscount: number | null
  startAt: string
  endAt: string
}

export type AdminDiscountList = {
  discounts: AdminDiscount[]
  pagination: PaginationMeta
}

export type DiscountProductOption = {
  id: string
  name: string
}

export type DiscountPayload = {
  storeId?: string
  productId: string
  rule: "MANUAL" | "MIN_PURCHASE" | "BOGO"
  type: "PERCENT" | "NOMINAL"
  value: number
  minPurchase?: number
  maxDiscount?: number
}

export type DiscountQuery = {
  page: number
  limit: number
  search?: string
  storeId?: string
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined")
}

export async function getAdminDiscounts(
  params: DiscountQuery,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<AdminDiscountList>>(
    `${API_BASE_URL}/admin/discounts`,
    { params, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function createAdminDiscount(
  payload: DiscountPayload,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.post<ApiResponse<{ id: string }>>(
    `${API_BASE_URL}/admin/discounts`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function updateAdminDiscount(
  discountId: string,
  payload: DiscountPayload,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.patch<ApiResponse<{ id: string }>>(
    `${API_BASE_URL}/admin/discounts/${discountId}`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function deleteAdminDiscount(
  discountId: string,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.delete<ApiResponse<{ message: string }>>(
    `${API_BASE_URL}/admin/discounts/${discountId}`,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function getDiscountProducts(
  accessToken: string,
  storeId: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<DiscountProductOption[]>>(
    `${API_BASE_URL}/admin/discounts/products`,
    { params: { storeId }, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}
