import { Pencil, Trash2 } from "lucide-react"
import { CategoryItem } from "../types"
import { formatDate, formatNumber } from "../utils"

type CategoryTableProps = {
  categories: CategoryItem[]
  onEdit: (category: CategoryItem) => void
  onDelete: (id: string) => void
  readOnly: boolean
}

function CategoryTable({
  categories,
  onEdit,
  onDelete,
  readOnly,
}: CategoryTableProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatNumber(category.productCount)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        disabled={readOnly}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category.id)}
                        disabled={readOnly}
                        className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
                        aria-label="Delete category"
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

export default CategoryTable
