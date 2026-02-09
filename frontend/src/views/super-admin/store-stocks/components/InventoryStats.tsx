import { Stats } from "../types"
import { formatNumber } from "../utils"

type InventoryStatsProps = Stats

function InventoryStats({ totalProducts, totalUnits, lowStock }: InventoryStatsProps) {
  const stats = [
    {
      label: "Total Products",
      value: formatNumber(totalProducts),
      description: "Products in stock",
    },
    {
      label: "Total Units",
      value: formatNumber(totalUnits),
      description: "Units across stores",
    },
    {
      label: "Low Stock",
      value: formatNumber(lowStock),
      description: "Products below threshold",
    },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-slate-100 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {stat.label}
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-600">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-slate-600">{stat.description}</p>
        </div>
      ))}
    </section>
  )
}

export default InventoryStats
