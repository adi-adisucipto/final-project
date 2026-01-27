"use client"

import { motion } from "framer-motion"
import { LogIn, MapPin, SquarePen, Store, Trash, User, UserPlus } from "lucide-react";
import { useState } from "react"
import { StoreCardProps } from "../types/store";
import Image from "next/image";
import ConfirmDialog from "@/views/user/address/components/ConfirmDialog";
import { Ring } from "react-css-spinners";

function StoreCard({
    store,
    index,
    onDelete,
    onActive,
    onEditStore,
    onAssignAdmin
}:StoreCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  return (
    <motion.div
        className="w-full h-65"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index % 4) * 0.1, duration: 0.5, ease: "easeOut" }}
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full ransition-all duration-500 transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
            className="absolute inset-0 rounded-xl border border-slate-200 backface-hidden p-4 flex flex-col justify-between bg-white"
        >
            <div className='flex justify-between items-center'>
                <div className={`w-12 h-12 rounded-[10px] flex justify-center items-center ${store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <Store/>
                </div>

                <div className={`px-2.5 py-1 rounded-xl font-bold text-[12px] ${store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {store.isActive ? "Buka" : "Tutup"}
                </div>
            </div>

            <div className='flex flex-col gap-1 w-[90%]'>
                <h3 className='text-[20px] font-bold leading-tight line-clamp-1'>{store.name}</h3>

                <div className='flex gap-2 items-start'>
                    <MapPin size={16} className="shrink-0 mt-0.5 text-black/50"/>
                    <p className='line-clamp-2 leading-relaxed text-black/50 text-[14px]'>{store.address}</p>
                </div>
            </div>

            <div className='pt-4 border-t border-slate-100 flex justify-between items-center'>
                <div className='flex items-center gap-2 font-semibold text-[14px]'>
                    <div className='w-8 h-8 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center relative'>
                        {store.admins?.user.avatar ? (
                            <Image src={store.admins?.user.avatar} fill={true} alt="avatar" className="rounded-full absolute"/>
                        ) : (
                            <User size={18}/>
                        )}
                    </div>

                    <span>{store.admins?.user.first_name ? (`${store.admins.user.first_name}  ${store.admins.user.last_name}`) : "No Admin"}</span>
                </div>
            </div>
        </div>

        <div
            className="absolute inset-0 rounded-xl bodrer border border-slate-200 backface-hidden rotate-y-180 flex flex-col gap-2 justify-center items-center bg-slate-800"
        >
            <p className='text-slate-400 font-bold tracking-widest'>ADMIN TOKO</p>

            <div>
                {store.admins?.user.first_name ? (
                    <div className='w-10 h-10 rounded-full bg-green-100 text-green-500 flex justify-center items-center relative'>
                        {store.admins?.user.avatar ? (
                            <Image src={store.admins.user.avatar} fill={true} alt="avatar" className="rounded-full absolute" />
                        ) : (
                            <User size={20}/>
                        )}
                    </div>
                ) : (
                    <p className='text-slate-500'>Belum Ada Admin</p>
                ) }
            </div>

            <div className='text-center'>
                {store.admins?.user.first_name && (
                    <div>
                        <p className='text-white font-semibold'>{store.admins?.user.first_name} {store.admins.user.last_name}</p>
                        <p className='text-white/50 text-[12px]'>{store.admins?.user.email}</p>
                    </div>
                )}
            </div>

            <div className='flex gap-4'>
                <button
                    type='button'
                    className='text-white text-[12px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-2 rounded-md cursor-pointer font-bold transition-colors border border-slate-700'
                    onClick={(e) => { e.stopPropagation(); onEditStore?.(store); }}
                >
                    <SquarePen size={14}/>
                    Edit
                </button>

                <button
                    type='button'
                    className='text-white text-[12px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-2.5 rounded-md cursor-pointer font-bold transition-colors border border-slate-700'
                    onClick={(e) => { e.stopPropagation(); onAssignAdmin?.(store); }}
                >
                    <UserPlus size={14}/>
                    Admin
                </button>

                <div className='text-[12px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 p-2.5 rounded-md cursor-pointer font-bold transition-colors border border-slate-700'>
                    {store.isActive ? (
                        <ConfirmDialog
                            onConfirm={() => onDelete(store.id)}
                            trigger={
                                <button 
                                    type="button"
                                    className="rounded-md" 
                                    disabled={isLoading}
                                >
                                    {!isLoading ? (<span className="flex gap-2 items-center justify-center text-red-400 ">
                                        <Trash size={14}/> Delete
                                    </span>) : (
                                        <div className="h-full w-full flex justify-center items-center">
                                            <Ring size={17} thickness={3} color="#FFFFFF"/>
                                        </div>
                                    )}
                                </button>
                            }
                            action='Delete'
                            cancel='Cancel'
                        />
                    ) : (
                        <ConfirmDialog
                            onConfirm={() => onActive(store.id)}
                            trigger={
                                <button 
                                    type="button"
                                    className="rounded-md" 
                                    disabled={isLoading}
                                >
                                    {!isLoading ? (<span className="flex gap-2 items-center justify-center text-green-500">
                                        <LogIn size={14}/> Activate
                                    </span>) : (
                                        <div className="h-full w-full flex justify-center items-center">
                                            <Ring size={17} thickness={3} color="#FFFFFF"/>
                                        </div>
                                    )}
                                </button>
                            }
                            action='Activate'
                            cancel='Cancel'
                        />
                    )}
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default StoreCard
