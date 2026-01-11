"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import OrderFilter from "@/components/OrderFilter";
import OrderCard from "@/components/OrderCard";
import Spinner from "@/components/ui/Spinner";
import { getErrorMessage } from "@/lib/error-handler";
import { api } from "@/lib/storeAdmin-links";
import { Order } from "@/types/order";

interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function StoreAdminDashboard() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: pagination.limit.toString(),
      };

      if (activeFilter !== "all") {
        params.status = activeFilter;
      }

      const response = await api.get<OrdersResponse>("/store-admin/orders", {
        params,
      });

      setOrders(response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        `/store-admin/orders/${orderId}/approve`
      );

      enqueueSnackbar(response.message || "Order approved successfully", {
        variant: "success",
      });

      fetchOrders(pagination.page);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), {
        variant: "error",
      });
      throw error;
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Please enter rejection reason:");

    if (!reason || reason.trim() === "") {
      enqueueSnackbar("Rejection reason is required", { variant: "warning" });
      throw new Error("Rejection cancelled");
    }

    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        `/store-admin/orders/${orderId}/reject`,
        { reason: reason.trim() }
      );

      enqueueSnackbar(response.message || "Order rejected successfully", {
        variant: "success",
      });

      fetchOrders(pagination.page);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), {
        variant: "error",
      });
      throw error;
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
        <p className="text-sm text-gray-500">
          Managing store: <b>{session?.user?.storeName || "Loading..."}</b>
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {pagination.total} Order{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <OrderFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size={40} thickness={4} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">
            {activeFilter !== "all"
              ? "Try changing the filter"
              : "Orders will appear here when customers place orders"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => fetchOrders(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-4 py-2 bg-white border rounded-lg">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => fetchOrders(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages || loading}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}