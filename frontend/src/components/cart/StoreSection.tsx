"use client";

import { MapPin } from "lucide-react";
import CartItem from "./CartItem";

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{ imageUrl: string }>;
  };
}

interface StoreSectionProps {
  storeName: string;
  storeAddress?: string;
  distance?: number;
  items: CartItemData[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  onRemove: (cartItemId: string) => Promise<void>;
}

export default function StoreSection({
  storeName,
  storeAddress,
  distance,
  items,
  onUpdateQuantity,
  onRemove,
}: StoreSectionProps) {
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="border-2 border-cyan-400 rounded-lg overflow-hidden mb-4">
      <div className="bg-cyan-50 px-4 py-3 border-b border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Dikirim Dari</p>
            <p className="font-semibold text-gray-900">
              {storeName}
              {distance && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({distance.toFixed(2)} KM)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white px-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            productId={item.product.id}
            name={item.product.name}
            image={item.product.images[0]?.imageUrl || ""}
            price={Number(item.product.price)}
            quantity={item.quantity}
            stock={99}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Subtotal</span>
          <span className="font-semibold text-gray-900">
            {formatPrice(calculateSubtotal())}
          </span>
        </div>
      </div>
    </div>
  );
}