"use client"

import { Plus, Search, Store, X } from "lucide-react"
import StoreGrid from "./components/StoreGrid"
import { useEffect, useState } from "react";
import StoreModal from "./components/StoreModal";
import { deleteStore, getStore } from "@/services/store.service";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { StoreProps } from "./types/store";

function StoreManagementPage() {
  const { data: session, status, update } = useSession();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedStore, setSelectedStore] = useState<StoreProps | null>(null);

  const handleAddStore = () => {
    setRefreshKey(prev => prev + 1);
  };

  const store = async () => {
    try {
      const data = await getStore(session?.accessToken!);

      setStores(data.data)

      console.log(data.data)
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

  const openEditModal = (store: StoreProps) => {
    setSelectedStore(store);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    store();
  }, [handleAddStore, session])
  return (
    <div>
        <div className="p-4 border border-black/20 rounded-xl mb-4 flex justify-between items-center">
          <div className="relative flex-1 md:max-w-md">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2`} size={18} />
            <input 
              type="text" 
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama toko..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white focus:border-[#22C55E] transition-all text-sm font-semibold" 
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
          onEditStore={openEditModal}
        />

        {isAddModalOpen && (
          <StoreModal isOpen={isAddModalOpen} isClose={() => setIsAddModalOpen(false)} onSuccess={handleAddStore} initialData={selectedStore}/>
        )}
    </div>
  )
}

export default StoreManagementPage
