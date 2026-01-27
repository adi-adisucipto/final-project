"use client"

import { MapPin } from 'lucide-react'
import useGeolocation from '@/hooks/useGeolocation'
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { nearStore } from '@/services/nearStores';
import ModalStore from '../components/ModalStore';

export interface StoreProps {
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    distance: number
}

function StoreBar() {
    const { loaded, coordinates, error: geoError } = useGeolocation();
    const [stores, setStores] = useState<StoreProps[]>([]);
    const [store, setStore] = useState<StoreProps | null>(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if(loaded && coordinates && coordinates.lat && coordinates.lng) {
            const storeNear = async () => {
                try {
                    const fetchStores = await nearStore(Number(coordinates.lat), Number(coordinates.lng))

                    setStores(fetchStores);
                    if (fetchStores && fetchStores.length > 0) {
                        setStore(fetchStores[0]);
                    }
                } catch (error:any) {
                    enqueueSnackbar(error.message || "Gagal mengambil data toko", { variant: "error" });
                }
            };

            storeNear();
        }
    }, [loaded, coordinates]);

    useEffect(() => {
        if (geoError) {
            enqueueSnackbar(geoError.message, { variant: "error" });
        }
    }, [geoError]);
  return (
    <div className='px-4 xl:px-0'>
        <div className='w-full p-4 rounded-2xl bg-[#122017] flex justify-between items-center xl:mt-8 mt-4'>
            <div className='flex xl:gap-4 gap-2 items-center'>
                <div className='p-1.5 bg-[#22C55E]/10 rounded-full text-white'>
                    <MapPin/>
                </div>
                <p className='text-white/70 flex gap-1'>
                    <span className='xl:flex hidden'>Shopping at:</span><span className='text-white font-bold'>{store ? store.name : 'Loading...'}</span>
                </p>
            </div>

            <button className='cursor-pointer text-[#22C55E] hover:underline font-bold' onClick={() => setOpenModal(!openModal)}>
                Change Store
            </button>
        </div>

        {openModal && (
            <div>
                <ModalStore
                    onClose={() => setOpenModal(false)}
                    stores={stores}
                    onSelect={(store) => setStore(store)}
                />
            </div>
        )}
    </div>
  )
}

export default StoreBar
