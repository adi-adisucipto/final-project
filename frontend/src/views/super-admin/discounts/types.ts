import { AdminDiscount } from "@/services/admin.discounts.service"

export type DiscountItem = AdminDiscount

export type DiscountRule = "MANUAL" | "MIN_PURCHASE" | "BOGO"
export type DiscountType = "PERCENT" | "NOMINAL"

export type DiscountFormPayload = {
  id?: string
  storeId?: string
  productId: string
  rule: DiscountRule
  type: DiscountType
  value: number
  minPurchase?: number
  maxDiscount?: number
}

export type StoreOption = {
  id: string
  name: string
}

export type ProductOption = {
  id: string
  name: string
}
