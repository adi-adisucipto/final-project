import { Order } from "@/types/order";
import OrdersTableHeader from "./OrdersTableHeader";
import OrderRow from "./OrderRow";
import OrdersTableSkeleton from "./OrdersTableSkeleton";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActionsMenu from "./OrderActionMenu";

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
  onUpdateStatus?: (orderId: string, newStatus: import("@/types/order").OrderStatus) => void;
  onViewDetail?: (orderId: string) => void;
  onPageChange: (page: number) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

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
  onUpdateStatus,
  onViewDetail,
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
          <p className="text-lg mb-2">Tidak ada pesanan</p>
          <p className="text-slate-400">
            {activeFilter !== "all"
              ? "Coba ubah filter"
              : "Pesanan akan muncul di sini ketika pelanggan melakukan pemesanan"}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">
                    Nomor Pesanan
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Total Harga
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order, index) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    index={index}
                    isApproving={approvingId === order.id}
                    isRejecting={rejectingId === order.id}
                    onApprove={onApprove}
                    onReject={onReject}
                    onUpdateStatus={onUpdateStatus}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3 p-4">
            {orders.map((order) => {
              const customerName =
                `${order.user?.first_name || ""} ${order.user?.last_name || ""}`.trim() ||
                order.user?.email ||
                "N/A";

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Nomor Pesanan
                      </p>
                      <p className="font-semibold text-slate-900 text-base">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {order.orderItems?.length || 0} item
                        {(order.orderItems?.length || 0) > 1 ? "s" : ""}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="space-y-2.5 mb-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Pelanggan</p>
                      <p className="text-sm font-medium text-slate-900">
                        {customerName}
                      </p>
                      {order.userAddress?.address && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {order.userAddress.address}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-slate-500">Total Harga</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(Number(order.totalAmount))}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Tanggal</span>
                      <span className="text-xs text-slate-700">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <OrderActionsMenu
                      orderId={order.id}
                      orderStatus={order.status}
                      isApproving={approvingId === order.id}
                      isRejecting={rejectingId === order.id}
                      onApprove={onApprove}
                      onReject={onReject}
                      onUpdateStatus={onUpdateStatus}
                      onViewDetail={onViewDetail}
                      isMobile={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {pagination.totalPages > 1 && (
            <div className="border-t border-slate-200 px-4 md:px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
                  Menampilkan{" "}
                  <span className="font-medium text-slate-700">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium text-slate-700">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-slate-700">
                    {pagination.total}
                  </span>{" "}
                  pesanan
                </p>

                <div className="flex gap-2 justify-center sm:justify-end">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-w-[80px]"
                  >
                    Sebelumnya
                  </button>

                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors min-w-[80px]"
                  >
                    Selanjutnya
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