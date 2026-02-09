import { CategoryOption, ProductItem } from "./types"

export const categoryOptions: CategoryOption[] = [
  { id: "cat-1", name: "Foods" },
  { id: "cat-2", name: "Drinks" },
  { id: "cat-3", name: "Snacks" },
  { id: "cat-4", name: "Kitchen" },
]

export const initialProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "Indomie Goreng",
    description: "Instant noodles with savory seasoning.",
    price: 3000,
    isActive: true,
    categoryId: "cat-1",
    categoryName: "Foods",
    images: [],
  },
  {
    id: "prod-2",
    name: "Aqua 1.5L",
    description: "Fresh mineral water for everyday hydration.",
    price: 5000,
    isActive: true,
    categoryId: "cat-2",
    categoryName: "Drinks",
    images: [],
  },
  {
    id: "prod-3",
    name: "Chitato",
    description: "Crunchy potato chips with bold flavor.",
    price: 12000,
    isActive: true,
    categoryId: "cat-3",
    categoryName: "Snacks",
    images: [],
  },
  {
    id: "prod-4",
    name: "Cooking Oil 2L",
    description: "Reliable cooking oil for daily meals.",
    price: 75000,
    isActive: true,
    categoryId: "cat-4",
    categoryName: "Kitchen",
    images: [],
  },
]
