"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { getStore } from "@/services/store.service"
import StockReportFilters from "./components/StockReportFilters"
import StockReportStats from "./components/StockReportStats"
import { StockHistoryTable, StockSummaryTable } from "./components/StockReportTables"
import { useStockReport } from "./hooks/useStockReport"
import { StoreOption } from "./types"
import { getCurrentMonthValue } from "./utils"

type ActiveTab = "summary" | "history"

function StockReportPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const user = session?.user as
    | {
        role?: string
        storeAdminId?: string | null
        storeId?: string | null
      }
    | undefined

  const lockedStoreId = user?.storeAdminId || user?.storeId || ""
  const isStoreAdmin = user?.role === "admin" && Boolean(lockedStoreId)

  const [stores, setStores] = useState<StoreOption[]>([])
  const [storeId, setStoreId] = useState(lockedStoreId)
  const [month, setMonth] = useState(getCurrentMonthValue())
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary")

  let selectedStoreId: string | undefined = storeId
  if (isStoreAdmin) selectedStoreId = lockedStoreId
  if (!selectedStoreId) selectedStoreId = undefined

  const { data, isLoading } = useStockReport(
    {
      storeId: selectedStoreId,
      month,
    },
    accessToken,
    refreshKey
  )

  useEffect(() => {
    if (!accessToken || isStoreAdmin) return
    let active = true
    const loadStores = async () => {
      try {
        const response = await getStore(accessToken)
        if (!active) return
        const items: StoreOption[] = []
        for (const store of response.data || []) {
          items.push({ id: store.id, name: store.name })
        }
        setStores(items)
      } catch (error) {
        if (active) setStores([])
      }
    }
    loadStores()
    return () => {
      active = false
    }
  }, [accessToken, isStoreAdmin])

  const handleFilter = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const summary = data?.summary || {
    totalAdded: 0,
    totalRemoved: 0,
    endingStock: 0,
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Stock Report
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Stock Movement
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review monthly stock changes for each store.
          </p>
        </div>
        <div className="mt-6">
          <StockReportFilters
            stores={stores}
            storeId={isStoreAdmin ? lockedStoreId : storeId}
            month={month}
            storeLocked={isStoreAdmin}
            onStoreChange={setStoreId}
            onMonthChange={setMonth}
            onFilter={handleFilter}
          />
        </div>
      </section>

      <StockReportStats
        totalAdded={summary.totalAdded}
        totalRemoved={summary.totalRemoved}
        endingStock={summary.endingStock}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "summary"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Product Summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "history"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Stock History
        </button>
      </div>

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading stock report...
        </p>
      )}

      {!isLoading && activeTab === "summary" && (
        <StockSummaryTable products={data?.products || []} />
      )}
      {!isLoading && activeTab === "history" && (
        <StockHistoryTable history={data?.history || []} />
      )}
    </div>
  )
}

export default StockReportPage
