import axios from "axios"
import { SalesReportData } from "@/views/super-admin/sales-report/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

type ApiResponse<T> = {
  data: T
}

export type SalesReportQuery = {
  month: string
  storeId?: string
}

const getAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
})

const ensureApiUrl = () => {
  if (!API_BASE_URL) throw new Error("API_BASE_URL is not defined")
}

export async function getSalesReport(
  params: SalesReportQuery,
  accessToken: string
) {
  ensureApiUrl()
  const { data } = await axios.get<ApiResponse<SalesReportData>>(
    `${API_BASE_URL}/admin/reports/sales`,
    { params, headers: getAuthHeaders(accessToken) }
  )
  return data.data
}
