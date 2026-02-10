"use client"

import useGeolocation from '@/hooks/useGeolocation'
import Categories from './sections/Categories'
import Hero from './sections/Hero'
import Products from './sections/Products'
import StoreBar, { StoreProps } from './sections/StoreBar'
import { useEffect, useState } from 'react';
import { mainStore, nearStore } from '@/services/nearStores';
import { enqueueSnackbar } from 'notistack';
import ModalStore from './components/ModalStore'

function LandingPage() {
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

            const storeMain = async () => {
                const fetchStore = await mainStore();
                setStore(fetchStore.store)
                console.log(store)
            }

            storeMain();
        }
    }, [geoError]);

  useEffect(() => {
    if (!store?.id) return;
    window.localStorage.setItem("selectedStoreId", store.id);
  }, [store]);

  return (
    <div>
      <Hero/>
      <Categories/>
      <StoreBar 
        currentStore={store} 
        onOpenModal={() => setOpenModal(true)}
      />
      {store && <Products storeId={store.id} onOpenModal={() => setOpenModal(true)}/>}

      {openModal && (
        <ModalStore
          onClose={() => setOpenModal(false)}
          stores={stores}
          onSelect={(selectedStore: StoreProps) => {
            setStore(selectedStore);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  )
}

export default LandingPage
