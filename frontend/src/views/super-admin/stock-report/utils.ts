export const getCurrentMonthValue = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export const formatNumber = (value: number) =>
  value.toLocaleString("id-ID")

export const formatDate = (value: string) => {
  const date = new Date(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
