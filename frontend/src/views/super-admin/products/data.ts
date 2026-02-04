import { CategoryOption, ProductItem, StoreOption } from "./types"

export const storeOptions: StoreOption[] = [
  { id: "store-1", name: "Groceria Rajabasa" },
  { id: "store-2", name: "Groceria Kemiling" },
  { id: "store-3", name: "Groceria Kedaton" },
]

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
    stock: 1455,
    isActive: true,
    categoryId: "cat-1",
    categoryName: "Foods",
    storeId: "store-1",
    storeName: "Groceria Rajabasa",
    images: [],
  },
  {
    id: "prod-2",
    name: "Aqua 1.5L",
    description: "Fresh mineral water for everyday hydration.",
    price: 5000,
    stock: 530,
    isActive: true,
    categoryId: "cat-2",
    categoryName: "Drinks",
    storeId: "store-1",
    storeName: "Groceria Rajabasa",
    images: [],
  },
  {
    id: "prod-3",
    name: "Chitato",
    description: "Crunchy potato chips with bold flavor.",
    price: 12000,
    stock: 650,
    isActive: true,
    categoryId: "cat-3",
    categoryName: "Snacks",
    storeId: "store-2",
    storeName: "Groceria Kemiling",
    images: [],
  },
  {
    id: "prod-4",
    name: "Cooking Oil 2L",
    description: "Reliable cooking oil for daily meals.",
    price: 75000,
    stock: 255,
    isActive: true,
    categoryId: "cat-4",
    categoryName: "Kitchen",
    storeId: "store-3",
    storeName: "Groceria Kedaton",
    images: [],
  },
]
