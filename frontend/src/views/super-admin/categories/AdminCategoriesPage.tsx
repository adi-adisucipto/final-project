"use client"

import { useState } from "react"
import { enqueueSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import CategoryFiltersBar from "./components/CategoryFiltersBar"
import CategoryStatsCards from "./components/CategoryStats"
import CategoryTable from "./components/CategoryTable"
import CategoryModal from "./components/CategoryModal"
import PaginationControls from "@/views/user/products/components/PaginationControls"
import {
  createAdminCategory,
  deleteAdminCategory,
  updateAdminCategory,
} from "@/services/admin.categories.service"
import { useAdminCategories } from "./hooks/useAdminCategories"
import { CategoryFormPayload, CategoryItem } from "./types"

function AdminCategoriesPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken!
  const user = session?.user as
    | { role?: string; isStoreAdmin?: boolean; storeAdminId?: string }
    | undefined
  const isReadOnly =
    user?.role === "admin" && (user?.isStoreAdmin || user?.storeAdminId)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
    null
  )

  const { categories, pagination, stats, isLoading } = useAdminCategories(
    { search, page },
    accessToken,
    refreshKey
  )

  const refreshCategories = () => setRefreshKey((prev) => prev + 1)

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const openAddModal = () => {
    if (isReadOnly) return
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const openEditModal = (category: CategoryItem) => {
    if (isReadOnly) return
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSave = async (payload: CategoryFormPayload) => {
    if (!accessToken) {
      enqueueSnackbar("Please sign in again", { variant: "error" })
      return
    }
    if (isReadOnly) {
      enqueueSnackbar("Read-only access", { variant: "warning" })
      return
    }
    try {
      if (payload.id) {
        await updateAdminCategory(payload.id, { name: payload.name }, accessToken)
      } else {
        await createAdminCategory({ name: payload.name }, accessToken)
      }
      enqueueSnackbar("Category saved", { variant: "success" })
      refreshCategories()
      closeModal()
    } catch (error) {
      enqueueSnackbar("Failed to save category", { variant: "error" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    if (isReadOnly) {
      enqueueSnackbar("Read-only access", { variant: "warning" })
      return
    }
    const approved = window.confirm("Delete this category?")
    if (!approved) return
    try {
      await deleteAdminCategory(id, accessToken)
      enqueueSnackbar("Category deleted", { variant: "success" })
      refreshCategories()
    } catch (error) {
      enqueueSnackbar("Failed to delete category", { variant: "error" })
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
            Category Management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Product Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage product categories for your stores.
          </p>
        </div>
        <div className="mt-6">
          <CategoryFiltersBar
            search={search}
            onSearchChange={handleSearchChange}
            onAdd={openAddModal}
            readOnly={Boolean(isReadOnly)}
          />
        </div>
      </section>

      <CategoryStatsCards {...stats} />

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading categories...
        </p>
      )}

      <CategoryTable
        categories={categories}
        onEdit={openEditModal}
        onDelete={handleDelete}
        readOnly={Boolean(isReadOnly)}
      />

      {pagination.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <CategoryModal
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        category={editingCategory}
        existingCategories={categories}
      />
    </div>
  )
}

export default AdminCategoriesPage
