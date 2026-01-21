"use client";

import { Check } from "lucide-react";
import { PaymentMethod } from "@/types/checkout";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      id: "TRANSFER" as PaymentMethod,
      name: "Transfer Manual",
      description: "Upload bukti transfer setelah pembayaran",
      icon: "🏦",
    },
    {
      id: "COD" as PaymentMethod,
      name: "Bayar di Tempat (COD)",
      description: "Bayar saat barang diterima",
      icon: "💵",
    },
  ];
  return (
    <div className="bg-white border-2 border-cyan-400 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Metode Pembayaran
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}