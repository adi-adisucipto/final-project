"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { getErrorMessage } from "@/lib/error-handler";
import { api } from "@/lib/storeAdmin-links";
import { Order } from "@/types/order";
import OrdersTable from "../components/OrdersTable";

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
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

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
    setApprovingId(orderId);
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
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Please enter rejection reason:");

    if (!reason || reason.trim() === "") {
      enqueueSnackbar("Rejection reason is required", { variant: "warning" });
      return;
    }

    setRejectingId(orderId);
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
    } finally {
      setRejectingId(null);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Order Management
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Manage store orders
        </h1>
        <p className="text-sm text-slate-500">
          Managing store: <b>{session?.user?.storeName || "Loading..."}</b>
        </p>
      </header>
      <OrdersTable
        orders={orders}
        loading={loading}
        activeFilter={activeFilter}
        pagination={pagination}
        approvingId={approvingId}
        rejectingId={rejectingId}
        onFilterChange={handleFilterChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onPageChange={fetchOrders}
      />
    </div>
  );
}