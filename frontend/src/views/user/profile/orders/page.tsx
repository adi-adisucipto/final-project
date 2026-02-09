"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { orderService } from "@/services/checkout.service";
import { OrderDetail } from "@/types/checkout";
import OrderCard from "@/components/OrderCard";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import { ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  const filteredOrders = orders.filter((order) => {
    if (filter === "ongoing") {
      return ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "CONFIRMED", "PRESCRIBED", "SHIPPED"].includes(order.status);
    }
    if (filter === "completed") {
      return ["DELIVERED", "CANCELLED"].includes(order.status);
    }
    return true;
  });

  const handleOrderClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen gap-6 p-6">
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen gap-6 p-6">
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("ongoing")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "ongoing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Completed
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === "all" ? "Belum ada pesanan" : `Tidak ada pesanan ${filter === "ongoing" ? "yang sedang berjalan" : "yang selesai"}`}
              </h2>
              <p className="text-gray-500 mb-6">
                Yuk mulai belanja dan buat pesanan pertamamu!
              </p>
              <button
                onClick={() => router.push("/products")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => handleOrderClick(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}