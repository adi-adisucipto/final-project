import { CategoryStats } from "../types"
import { formatNumber } from "../utils"

type CategoryStatsProps = CategoryStats

function CategoryStatsCards({
  totalCategories,
  totalProducts,
  avgProducts,
}: CategoryStatsProps) {
  const stats = [
    {
      label: "Total Categories",
      value: formatNumber(totalCategories),
      description: "Categories listed",
    },
    {
      label: "Avg Products/Category",
      value: formatNumber(avgProducts),
      description: "Average per category",
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

export default CategoryStatsCards
