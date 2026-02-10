import axios from "axios"
import { StockReportData } from "@/views/super-admin/stock-report/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiResponse<T> = {
  data: T
}

export type StockReportQuery = {
  month: string
  storeId?: string
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined")
}

export async function getStockReport(
  params: StockReportQuery,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<StockReportData>>(
    `${API_BASE_URL}/admin/reports/stock`,
    { params, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}
