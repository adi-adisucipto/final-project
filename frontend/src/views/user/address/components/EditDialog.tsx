"use client"

import { AddressProps } from "../types/types";
import { X } from "lucide-react";
import AddressForm from "./AddressForm";
import { Form, Formik } from "formik";

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: AddressProps;
    // onSave: (data: AddressProps) => void;
}

function EditDialog({isOpen, onClose, initialData}: EditDialogProps) {
    const initialValues = {
        first_name: initialData.first_name
    }

    const handleSubmit = async () => {
        console.log("Adi")
    }
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
    >
        <Form className={`${isOpen ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm' : 'hidden'}`}>
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
                    
                </div>
            </div>
        </Form>
    </Formik>
  )
}

export default EditDialog
