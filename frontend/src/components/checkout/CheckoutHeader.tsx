"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutHeaderProps {
  currentStep?: number;
}

export default function CheckoutHeader({ currentStep = 2 }: CheckoutHeaderProps) {
  const router = useRouter();

  const steps = [
    { label: "Cart", step: 1 },
    { label: "Checkout", step: 2 },
    { label: "Confirmation", step: 3 },
  ];

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
        <div className="flex items-center justify-between max-w-2xl">
          {steps.map((item, index) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    item.step < currentStep
                      ? "bg-emerald-500 text-white"
                      : item.step === currentStep
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {item.step < currentStep ? "✓" : item.step}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    item.step <= currentStep
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    item.step < currentStep
                      ? "bg-emerald-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}