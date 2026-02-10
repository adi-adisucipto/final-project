"use client";

import { ShippingService } from "@/services/shipping.service";

interface ShippingMethodSelectorProps {
  services: ShippingService[];
  selectedService: ShippingService | null;
  onSelect: (service: ShippingService) => void;
  isLoading?: boolean;
}

export default function ShippingMethodSelector({
  services,
  selectedService,
  onSelect,
  isLoading = false,
}: ShippingMethodSelectorProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pilih Pengiriman</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Pilih Pengiriman</h3>
        <p className="text-gray-500">Tidak ada layanan pengiriman tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Pilih Pengiriman</h3>
      <div className="space-y-3">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => onSelect(service)}
            className={`w-full p-4 border rounded-lg text-left transition-all ${
              selectedService?.service === service.service
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{service.service}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Estimasi: {service.cost[0]?.etd} hari
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">
                  Rp {service.cost[0]?.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}