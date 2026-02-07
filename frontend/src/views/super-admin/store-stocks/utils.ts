import { InventoryAction } from "./types"

export const formatNumber = (value: number) => value.toLocaleString("id-ID")

export const formatDate = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  const date = new Date(value)
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const getActionLabel = (action: InventoryAction) =>
  action === "IN" ? "Added" : "Removed"
