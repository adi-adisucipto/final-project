"use client"

import { useEffect, useState } from 'react';
import AddressForm from './components/AddressForm'
import { deleteAddress, getAddress, getAddressById } from '@/services/address.services';
import { useSession } from 'next-auth/react';
import { MapPin } from 'lucide-react';
import ConfirmDialog from './components/ConfirmDialog';
import { Ring } from 'react-css-spinners';
import { enqueueSnackbar } from 'notistack';
import { AddressProps } from './types/types';
import EditDialog from './components/EditDialog';

function AddressPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [address, setAddress] = useState<AddressProps[]>([]);
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<AddressProps>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddressAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const addressUser = async () => {
    try {
      const userId = session?.user?.id || "";
      const { data } = await getAddress(userId);

      setAddress(data);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    addressUser();
  }, [handleAddressAdded, session])

  const handelDelete = async (addressId:string) => {
    try {
      const { message } = await deleteAddress(addressId);

      enqueueSnackbar(message, {variant: "success"})
    } catch (error) {
      console.log(error)
    }
  }

  const handelAddress = async (addressId:string) => {
    try {
      const {data} = await getAddressById(addressId);
      setInitialData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="">
      <div className={`w-full p-4 shadow-xl rounded-xl border border-black/20 mb-7.5 ${address.length === 0 ? "hidden" : "flex"}`}>
        <div className='w-full'>{address.map((item, index) => (
          <div key={index} className='flex flex-col gap-1 w-full'>
            <div className='flex flex-col'>
              <div className='flex justify-between items-center'>
                <h2 className='text-[24px] font-semibold flex items-center gap-2'>
                  {`${item.first_name} ${item.last_name}`}
                  <div>{item.is_main_address && (
                    <div className='bg-green-100 text-[10px] text-green-500 font-medium py-1 px-2 rounded-xl w-25 flex justify-center items-center'>
                      Main Address
                    </div>
                  )}</div>
                </h2>
                
                <div className='flex gap-6'>
                  <div>
                    <button 
                      onClick={() => handelAddress(item.id)}
                      className='text-green-500 hover:underline font-medium cursor-pointer'
                    >
                      Edit
                    </button>
                  </div>

                  <div className='text-red-500 font-semibold hover:underline cursor-pointer'>
                        <ConfirmDialog
                            onConfirm={() => handelDelete(item.id)}
                            trigger={
                                <button 
                                    type="button"
                                    className="rounded-md" 
                                    disabled={isLoading}
                                >
                                    {!isLoading ? (<span>Delete</span>) : (
                                        <div className="h-full w-full flex justify-center items-center">
                                            <Ring size={17} thickness={3} color="#FFFFFF"/>
                                        </div>
                                    )}
                                </button>
                            }
                            action='Delete'
                            cancel='Cancel'
                        />
                    </div>
                </div>
              </div>

              <div className='flex gap-1 items-center w-[80%]'>
                <MapPin size={20} className='xl:flex hidden'/>
                {item.address}
              </div>
            </div>
            {index < address.length - 1 && (
              <hr className="my-4 border-slate-200"/>
            )}
          </div>
        ))}</div>

        {isModalOpen && initialData && (
          <EditDialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={initialData}
          />
          )}
      </div>

      <div className="flex flex-col gap-1.25 mb-5">
        <h3 className="text-[24px] font-semibold">Add New Address</h3>
        <hr />
      </div>
      <AddressForm onSuccess={handleAddressAdded}/>
    </div>
  )
}

export default AddressPage
