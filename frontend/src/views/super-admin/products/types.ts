export type CategoryOption = {
  id: string
  name: string
}

export type ProductItem = {
  id: string
  name: string
  description: string
  price: number
  isActive: boolean
  categoryId: string
  categoryName: string
  images: string[]
}

export type ProductFormPayload = {
  id?: string
  name: string
  description: string
  price: number
  categoryId: string
  files: File[]
}

export type SortOption = "newest" | "price_asc" | "price_desc"
