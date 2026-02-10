import { SalesReportCategory } from "../types"
import { formatCurrency } from "../utils"

type CategorySalesTableProps = {
  categories: SalesReportCategory[]
}

function CategorySalesTable({ categories }: CategorySalesTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Category Breakdown
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Sales</th>
              <th className="px-5 py-3 text-right">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td className="px-5 py-4 text-slate-500" colSpan={3}>
                  No category data yet.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-t border-slate-200"
                >
                  <td className="px-5 py-3 text-slate-700">
                    {category.categoryName}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-700">
                    {formatCurrency(category.totalSales)}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-600">
                    {category.percentage}%
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

export default CategorySalesTable
