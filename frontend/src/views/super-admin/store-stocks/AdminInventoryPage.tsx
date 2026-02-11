"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import PaginationControls from "@/views/user/products/components/PaginationControls"
import {
  adjustInventory,
  deleteInventory,
  InventoryAdjustPayload,
} from "@/services/admin.inventory.service"
import InventoryFiltersBar from "./components/InventoryFiltersBar"
import InventoryStats from "./components/InventoryStats"
import InventoryTable from "./components/InventoryTable"
import InventoryHistoryTable from "./components/InventoryHistoryTable"
import InventoryAdjustModal from "./components/InventoryAdjustModal"
import { useAdminInventory } from "./hooks/useAdminInventory"
import { InventoryAction, StockItem } from "./types"

function AdminInventoryPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const user = session?.user as
    | {
        role?: string
        isStoreAdmin?: boolean
        storeAdminId?: string | null
        storeId?: string | null
      }
    | undefined

  const lockedStoreId = user?.storeAdminId || user?.storeId || ""
  const isStoreAdmin = user?.role === "admin" && Boolean(lockedStoreId)

  const [search, setSearch] = useState("")
  const [storeId, setStoreId] = useState("")
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [adjustAction, setAdjustAction] = useState<InventoryAction>("IN")
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null)

  useEffect(() => {
    if (isStoreAdmin && lockedStoreId) {
      setStoreId(lockedStoreId)
    }
  }, [isStoreAdmin, lockedStoreId])

  const filters = { search, storeId, page }
  const { stocks, history, stats, pagination, stores, products, isLoading } =
    useAdminInventory(filters, accessToken!, refreshKey)

  const refreshInventory = () => setRefreshKey((prev) => prev + 1)

  const openAddModal = () => {
    setAdjustAction("IN")
    setSelectedStock(null)
    setIsModalOpen(true)
  }

  const openAdjustModal = (stock: StockItem, action: InventoryAction) => {
    setAdjustAction(action)
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedStock(null)
  }

  const handleSave = async (payload: InventoryAdjustPayload) => {
    if (!accessToken) {
      enqueueSnackbar("Please sign in again", { variant: "error" })
      return
    }
    try {
      await adjustInventory(payload, accessToken)
      enqueueSnackbar("Stock updated", { variant: "success" })
      refreshInventory()
      closeModal()
    } catch (error) {
      enqueueSnackbar("Failed to update stock", { variant: "error" })
    }
  }

  const handleDelete = async (stockId: string) => {
    if (!accessToken) return
    const approved = window.confirm("Delete this stock record?")
    if (!approved) return
    try {
      await deleteInventory(stockId, accessToken)
      enqueueSnackbar("Stock deleted", { variant: "success" })
      refreshInventory()
    } catch (error) {
      enqueueSnackbar("Failed to delete stock", { variant: "error" })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStoreChange = (value: string) => {
    if (isStoreAdmin) return
    setStoreId(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Inventory Management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Store Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage stock availability for each store.
          </p>
        </div>
        <div className="mt-6">
          <InventoryFiltersBar
            search={search}
            onSearchChange={handleSearchChange}
            storeId={storeId}
            onStoreChange={handleStoreChange}
            stores={stores}
            onAdd={openAddModal}
            storeLocked={isStoreAdmin}
          />
        </div>
      </section>

      <InventoryStats {...stats} />

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading inventory...
        </p>
      )}

      <InventoryTable
        stocks={stocks}
        onAdjust={openAdjustModal}
        onDelete={handleDelete}
      />

      {pagination.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <InventoryHistoryTable history={history} />

      <InventoryAdjustModal
        open={isModalOpen}
        action={adjustAction}
        stock={selectedStock}
        stores={stores}
        products={products}
        storeLocked={isStoreAdmin}
        defaultStoreId={storeId}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  )
}

export default AdminInventoryPage
