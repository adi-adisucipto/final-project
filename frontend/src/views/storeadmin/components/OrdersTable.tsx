import { Order } from "@/types/order";
import OrdersTableHeader from "./OrdersTableHeader";
import OrderRow from "./OrderRow";
import OrdersTableSkeleton from "./OrdersTableSkeleton";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  activeFilter: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  approvingId: string | null;
  rejectingId: string | null;
  onFilterChange: (filter: string) => void;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onPageChange: (page: number) => void;
}

export default function OrdersTable({
  orders,
  loading,
  activeFilter,
  pagination,
  approvingId,
  rejectingId,
  onFilterChange,
  onApprove,
  onReject,
  onPageChange,
}: OrdersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <OrdersTableHeader
        totalOrders={pagination.total}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />

      {loading ? (
        <OrdersTableSkeleton rows={pagination.limit} />
      ) : orders.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          <p className="text-lg mb-2">No orders found</p>
          <p className="text-slate-400">
            {activeFilter !== "all"
              ? "Try changing the filter"
              : "Orders will appear here when customers place orders"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    index={index}
                    isApproving={approvingId === order.id}
                    isRejecting={rejectingId === order.id}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={
                      pagination.page === pagination.totalPages || loading
                    }
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}