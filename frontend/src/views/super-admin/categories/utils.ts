export const formatNumber = (value: number) => value.toLocaleString("id-ID")

export const formatDate = (value: string) => {
  if (!value) return "-"
  const date = new Date(value)
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
