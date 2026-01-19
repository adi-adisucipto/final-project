"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface AddOnProductProps {
  id: string;
  name: string;
  category?: string;
  image: string;
  price: number;
  onAddToCart: (productId: string) => Promise<void>;
}

export default function AddOnProduct({
  id,
  name,
  category,
  image,
  price,
  onAddToCart,
}: AddOnProductProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = async () => {
    try {
      await onAddToCart(id);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <Image
          src={image || "/placeholder-product.png"}
          alt={name}
          fill
          className="object-cover"
        />
        {category && (
          <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-medium px-2 py-1 rounded">
            {category}
          </div>
        )}
      </div>

      <div className="mb-3">
        {category && (
          <p className="text-xs text-gray-500 mb-1">{category}</p>
        )}
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm mb-2">
          {name}
        </h3>
        <p className="font-bold text-gray-900">{formatPrice(price)}</p>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        Add Cart
      </button>
    </div>
  );
}