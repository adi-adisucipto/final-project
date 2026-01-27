import { X } from "lucide-react";
import { StoreProps } from "../sections/StoreBar";

interface ModalStoreProps {
    onClose: () => void;
    stores: StoreProps[];
    onSelect: (store:StoreProps) => void;
}

function ModalStore({onClose, stores, onSelect}: ModalStoreProps) {
    const handleClick = (store:StoreProps) => {
        onSelect(store);
        onClose();
    }
  return (
    <div className="fixed inset-0 overflow-hidden z-100 flex justify-center items-center w-full px-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/40" onClick={onClose}></div>

      <div className="bg-white relative max-w-xl w-xl mx-auto rounded-xl">
        <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-xl font-bold">Pilih Toko</h3>
            <button onClick={onClose} className="hover:bg-slate-100 p-2 rounded-md cursor-pointer"><X size={20}/></button>
        </div>

        <div className="w-full">
            {stores.map((store) => (
                <button onClick={() => handleClick(store)} key={store.id} className="hover:bg-slate-100 text-left p-4 rounded-b-xl cursor-pointer leading-4 w-full">
                    <p>{store.name}</p>
                    <span className="text-slate-400 text-sm">Jarak: {(store.distance.toFixed(2))} km</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ModalStore
