import {
  InventoryHistoryItem,
  InventoryProductOption,
  InventoryStats,
  InventoryStock,
} from "@/services/admin.inventory.service"

export type StoreOption = {
  id: string
  name: string
}

export type StockItem = InventoryStock
export type HistoryItem = InventoryHistoryItem
export type ProductOption = InventoryProductOption
export type Stats = InventoryStats
export type InventoryAction = "IN" | "OUT"
