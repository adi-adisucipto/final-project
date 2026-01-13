interface OrdersTableHeaderProps {
  totalOrders: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const STATUS_OPTIONS = [
  { label: "Show all", value: "all" },
  { label: "Waiting Confirmation", value: "WAITING_CONFIRMATION" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
];

export default function OrdersTableHeader({
  totalOrders,
  activeFilter,
  onFilterChange,
}: OrdersTableHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-slate-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-600">
          {totalOrders} Order{totalOrders !== 1 ? "s" : ""}
        </div>
        <select
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}