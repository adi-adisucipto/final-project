"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
  onApprove: (orderId: string) => Promise<void>;
  onReject: (orderId: string) => Promise<void>;
}

export default function OrderCard({
  order,
  onApprove,
  onReject,
}: OrderCardProps) {
  const [loading, setLoading] = useState(false);

  const userName = `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() || "Unknown User";
  const address = `${order.userAddress.address}, ${order.userAddress.postal_code || ""}`.trim();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(order.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await onReject(order.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500">
            Order ID : {order.orderNumber}
          </span>
          <span className="text-xs text-gray-500">{orderDate}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {userName}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">{address}</p>

        <p className="text-sm font-medium text-emerald-600 mt-2">
          Payment Receipt
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={loading || order.status !== "WAITING_CONFIRMATION"}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>

        <button
          onClick={handleReject}
          disabled={loading || order.status !== "WAITING_CONFIRMATION"}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
}