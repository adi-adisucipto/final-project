import { Plus, Search } from "lucide-react"

type DiscountFiltersBarProps = {
  search: string
  onSearchChange: (value: string) => void
  onAdd: () => void
}

function DiscountFiltersBar({
  search,
  onSearchChange,
  onAdd,
}: DiscountFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          placeholder="Search discounts or products..."
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
      >
        <Plus className="h-4 w-4" />
        Add Discount
      </button>
    </div>
  )
}

export default DiscountFiltersBar
