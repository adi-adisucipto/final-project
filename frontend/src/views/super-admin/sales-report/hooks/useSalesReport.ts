import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { getSalesReport } from "@/services/admin.sales-report.service"
import { SalesReportData } from "../types"

type SalesReportFilters = {
  storeId?: string
  month: string
}

export function useSalesReport(
  filters: SalesReportFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [data, setData] = useState<SalesReportData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken || !filters.month) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const report = await getSalesReport(
          {
            month: filters.month,
            storeId: filters.storeId || undefined,
          },
          accessToken
        )
        if (active) setData(report)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load sales report", { variant: "error" })
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
