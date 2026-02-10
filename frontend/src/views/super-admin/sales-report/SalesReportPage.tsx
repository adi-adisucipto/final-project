"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { getStore } from "@/services/store.service"
import SalesReportFilters from "./components/SalesReportFilters"
import SalesReportStats from "./components/SalesReportStats"
import {
  CategorySalesChart,
  MonthlySalesChart,
  ProductSalesTable,
} from "./components/SalesReportCharts"
import CategorySalesTable from "./components/CategorySalesTable"
import { useSalesReport } from "./hooks/useSalesReport"
import { StoreOption } from "./types"
import { getCurrentMonthValue } from "./utils"

type ActiveTab = "monthly" | "category" | "product"

function SalesReportPage() {
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("monthly")

  let selectedStoreId: string | undefined = storeId
  if (isStoreAdmin) selectedStoreId = lockedStoreId
  if (!selectedStoreId) selectedStoreId = undefined

  const { data, isLoading } = useSalesReport(
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
    totalSales: 0,
    categoryCount: 0,
    productCount: 0,
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Sales Report
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Store Sales
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review monthly sales performance for each store.
          </p>
        </div>
        <div className="mt-6">
          <SalesReportFilters
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

      <SalesReportStats
        totalSales={summary.totalSales}
        categoryCount={summary.categoryCount}
        productCount={summary.productCount}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("monthly")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "monthly"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Monthly Sales
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("category")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "category"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          By Category
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("product")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            activeTab === "product"
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          By Product
        </button>
      </div>

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">Loading report...</p>
      )}

      {!isLoading && activeTab === "monthly" && (
        <MonthlySalesChart series={data?.monthlySeries || []} />
      )}
      {!isLoading && activeTab === "category" && (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <CategorySalesChart categories={data?.categories || []} />
          <CategorySalesTable categories={data?.categories || []} />
        </div>
      )}
      {!isLoading && activeTab === "product" && (
        <ProductSalesTable products={data?.products || []} />
      )}

    </div>
  )
}

export default SalesReportPage
