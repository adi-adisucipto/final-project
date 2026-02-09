import { Minus, Plus, Trash2 } from "lucide-react"
import { InventoryAction, StockItem } from "../types"
import { formatDateTime, formatNumber } from "../utils"

type InventoryTableProps = {
  stocks: StockItem[]
  onAdjust: (stock: StockItem, action: InventoryAction) => void
  onDelete: (stockId: string) => void
}

function InventoryTable({ stocks, onAdjust, onDelete }: InventoryTableProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Available Stock</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No stock data found.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="border-t">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {stock.productName}
                    </p>
                    <p className="text-xs text-slate-500">{stock.storeName}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {formatNumber(stock.quantity)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDateTime(stock.lastUpdated)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onAdjust(stock, "IN")}
                        className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50"
                        aria-label="Add stock"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdjust(stock, "OUT")}
                        className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
                        aria-label="Reduce stock"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(stock.id)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
                        aria-label="Delete stock"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default InventoryTable
