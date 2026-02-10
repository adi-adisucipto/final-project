"use client";

import { MapPin } from "lucide-react";

interface ShippingAddressProps {
  firstName?: string;
  lastName?: string;
  address?: string;
  onChangeAddress?: () => void;
}

export default function ShippingAddress({
  firstName,
  lastName,
  address,
  onChangeAddress,
}: ShippingAddressProps) {
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : null;

  if (!address) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Alamat Pengiriman Belum Dipilih
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Silakan pilih alamat pengiriman untuk melanjutkan
            </p>
            <button
              onClick={onChangeAddress}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Pilih Alamat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Alamat Pengiriman
            </h3>
            {fullName && (
              <p className="font-medium text-gray-900 mb-1">{fullName}</p>
            )}
            <p className="text-sm text-gray-600">{address}</p>
          </div>
        </div>

        {onChangeAddress && (
          <button
            onClick={onChangeAddress}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium whitespace-nowrap"
          >
            Ubah Alamat
          </button>
        )}
      </div>
    </div>
  );
}