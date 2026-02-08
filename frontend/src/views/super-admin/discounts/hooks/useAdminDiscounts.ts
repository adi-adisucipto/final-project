"use client"

import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { getAdminDiscounts } from "@/services/admin.discounts.service"
import { PaginationMeta } from "@/types/product"
import { DiscountItem } from "../types"

type DiscountFilters = {
  search: string
  page: number
}

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

export function useAdminDiscounts(
  filters: DiscountFilters,
  accessToken?: string,
  refreshKey = 0
) {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    let active = true

    const load = async () => {
      setIsLoading(true)
      try {
        const data = await getAdminDiscounts(
          {
            page: filters.page,
            limit: 10,
            search: filters.search || undefined,
          },
          accessToken
        )
        if (!active) return
        setDiscounts(data.discounts)
        setPagination(data.pagination)
      } catch (error) {
        if (active) {
          enqueueSnackbar("Failed to load discounts", { variant: "error" })
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

  return {
    discounts,
    pagination,
    isLoading,
  }
}
