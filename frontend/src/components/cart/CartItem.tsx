"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import QuantityControl from "./QuantityControl";

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  onRemove: (cartItemId: string) => Promise<void>;
}

export default function CartItem({
  id,
  productId,
  name,
  image,
  price,
  quantity,
  stock,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleIncrease = async () => {
    if (quantity >= stock) {
      alert(`Stok hanya tersisa ${stock}`);
      return;
    }
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(id, quantity + 1);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (quantity === 1) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateQuantity(id, quantity - 1);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove(id);
    } catch (error) {
      console.error("Failed to remove item:", error);
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={image || "/placeholder-product.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {stock < 10 && stock > 0 && (
              <span className="text-orange-500">Stok tersisa {stock}</span>
            )}
            {stock === 0 && (
              <span className="text-red-500">Stok habis</span>
            )}
          </p>
          <p className="font-semibold text-gray-900 mt-2">
            {formatPrice(price)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isUpdating}
            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <QuantityControl
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            disabled={isUpdating || stock === 0}
            max={stock}
          />
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Hapus Item?</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus item ini dari keranjang?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isUpdating ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}