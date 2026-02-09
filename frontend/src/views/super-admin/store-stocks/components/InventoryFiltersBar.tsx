import { Plus, Search } from "lucide-react"
import { StoreOption } from "../types"

type InventoryFiltersBarProps = {
  search: string
  onSearchChange: (value: string) => void
  storeId: string
  onStoreChange: (value: string) => void
  stores: StoreOption[]
  onAdd: () => void
  storeLocked: boolean
}

function InventoryFiltersBar({
  search,
  onSearchChange,
  storeId,
  onStoreChange,
  stores,
  onAdd,
  storeLocked,
}: InventoryFiltersBarProps) {
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
          value={storeId}
          onChange={(event) => onStoreChange(event.target.value)}
          disabled={storeLocked}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </button>
      </div>
    </div>
  )
}

export default InventoryFiltersBar
