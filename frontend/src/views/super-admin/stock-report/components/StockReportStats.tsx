import { formatNumber } from "../utils"

type StockReportStatsProps = {
  totalAdded: number
  totalRemoved: number
  endingStock: number
}

function StockReportStats({
  totalAdded,
  totalRemoved,
  endingStock,
}: StockReportStatsProps) {
  const cards = [
    { label: "Total Added", value: `${formatNumber(totalAdded)} units` },
    { label: "Total Removed", value: `${formatNumber(totalRemoved)} units` },
    { label: "Ending Stock", value: `${formatNumber(endingStock)} units` },
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

export default StockReportStats
