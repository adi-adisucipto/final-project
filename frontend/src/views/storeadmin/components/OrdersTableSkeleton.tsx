import OrderRowSkeleton from "./OrderRowSkeleton";

interface OrdersTableSkeletonProps {
  rows?: number;
}

export default function OrdersTableSkeleton({
  rows = 5,
}: OrdersTableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Order Number</th>
            <th className="px-6 py-3 text-left font-semibold">Customer</th>
            <th className="px-6 py-3 text-left font-semibold">Total Amount</th>
            <th className="px-6 py-3 text-left font-semibold">Status</th>
            <th className="px-6 py-3 text-left font-semibold">Date</th>
            <th className="px-6 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <OrderRowSkeleton key={index} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}