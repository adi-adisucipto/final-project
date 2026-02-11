 "use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import ProductFiltersBar from "@/views/super-admin/products/components/ProductFiltersBar"
import ProductStats from "@/views/super-admin/products/components/ProductStats"
import ProductTable from "@/views/super-admin/products/components/ProductTable"
import PaginationControls from "@/views/user/products/components/PaginationControls"
import { useAdminProducts } from "@/views/super-admin/products/hooks/useAdminProducts"
import { SortOption } from "@/views/super-admin/products/types"

const defaultSort: SortOption = "newest"

function AdminStoreProductStockPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const storeId = session?.user?.storeId || ""

  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sort, setSort] = useState<SortOption>(defaultSort)
  const [page, setPage] = useState(1)

  const filters = { search, categoryId, sort, page, storeId }
  const { products, pagination, categories, isLoading } = useAdminProducts(
    filters,
    accessToken!
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value)
    setPage(1)
  }

  const handleSortChange = (value: SortOption) => {
    setSort(value)
    setPage(1)
  }

  if (!storeId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
        Store not assigned.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
            Product Management
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Store admin can view product details only.
          </p>
        </div>
        <div className="mt-6">
          <ProductFiltersBar
            search={search}
            onSearchChange={handleSearchChange}
            categoryId={categoryId}
            onCategoryChange={handleCategoryChange}
            sort={sort}
            onSortChange={handleSortChange}
            categories={categories}
            onAdd={() => {}}
            readOnly
          />
        </div>
      </section>

      <ProductStats totalProducts={pagination.total || products.length} />

      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading products...
        </p>
      )}

      <ProductTable
        products={products}
        onEdit={() => {}}
        onDelete={() => {}}
        readOnly
      />

      {pagination.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

export default AdminStoreProductStockPage
