import axios from "axios"
import { PaginationMeta } from "@/types/product"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiResponse<T> = {
  data: T
}

export type InventoryStock = {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  quantity: number
  lastUpdated: string | null
}

export type InventoryHistoryItem = {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  action: "IN" | "OUT"
  quantity: number
  note: string
  createdAt: string
}

export type InventoryStats = {
  totalProducts: number
  totalUnits: number
  lowStock: number
}

export type InventoryList = {
  stocks: InventoryStock[]
  pagination: PaginationMeta
  stats: InventoryStats
  history: InventoryHistoryItem[]
}

export type InventoryQuery = {
  page: number
  limit: number
  search?: string
  storeId?: string
}

export type InventoryAdjustPayload = {
  storeId: string
  productId: string
  action: "IN" | "OUT"
  quantity: number
  note?: string
}

export type InventoryProductOption = {
  id: string
  name: string
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined")
}

export async function getInventoryList(
  params: InventoryQuery,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<InventoryList>>(
    `${API_BASE_URL}/admin/inventory`,
    { params, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function adjustInventory(
  payload: InventoryAdjustPayload,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.post<ApiResponse<{ id: string; quantity: number }>>(
    `${API_BASE_URL}/admin/inventory/adjust`,
    payload,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function deleteInventory(
  stockId: string,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.delete<ApiResponse<{ message: string }>>(
    `${API_BASE_URL}/admin/inventory/${stockId}`,
    { headers: getAuthHeaders(accessToken) }
  )
  return data.data
}

export async function getInventoryProducts(
  accessToken: string,
  search?: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<InventoryProductOption[]>>(
    `${API_BASE_URL}/admin/inventory/products`,
    { params: search ? { search } : undefined, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}
