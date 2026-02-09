import { Pencil, Trash2 } from "lucide-react"
import { DiscountItem } from "../types"
import {
  getConditionLabel,
  getDiscountName,
  getRuleLabel,
  getValueLabel,
  isActiveDiscount,
} from "../utils"

type DiscountTableProps = {
  discounts: DiscountItem[]
  onEdit: (discount: DiscountItem) => void
  onDelete: (id: string) => void
}

function DiscountTable({ discounts, onEdit, onDelete }: DiscountTableProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Conditions</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No discounts found.
                </td>
              </tr>
            ) : (
              discounts.map((discount) => {
                const active = isActiveDiscount(discount)
                return (
                  <tr key={discount.id} className="border-t">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {getDiscountName(discount)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {discount.productName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {getRuleLabel(discount.rule)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {getValueLabel(discount)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {getConditionLabel(discount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(discount)}
                          className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50"
                          aria-label="Edit discount"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(discount.id)}
                          className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
                          aria-label="Delete discount"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default DiscountTable
