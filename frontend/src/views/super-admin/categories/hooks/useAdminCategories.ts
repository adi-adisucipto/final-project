"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import {
  getAdminCategories,
  AdminCategoryStats,
} from "@/services/admin.categories.service"
import { PaginationMeta } from "@/types/product"
import { CategoryItem } from "../types"

type CategoryFilters = {
  search: string
  page: number
}

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const defaultStats: AdminCategoryStats = {
  totalCategories: 0,
  totalProducts: 0,
  avgProducts: 0,
}

export function useAdminCategories(
  filters: CategoryFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination)
  const [stats, setStats] = useState<AdminCategoryStats>(defaultStats)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let active = true
    const load = async () => {
      setIsLoading(true)
      try {
        const data = await getAdminCategories(
          { page: filters.page, limit: 10, search: filters.search || undefined },
          accessToken
        )
        if (!active) return
        setCategories(data.categories)
        setPagination(data.pagination)
        setStats(data.stats)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load categories", { variant: "error" })
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [accessToken, filters.page, filters.search, refreshKey])

  return { categories, pagination, stats, isLoading }
}
