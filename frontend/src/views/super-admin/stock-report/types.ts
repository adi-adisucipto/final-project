export type StockReportSummary = {
  totalAdded: number
  totalRemoved: number
  endingStock: number
}

export type StockReportProduct = {
  productId: string
  productName: string
  categoryName: string
  startStock: number
  totalIn: number
  totalOut: number
  endStock: number
  status: "SAFE" | "LOW"
}

export type StockReportHistory = {
  id: string
  date: string
  productId: string
  productName: string
  action: "IN" | "OUT"
  quantity: number
  source: string
  stockBefore: number
  stockAfter: number
  storeName: string
}

export type StockReportData = {
  month: string
  summary: StockReportSummary
  products: StockReportProduct[]
  history: StockReportHistory[]
}

export type StoreOption = {
  id: string
  name: string
}
