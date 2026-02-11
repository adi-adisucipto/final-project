type StockReportFiltersProps = {
  stores: { id: string; name: string }[]
  storeId: string
  month: string
  storeLocked: boolean
  onStoreChange: (value: string) => void
  onMonthChange: (value: string) => void
  onFilter: () => void
}

function StockReportFilters({
  stores,
  storeId,
  month,
  storeLocked,
  onStoreChange,
  onMonthChange,
  onFilter,
}: StockReportFiltersProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_auto] lg:items-end">
      <div>
        <label className="text-sm font-semibold text-slate-700">Store</label>
        <select
          value={storeId}
          onChange={(event) => onStoreChange(event.target.value)}
          disabled={storeLocked}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Month</label>
        <input
          type="month"
          value={month}
          onChange={(event) => onMonthChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
        />
      </div>
      <button
        type="button"
        onClick={onFilter}
        className="h-11 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
      >
        Filter
      </button>
    </div>
  )
}

export default StockReportFilters
