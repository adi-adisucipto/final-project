import { HistoryItem } from "../types"
import { formatDateTime, formatNumber, getActionLabel } from "../utils"

type InventoryHistoryTableProps = {
  history: HistoryItem[]
}

function InventoryHistoryTable({ history }: InventoryHistoryTableProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Recent Stock Updates
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Note</th>
              <th className="px-6 py-4">Store</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No stock updates yet.
                </td>
              </tr>
            ) : (
              history.map((item) => {
                const isIn = item.action === "IN"
                return (
                  <tr key={item.id} className="border-t">
                    <td className="px-6 py-4 text-slate-600">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isIn
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {getActionLabel(item.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.note || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.storeName}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default InventoryHistoryTable
