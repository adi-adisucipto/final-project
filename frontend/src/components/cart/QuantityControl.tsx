"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  max?: number;
}

export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  max,
}: QuantityControlProps) {
  const isMinDisabled = disabled || quantity <= 1;
  const isMaxDisabled = disabled || (max !== undefined && quantity >= max);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        disabled={isMinDisabled}
        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="min-w-[32px] text-center font-medium">{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={isMaxDisabled}
        className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}