"use client";

import Image from "next/image";
import { OrderItem } from "@/types/checkout";

interface OrderItemsListProps {
  items: OrderItem[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Rincian Pesanan
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
          >
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.image || "/placeholder-product.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{item.storeName}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Subtotal</span>
          <span className="font-bold text-gray-900">
            {formatPrice(calculateSubtotal())}
          </span>
        </div>
      </div>
    </div>
  );
}