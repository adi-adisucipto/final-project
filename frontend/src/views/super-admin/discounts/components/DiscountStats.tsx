import { DiscountItem } from "../types"
import { formatNumber, isActiveDiscount } from "../utils"

type DiscountStatsProps = {
  discounts: DiscountItem[]
}

function DiscountStats({ discounts }: DiscountStatsProps) {
  let activeCount = 0
  for (const discount of discounts) {
    if (isActiveDiscount(discount)) activeCount += 1
  }
  const inactiveCount = discounts.length - activeCount

  const stats = [
    {
      label: "Total Discounts",
      value: formatNumber(discounts.length),
      description: "Discounts created",
    },
    {
      label: "Active Discounts",
      value: formatNumber(activeCount),
      description: "Currently active",
    },
    {
      label: "Inactive Discounts",
      value: formatNumber(inactiveCount),
      description: "Not active",
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

export default DiscountStats
