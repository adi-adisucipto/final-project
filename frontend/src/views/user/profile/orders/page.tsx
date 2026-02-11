"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { orderService } from "@/services/checkout.service";
import { OrderDetail } from "@/types/checkout";
import OrderCard from "@/components/OrderCard";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import { ShoppingBag } from "lucide-react";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/SearchInput";

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [searchQuery, setSearchQuery] = useState("");

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

  const statusFilteredOrders = orders.filter((order) => {
    if (filter === "ongoing") {
      return ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "CONFIRMED", "PRESCRIBED", "SHIPPED"].includes(order.status);
    }
    if (filter === "completed") {
      return ["DELIVERED", "CANCELLED"].includes(order.status);
    }
    return true;
  });

  const filteredOrders = statusFilteredOrders.filter((order) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    
    if (order.orderNumber?.toLowerCase().includes(query)) {
      return true;
    }
    const hasMatchingProduct = order.items?.some((item) =>
      item.product?.name?.toLowerCase().includes(query)
    );
    if (hasMatchingProduct) {
      return true;
    }
    if (order.status?.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleOrderClick = (order: OrderDetail) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="flex min-h-screen flex-col md:flex-row gap-4 p-3 md:p-6">
        <div className="flex-1 p-0 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="flex-1 w-full">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by order number or product name"
              />
            </div>
          <div className="flex gap-2 shrink-0">
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
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => handleOrderClick(order)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredOrders.length}
                  />
                </div>
              )}
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