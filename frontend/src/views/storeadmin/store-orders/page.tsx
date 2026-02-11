"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { getErrorMessage } from "@/lib/error-handler";
import { api } from "@/lib/storeAdmin-links";
import { Order, OrderStatus } from "@/types/order";
import OrdersTable from "../components/OrdersTable";
import StatusConfirmDialog from "../components/Statusconfirmdialog";
import RejectDialog from "../components/Rejectdialog";

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
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
    currentStatus: OrderStatus;
    nextStatus: OrderStatus;
  }>({
    isOpen: false,
    orderId: "",
    orderNumber: "",
    currentStatus: "WAITING_CONFIRMATION",
    nextStatus: "CONFIRMED",
  });

  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
  }>({
    isOpen: false,
    orderId: "",
    orderNumber: "",
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
    setApprovingId(orderId);
    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        `/store-admin/orders/${orderId}/approve`
      );

      enqueueSnackbar(response.message || "Pesanan berhasil dikonfirmasi", {
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
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    setRejectDialog({
      isOpen: true,
      orderId,
      orderNumber: order.orderNumber,
    });
  };

  const confirmReject = async (reason: string) => {
    const { orderId } = rejectDialog;

    setRejectDialog((prev) => ({ ...prev, isOpen: false }));

    setRejectingId(orderId);
    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        `/store-admin/orders/${orderId}/reject`,
        { reason }
      );

      enqueueSnackbar(response.message || "Pesanan berhasil ditolak", {
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

  const cancelReject = () => {
    setRejectDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setConfirmDialog({
      isOpen: true,
      orderId,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      nextStatus: newStatus,
    });
  };

  const confirmStatusUpdate = async () => {
    const { orderId, nextStatus } = confirmDialog;

    const statusLabels: Record<OrderStatus, string> = {
      WAITING_PAYMENT: "Menunggu Pembayaran",
      WAITING_CONFIRMATION: "Menunggu Konfirmasi",
      CONFIRMED: "Dikonfirmasi",
      CANCELLED: "Dibatalkan",
      PRESCRIBED: "Dikemas",
      SHIPPED: "Dikirim",
      DELIVERED: "Terkirim",
    };
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

    setApprovingId(orderId);
    try {
      const response = await api.patch<{ success: boolean; message: string }>(
        `/store-admin/orders/${orderId}/status`,
        { status: nextStatus }
      );

      enqueueSnackbar(
        response.message || `Status pesanan berhasil diubah menjadi ${statusLabels[nextStatus]}`,
        { variant: "success" }
      );

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

  const cancelStatusUpdate = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <StatusConfirmDialog
        isOpen={confirmDialog.isOpen}
        currentStatus={confirmDialog.currentStatus}
        nextStatus={confirmDialog.nextStatus}
        orderNumber={confirmDialog.orderNumber}
        onConfirm={confirmStatusUpdate}
        onCancel={cancelStatusUpdate}
      />

      <RejectDialog
        isOpen={rejectDialog.isOpen}
        orderNumber={rejectDialog.orderNumber}
        onConfirm={confirmReject}
        onCancel={cancelReject}
      />
      
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Manajemen Pesanan
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Kelola Pesanan Toko
          </h1>
          <p className="text-sm text-slate-500">
            Mengelola toko: <b>{session?.user?.storeName || "Loading..."}</b>
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
          onUpdateStatus={handleUpdateStatus}
          onPageChange={fetchOrders}
        />
      </div>
    </>
  );
}