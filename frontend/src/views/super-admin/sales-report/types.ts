export type SalesReportSummary = {
  totalSales: number
  categoryCount: number
  productCount: number
}

export type SalesReportSeriesPoint = {
  month: string
  totalSales: number
}

export type SalesReportCategory = {
  categoryId: string
  categoryName: string
  totalSales: number
  percentage: number
}

export type SalesReportProduct = {
  productId: string
  productName: string
  categoryName: string
  quantity: number
  totalSales: number
}

export type SalesReportData = {
  month: string
  summary: SalesReportSummary
  monthlySeries: SalesReportSeriesPoint[]
  categories: SalesReportCategory[]
  products: SalesReportProduct[]
}

export type StoreOption = {
  id: string
  name: string
}
