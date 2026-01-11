"use client"

import { AddressProps } from "../types/types";
import { X } from "lucide-react";
import AddressForm from "./AddressForm";

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: AddressProps;
}

function EditDialog({isOpen, onClose, initialData}: EditDialogProps) {
  return (
    <div className={`${isOpen ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm overflow-y-auto' : 'hidden'}`}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Edit Halaman</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Perbarui alamat anda</p>
                </div>
                <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <span>
                        <X/>
                    </span>
                </button>
            </div>

            <div className="px-6 py-5">
                <AddressForm
                    isEdit={true}
                    initialData={initialData}
                    onSuccess={
                        onClose
                    }
                />
            </div>
            </div>
        </div>
  )
}

export default EditDialog