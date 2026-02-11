import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { getStockReport } from "@/services/admin.stock-report.service"
import { StockReportData } from "../types"

type StockReportFilters = {
  storeId?: string
  month: string
}

export function useStockReport(
  filters: StockReportFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [data, setData] = useState<StockReportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken || !filters.month) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const report = await getStockReport(
          {
            month: filters.month,
            storeId: filters.storeId || undefined,
          },
          accessToken
        )
        if (active) setData(report)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load stock report", { variant: "error" })
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [accessToken, filters.month, filters.storeId, refreshKey])

  return { data, isLoading }
}
