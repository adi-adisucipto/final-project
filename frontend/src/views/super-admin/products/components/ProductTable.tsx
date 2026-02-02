import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { ProductItem } from "../types"
import { formatCurrency, formatNumber } from "../utils"

type ProductTableProps = {
  products: ProductItem[]
  onEdit: (product: ProductItem) => void
  onDelete: (id: string) => void
}

function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const imageUrl = product.images[0]
                return (
                  <tr key={`${product.id}-${product.storeId}`} className="border-t">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-slate-100">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.storeName}
                          </p>
                        </div>
                      </div>
                    </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">
                    {product.categoryName}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatNumber(product.stock)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="line-clamp-2">{product.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50"
                        aria-label="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="rounded-lg border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50"
                        aria-label="Delete product"
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

export default ProductTable
