export const getCurrentMonthValue = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export const formatCurrency = (value: number) =>
  `Rp ${Math.round(value).toLocaleString("id-ID")}`

export const formatMonthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleString("en-US", { month: "short", year: "numeric" })
}
