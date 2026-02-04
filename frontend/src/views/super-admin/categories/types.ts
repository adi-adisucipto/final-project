export type CategoryItem = {
  id: string
  name: string
  productCount: number
  createdAt: string
}

export type CategoryFormPayload = {
  id?: string
  name: string
}

export type CategoryStats = {
  totalCategories: number
  totalProducts: number
  avgProducts: number
}
