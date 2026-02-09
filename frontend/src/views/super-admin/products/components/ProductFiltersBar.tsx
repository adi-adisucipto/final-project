import { Plus, Search } from "lucide-react"
import { CategoryOption, SortOption } from "../types"

type ProductFiltersBarProps = {
  search: string
  onSearchChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
  categories: CategoryOption[]
  onAdd: () => void
}

function ProductFiltersBar({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
  onAdd,
}: ProductFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
    </div>
  )
}

export default ProductFiltersBar
