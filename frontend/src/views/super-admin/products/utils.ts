import { AdminProduct } from "@/services/admin.products.service"
import { ProductItem } from "./types"

export const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })

export const formatNumber = (value: number) => value.toLocaleString("id-ID")

export const mapAdminProduct = (product: AdminProduct): ProductItem => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  stock: product.stock,
  isActive: product.isActive,
  categoryId: product.category?.id ?? "",
  categoryName: product.category?.name ?? "Uncategorized",
  storeId: product.store?.id ?? "",
  storeName: product.store?.name ?? "Unknown store",
  images: product.images ?? [],
})
