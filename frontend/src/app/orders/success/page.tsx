"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Package, Home } from "lucide-react";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    const timer = setTimeout(() => {
    router.push("/");
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-lineat-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesanan Berhasil Dibuat! 🎉
          </h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di toko kami
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nomor Pesanan</p>
              <p className="font-semibold text-gray-900">
                {orderNumber || (orderId ? `#${orderId.toUpperCase()}` : "#ORDER")}
              </p>
            </div>
          </div>

          <div className="text-center py-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-medium text-blue-900">Status: Menunggu Konfirmasi</p>
            <p className="text-xs text-blue-700">
            Pesanan Anda sedang diproses
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-6 rounded-xl transition-colors border border-gray-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}