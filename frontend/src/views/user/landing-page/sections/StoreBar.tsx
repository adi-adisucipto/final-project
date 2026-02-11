"use client"

import { MapPin } from 'lucide-react'

export interface StoreProps {
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    distance: number
}

export interface StoreBarProps {
    currentStore: StoreProps | null;
    onOpenModal: () => void;
}

function StoreBar({ currentStore, onOpenModal } : StoreBarProps) {
    
  return (
    <div className='px-4 xl:px-0'>
        <div className='w-full p-4 rounded-2xl bg-[#122017] flex justify-between items-center xl:mt-8 mt-4'>
            <div className='flex xl:gap-4 gap-2 items-center'>
                <div className='p-1.5 bg-[#22C55E]/10 rounded-full text-white'>
                    <MapPin/>
                </div>
                <p className='text-white/70 flex gap-1'>
                    <span className='xl:flex hidden'>Shopping at:</span><span className='text-white font-bold'>{currentStore ? currentStore.name : 'Loading...'}</span>
                </p>
            </div>

            <button className='cursor-pointer text-[#22C55E] hover:underline font-bold' onClick={onOpenModal}>
                Change Store
            </button>
        </div>
    </div>
  )
}

export default StoreBar
