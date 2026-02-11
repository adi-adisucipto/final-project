import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import { SalesReportCategory, SalesReportProduct, SalesReportSeriesPoint } from "../types"
import { formatCurrency, formatMonthLabel } from "../utils"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
)

type MonthlySalesChartProps = {
  series: SalesReportSeriesPoint[]
}

export function MonthlySalesChart({ series }: MonthlySalesChartProps) {
  const labels = series.map((item) => formatMonthLabel(item.month))
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: series.map((item) => item.totalSales),
        borderColor: "#059669",
        backgroundColor: "rgba(5, 150, 105, 0.15)",
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-700">
        Monthly Sales Chart
      </h3>
      <div className="mt-4">
        <Line data={data} />
      </div>
    </div>
  )
}

type CategorySalesChartProps = {
  categories: SalesReportCategory[]
}

export function CategorySalesChart({ categories }: CategorySalesChartProps) {
  const labels = categories.map((item) => item.categoryName)
  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: categories.map((item) => item.totalSales),
        backgroundColor: "#10b981",
      },
    ],
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-700">
        Sales by Category
      </h3>
      <div className="mt-4">
        <Bar data={data} />
      </div>
    </div>
  )
}

type ProductSalesTableProps = {
  products: SalesReportProduct[]
}

export function ProductSalesTable({ products }: ProductSalesTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Sales by Product
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Qty Sold</th>
              <th className="px-5 py-3 text-right">Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="px-5 py-4 text-slate-500" colSpan={4}>
                  No sales data yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId} className="border-t border-slate-200">
                  <td className="px-5 py-3 text-slate-700">
                    {product.productName}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {product.categoryName}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-700">
                    {product.quantity.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-800">
                    {formatCurrency(product.totalSales)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
