export type StoreOption = {
  id: string
  name: string
}

export type CategoryOption = {
  id: string
  name: string
}

export type ProductItem = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  isActive: boolean
  categoryId: string
  categoryName: string
  storeId: string
  storeName: string
  images: string[]
}

export type ProductFormPayload = {
  id?: string
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  storeId: string
  previousStoreId?: string
  files: File[]
}

export type SortOption = "newest" | "price_asc" | "price_desc"
