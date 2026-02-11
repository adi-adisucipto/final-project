import { StockReportHistory, StockReportProduct } from "../types"
import { formatDate, formatNumber } from "../utils"

type StockSummaryTableProps = {
  products: StockReportProduct[]
}

export function StockSummaryTable({ products }: StockSummaryTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Product Stock Summary (Monthly)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Start Stock</th>
              <th className="px-5 py-3 text-right">Total In</th>
              <th className="px-5 py-3 text-right">Total Out</th>
              <th className="px-5 py-3 text-right">End Stock</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="px-5 py-4 text-slate-500" colSpan={7}>
                  No stock data yet.
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
                    {formatNumber(product.startStock)}
                  </td>
                  <td className="px-5 py-3 text-right text-emerald-600">
                    +{formatNumber(product.totalIn)}
                  </td>
                  <td className="px-5 py-3 text-right text-rose-500">
                    -{formatNumber(product.totalOut)}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-800">
                    {formatNumber(product.endStock)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "LOW"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {product.status === "LOW" ? "Low" : "Safe"}
                    </span>
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

type StockHistoryTableProps = {
  history: StockReportHistory[]
}

export function StockHistoryTable({ history }: StockHistoryTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Monthly Stock History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Qty</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3 text-right">Stock Before</th>
              <th className="px-5 py-3 text-right">Stock After</th>
              <th className="px-5 py-3">Store</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td className="px-5 py-4 text-slate-500" colSpan={8}>
                  No stock history yet.
                </td>
              </tr>
            ) : (
              history.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-200">
                  <td className="px-5 py-3 text-slate-700">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-5 py-3 text-slate-700">
                    {entry.productName}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        entry.action === "IN"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {entry.action === "IN" ? "In" : "Out"}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-right ${
                      entry.action === "IN" ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {entry.action === "IN" ? "+" : "-"}
                    {formatNumber(entry.quantity)}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{entry.source}</td>
                  <td className="px-5 py-3 text-right text-slate-700">
                    {formatNumber(entry.stockBefore)}
                  </td>
                  <td className="px-5 py-3 text-right text-slate-800">
                    {formatNumber(entry.stockAfter)}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{entry.storeName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
