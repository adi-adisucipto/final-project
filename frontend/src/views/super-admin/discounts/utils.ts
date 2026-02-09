import { DiscountItem } from "./types"

export const formatNumber = (value: number) => value.toLocaleString("id-ID")

export const formatCurrency = (value: number) =>
  value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })

export const isActiveDiscount = (discount: DiscountItem) => {
  const now = new Date()
  return new Date(discount.startAt) <= now && new Date(discount.endAt) >= now
}

export const getRuleLabel = (rule: DiscountItem["rule"]) => {
  if (rule === "MIN_PURCHASE") return "Min Purchase"
  if (rule === "BOGO") return "Buy 1 Get 1"
  return "Manual"
}

export const getValueLabel = (discount: DiscountItem) => {
  if (discount.rule === "BOGO") return "Buy 1 Get 1"
  if (discount.type === "PERCENT") return `${discount.value}%`
  return formatCurrency(discount.value)
}

export const getConditionLabel = (discount: DiscountItem) => {
  if (discount.rule !== "MIN_PURCHASE") return "-"
  const min = discount.minPurchase ? formatCurrency(discount.minPurchase) : "-"
  const max = discount.maxDiscount ? formatCurrency(discount.maxDiscount) : "-"
  return `Min ${min} / Max ${max}`
}

export const getDiscountName = (discount: DiscountItem) => {
  const productName = discount.productName
  if (discount.rule === "BOGO") return `BOGO - ${productName}`
  if (discount.rule === "MIN_PURCHASE") return `Min Purchase - ${productName}`
  return `Manual - ${productName}`
}
