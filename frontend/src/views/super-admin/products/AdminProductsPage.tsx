"use client"
import { useState } from "react"
import { enqueueSnackbar } from "notistack"
import { useSession } from "next-auth/react"
import ProductFiltersBar from "./components/ProductFiltersBar"
import ProductStats from "./components/ProductStats"
import ProductTable from "./components/ProductTable"
import ProductModal from "./components/ProductModal"
import PaginationControls from "@/views/user/products/components/PaginationControls"
import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  uploadAdminProductImages,
} from "@/services/admin.products.service"
import { useAdminProducts } from "./hooks/useAdminProducts"
import { ProductFormPayload, ProductItem, SortOption } from "./types"

const defaultSort: SortOption = "newest"
function AdminProductsPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sort, setSort] = useState<SortOption>(defaultSort)
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const filters = { search, categoryId, sort, page }
  const { products: catalogProducts, pagination, categories, isLoading } =
    useAdminProducts(filters, accessToken, refreshKey)
  const totalProducts = pagination.total || catalogProducts.length
  const refreshProducts = () => setRefreshKey((prev) => prev + 1)
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
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }
  const openAddModal = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }
  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }
  const handleDelete = async (id: string) => {
    const approved = window.confirm("Delete this product?")
    if (!approved || !accessToken) return
    try {
      await deleteAdminProduct(id, accessToken)
      enqueueSnackbar("Product deleted", { variant: "success" })
      refreshProducts()
    } catch (error) {
      enqueueSnackbar("Failed to delete product", { variant: "error" })
    }
  }
  const handleSave = async (payload: ProductFormPayload) => {
    if (!accessToken) {
      enqueueSnackbar("Please sign in again", { variant: "error" })
      return
    }
    try {
      const body = {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        categoryId: payload.categoryId,
        isActive: true,
      }
      let productId = payload.id
      if (payload.id) {
        const data = await updateAdminProduct(payload.id, body, accessToken)
        productId = data.id
      } else {
        const data = await createAdminProduct(body, accessToken)
        productId = data.id
      }
      if (productId && payload.files.length > 0) {
        await uploadAdminProductImages(productId, payload.files, accessToken)
      }
      enqueueSnackbar("Product saved", { variant: "success" })
      refreshProducts()
      closeModal()
    } catch (error) {
      enqueueSnackbar("Failed to save product", { variant: "error" })
    }
  }
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Product Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage product details. Use Inventory Management for stock updates.
            </p>
          </div>
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
            onAdd={openAddModal}
          />
        </div>
      </section>
      <ProductStats totalProducts={totalProducts} />
      {isLoading && (
        <p className="text-sm font-semibold text-slate-500">
          Loading products...
        </p>
      )}
      <ProductTable
        products={catalogProducts}
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
      <ProductModal
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
        existingProducts={catalogProducts}
      />
    </div>
  )
}
export default AdminProductsPage
