"use client"

import { Plus, Search, Store, X } from "lucide-react"
import StoreGrid from "./components/StoreGrid"
import { useEffect, useState } from "react";
import StoreModal from "./components/StoreModal";
import { activateStore, assignAdmin, deleteStore, getStore } from "@/services/store.service";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { StoreAdmin, StoreProps } from "./types/store";
import AssignAdmin from "./components/AssignAdmin";

function StoreManagementPage() {
  const { data: session, status, update } = useSession();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedStore, setSelectedStore] = useState<StoreProps | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleAddStore = () => {
    setRefreshKey(prev => prev + 1);
  };

  const store = async () => {
    try {
      const data = await getStore(session?.accessToken!);

      setStores(data.data)
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id:string) => {
    try {
      await deleteStore(id, session?.accessToken!);

      enqueueSnackbar("Berhasil Menghapus Toko", {variant: "success"})
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const {message} = await activateStore(id);

      enqueueSnackbar(message, {variant: "success"})
    } catch (error) {
      console.log(error);
    }
  }

  const openEditModal = (store: StoreProps) => {
    setSelectedStore(store);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    store();
  }, [handleAddStore, session])

  const openAssignModal = (store: StoreProps) => {
    setSelectedStore(store);
    setIsAssignModalOpen(true);
  };

  const handleAssignAdmin = async (admin: StoreAdmin) => {
    try {
      if (selectedStore) {
        await assignAdmin(admin.id, selectedStore.id, session?.accessToken!)
      }
      enqueueSnackbar("Berhasil!", {variant: "success"})
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
        <div className="p-2 border border-black/20 rounded-xl mb-4 flex justify-between items-center">
          <div className="relative flex-1 md:max-w-md">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2`} size={18} />
            <input 
              type="text" 
              placeholder="Cari nama toko..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-[#22C55E] transition-all text-sm font-semibold" 
            />
          </div>
          <button
            className="bg-green-500 py-2 px-3 rounded-xl text-white group cursor-pointer shadow-xl shadow-green-100 flex gap-2 justify-center items-center font-semibold hover:bg-green-600"
            onClick={() => {setIsAddModalOpen(true); setSelectedStore(null)}}
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300"/>
            <span>Daftarkan Toko Baru</span>
          </button>
        </div>
        <StoreGrid
          stores={stores}
          onDelete={(id) => handleDelete(id)}
          onActive={(id) => handleUpdate(id)}
          onEditStore={openEditModal}
          onAssignAdmin={openAssignModal} 
        />

        {isAddModalOpen && (
          <StoreModal isOpen={isAddModalOpen} isClose={() => setIsAddModalOpen(false)} onSuccess={handleAddStore} initialData={selectedStore}/>
        )}

        {isAssignModalOpen && (
          <AssignAdmin
            isOpen={isAssignModalOpen} 
            onClose={() => setIsAssignModalOpen(false)} 
            store={selectedStore} 
            onAssign={handleAssignAdmin} 
          />
        )}
    </div>
  )
}

export default StoreManagementPage
