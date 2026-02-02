"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface PaymentProofUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  total: number;
}

export default function PaymentProofUpload({
  file,
  onFileSelect,
  total,
}: PaymentProofUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      if (selectedFile.size > 1 * 1024 * 1024) {
        alert("File size must be less than 1MB");
        return;
      }

      onFileSelect(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setPreview(null);
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
        Upload Bukti Transfer
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Transfer ke:</p>
        <div className="space-y-1">
          <p className="font-semibold text-gray-900">Bank BCA</p>
          <p className="text-gray-700">1234567890</p>
          <p className="text-gray-700">a.n. PT Toko Sehat Indonesia</p>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-sm text-gray-600">Total yang harus dibayar:</p>
          <p className="text-xl font-bold text-gray-900">
            {formatPrice(total)}
          </p>
        </div>
      </div>
      {!file ? (
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              Drag & Drop atau Click untuk Upload
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG atau JPEG (Max 1MB)
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            {preview && (
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={preview}
                  alt="Payment proof preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemove}
                  className="text-red-500 hover:text-red-600 p-1"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="inline-block mt-2">
                <span className="text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer font-medium">
                  Ganti File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        💡 Pastikan bukti transfer jelas dan mudah dibaca
      </p>
    </div>
  );
}