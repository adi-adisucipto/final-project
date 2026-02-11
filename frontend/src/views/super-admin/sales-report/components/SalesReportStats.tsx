import { formatCurrency } from "../utils"

type SalesReportStatsProps = {
  totalSales: number
  categoryCount: number
  productCount: number
}

function SalesReportStats({
  totalSales,
  categoryCount,
  productCount,
}: SalesReportStatsProps) {
  const cards = [
    { label: "Monthly Sales", value: formatCurrency(totalSales) },
    { label: "Categories", value: `${categoryCount} categories` },
    { label: "Products", value: `${productCount} products` },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {card.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-600">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export default SalesReportStats
