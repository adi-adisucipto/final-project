"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { getStore } from "@/services/store.service"
import {
  getInventoryList,
  getInventoryProducts,
} from "@/services/admin.inventory.service"
import { PaginationMeta } from "@/types/product"
import { HistoryItem, ProductOption, Stats, StockItem, StoreOption } from "../types"

type InventoryFilters = {
  search: string
  storeId: string
  page: number
}

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const defaultStats: Stats = {
  totalProducts: 0,
  totalUnits: 0,
  lowStock: 0,
}

export function useAdminInventory(
  filters: InventoryFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination)
  const [stores, setStores] = useState<StoreOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const storesResponse = await getStore(accessToken)
        if (!active) return
        const storeItems: StoreOption[] = []
        for (const store of storesResponse.data || []) {
          storeItems.push({ id: store.id, name: store.name })
        }
        setStores(storeItems)

        const productItems = await getInventoryProducts(accessToken)
        if (!active) return
        setProducts(productItems)

        const data = await getInventoryList(
          {
            page: filters.page,
            limit: 10,
            search: filters.search || undefined,
            storeId: filters.storeId || undefined,
          },
          accessToken
        )
        if (!active) return
        setStocks(data.stocks)
        setHistory(data.history)
        setStats(data.stats)
        setPagination(data.pagination)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load inventory data", { variant: "error" })
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [
    accessToken,
    filters.page,
    filters.search,
    filters.storeId,
    refreshKey,
  ])

  return {
    stocks,
    history,
    stats,
    pagination,
    stores,
    products,
    isLoading,
  }
}
