"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import PaginationControls from "@/views/user/products/components/PaginationControls"
import { getStore } from "@/services/store.service"
import {
  createAdminDiscount,
  deleteAdminDiscount,
  updateAdminDiscount,
} from "@/services/admin.discounts.service"
import DiscountFiltersBar from "./components/DiscountFiltersBar"
import DiscountStats from "./components/DiscountStats"
import DiscountTable from "./components/DiscountTable"
import DiscountModal from "./components/DiscountModal"
import { useAdminDiscounts } from "./hooks/useAdminDiscounts"
import { DiscountFormPayload, DiscountItem, StoreOption } from "./types"

function AdminDiscountsPage() {
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
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountItem | null>(null)
  const [stores, setStores] = useState<StoreOption[]>([])

  const { discounts, pagination, isLoading } = useAdminDiscounts(
    { search, page },
    accessToken,
    refreshKey
  )

  useEffect(() => {
    if (!accessToken) return
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
  }, [accessToken])

  const refreshDiscounts = () => setRefreshKey((prev) => prev + 1)

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDiscount(null)
  }

  const openAddModal = () => {
    setEditingDiscount(null)
    setIsModalOpen(true)
  }

  const openEditModal = (discount: DiscountItem) => {
    setEditingDiscount(discount)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    const approved = window.confirm("Delete this discount?")
    if (!approved) return
    try {
      await deleteAdminDiscount(id, accessToken)
      enqueueSnackbar("Discount deleted", { variant: "success" })
      refreshDiscounts()
    } catch (error) {
      enqueueSnackbar("Failed to delete discount", { variant: "error" })
    }
  }

  const handleSave = async (payload: DiscountFormPayload) => {
    if (!accessToken) {
      enqueueSnackbar("Please sign in again", { variant: "error" })
      return
    }
    try {
      if (payload.id) {
        await updateAdminDiscount(payload.id, payload, accessToken)
      } else {
        await createAdminDiscount(payload, accessToken)
      }
      enqueueSnackbar("Discount saved", { variant: "success" })
      refreshDiscounts()
      closeModal()
    } catch (error) {
      enqueueSnackbar("Failed to save discount", { variant: "error" })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Discount Management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Store Discounts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage discounts for products in each store.
          </p>
        </div>
        <div className="mt-6">
          <DiscountFiltersBar
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={openAddModal}
          />
        </div>
      </section>

      <DiscountStats discounts={discounts} />

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading discounts...
        </p>
      )}

      <DiscountTable
        discounts={discounts}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {pagination.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <DiscountModal
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        discount={editingDiscount}
        stores={stores}
        accessToken={accessToken}
        storeLocked={isStoreAdmin}
        defaultStoreId={lockedStoreId}
      />
    </div>
  )
}

export default AdminDiscountsPage
