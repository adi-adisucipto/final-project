"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { getProductCategories } from "@/services/product.services"
import { getStore } from "@/services/store.service"
import { getAdminProducts } from "@/services/admin.products.service"
import { PaginationMeta } from "@/types/product"
import { CategoryOption, ProductItem, SortOption, StoreOption } from "../types"
import { mapAdminProduct } from "../utils"

type AdminFilters = {
  search: string
  categoryId: string
  storeId: string
  sort: SortOption
  page: number
}

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const buildQuery = (filters: AdminFilters) => {
  const params: {
    page: number
    limit: number
    sort: SortOption
    search?: string
    categoryId?: string
    storeId?: string
  } = {
    page: filters.page,
    limit: 10,
    sort: filters.sort,
  }
  if (filters.search) params.search = filters.search
  if (filters.categoryId) params.categoryId = filters.categoryId
  if (filters.storeId) params.storeId = filters.storeId
  return params
}

export function useAdminProducts(
  filters: AdminFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [stores, setStores] = useState<StoreOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const categoriesData = await getProductCategories()
        const storesResponse = await getStore(accessToken)
        if (!active) return
        setCategories(categoriesData)
        const stores = (storesResponse.data || []).map((store: StoreOption) => ({
          id: store.id,
          name: store.name,
        }))
        setStores(stores)

        const data = await getAdminProducts(buildQuery(filters), accessToken)
        if (!active) return
        setProducts(data.products.map(mapAdminProduct))
        setPagination(data.pagination)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load products", { variant: "error" })
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
    filters.categoryId,
    filters.page,
    filters.search,
    filters.sort,
    filters.storeId,
    refreshKey,
  ])

  return {
    products,
    pagination,
    categories,
    stores,
    isLoading,
  }
}
