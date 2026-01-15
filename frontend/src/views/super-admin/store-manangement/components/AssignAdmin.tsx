"use client"

import { Check, Search, Store, User, UserPlus, X } from "lucide-react";
import { StoreAdmin, StoreProps } from "../types/store";
import { useEffect, useState } from "react";
import { getAdmins } from "@/services/store.service";
import { useSession } from "next-auth/react";

interface AssignAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreProps | null;
  onAssign: (admin: StoreAdmin) => void;
}

function AssignAdmin({isOpen, onClose, store, onAssign}: AssignAdminModalProps) {
    const { data: session, status, update } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [admin, setAdmin] = useState<StoreAdmin[]>([]);
    
    useEffect(() => {
        const admins = async () => {
            try {
                const { data } = await getAdmins();

                setAdmin(data);
            } catch (error) {
                console.log(error);
            }
        }

        admins();
    }, [searchQuery]);
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity flex justify-center items-center">
            <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <UserPlus size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Pilih Admin Toko</h3>
                            <p className="text-xs text-slate-500 font-medium">Admin untuk Toko <span className="font-bold">{store?.name}</span></p>
                        </div>
                    </div>
                    <button 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari nama atau email admin..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-[#22C55E] transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {admin.length > 0 ? (
                        <div className="space-y-1">
                        {admin.map((admin) => {
                            const isCurrentAdmin = store?.admins?.user.email === admin.email;
                            return (
                            <button
                                key={admin.email}
                                onClick={() => {
                                    onAssign(admin);
                                    onClose();
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                                    isCurrentAdmin 
                                        ? 'bg-green-50 border border-green-100' 
                                        : 'hover:bg-slate-50 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-left">
                                        <div className={`text-sm font-bold ${isCurrentAdmin ? 'text-green-900' : 'text-slate-900'}`}>
                                            {admin.first_name} {admin.last_name}
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-medium">
                                            {admin.email}
                                        </div>
                                    </div>
                                </div>
                                
                                {isCurrentAdmin ? (
                                    <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center text-white">
                                        <Check size={14} />
                                    </div>
                                ) : (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        Select
                                    </div>
                                )}
                            </button>
                            );
                        })}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <User size={48} strokeWidth={1} className="mb-2 opacity-20" />
                            <p className="text-sm font-medium">Admin tidak ditemukan</p>
                        </div>
                    )}
                    </div>
                </div>
        </div>
    </div>
  )
}

export default AssignAdmin
