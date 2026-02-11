"use client"

import { Button } from "@/components/ui/button";
import useGeolocation from "@/hooks/useGeolocation";
import { citiesService, provinceService } from "@/services/address.services";
import { createStore, updateStore } from "@/services/store.service";
import ConfirmDialog from "@/views/user/address/components/ConfirmDialog";
import DropDown from "@/views/user/address/components/DropDown";
import { CitiesItem, ProvinceItem } from "@/views/user/address/types/types";
import { Field, Form, Formik } from "formik";
import { Activity, Map, MapPin, Store, StoreIcon, User, X } from "lucide-react"
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Ring } from "react-css-spinners";
import { StoreProps } from "../types/store";

interface StoreModalProps {
    isOpen?: boolean;
    isClose: () => void;
    onSuccess: () => void;
    initialData: StoreProps | null;
}

interface FormProps {
    name: string;
    address: string;
    isActive: boolean;
    provinceId: number;
    cityId: number;
    latitude: number;
    longitude: number;
    postalCode: string;
}

function StoreModal({
    isOpen,
    isClose,
    onSuccess,
    initialData
} : StoreModalProps) {
    const { data: session, status, update } = useSession();
    const { loaded, coordinates, error } = useGeolocation();
    const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
    const [cities, setCities] = useState<CitiesItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues: FormProps = {
        name: initialData ? initialData.name : "",
        address: initialData ? initialData.address : "",
        isActive: initialData ? initialData.isActive : false,
        provinceId: initialData ? initialData.provinceId : 0,
        cityId: initialData ? initialData.cityId : 0,
        latitude: initialData ? initialData.latitude : 0,
        longitude: initialData ? initialData.longitude : 0,
        postalCode: initialData ? initialData.postalCode : ""
    }

    useEffect(() => {
        if(initialData?.provinceId) {
            getCitiesByProvinces(initialData.provinceId);
        }
    }, [initialData]);

    useEffect(() => {
        const provinces = async () => {
            try {
                const { data } = await provinceService();
                setProvinces(data);
            } catch (error) {
                console.log(error)
            }
        }
        provinces();
    }, []);

    const getCitiesByProvinces = async (provinceId: number) => {
        try {
            const { data } = await citiesService(provinceId);
            setCities(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getAddress = async (lat:number | string, lng:number | string) => {
        const API_KEY = "76279c047d104f878b5ce75a71354e94"; 

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=id&pretty=1`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0];
            } else {
                throw new Error("Lokasi tidak ditemukan");
            }
        } catch (error) {
            console.error("Error OpenCage:", error);
        }
    };

    const handleSubmit = async (values: FormProps) => {
        setIsLoading(true)
        try {
            if(initialData?.id) {
                await updateStore(
                    initialData.id,
                    values.name,
                    values.isActive,
                    values.address,
                    values.latitude,
                    values.longitude,
                    values.cityId,
                    values.provinceId,
                    values.postalCode,
                    session?.accessToken!
                )
                enqueueSnackbar("Berhasil mengubah data toko", {variant: "success"})
            } else {
                await createStore(
                    values.name,
                    values.isActive,
                    values.address,
                    values.latitude,
                    values.longitude,
                    values.cityId,
                    values.provinceId,
                    values.postalCode,
                    session?.accessToken!
                )
                enqueueSnackbar("Data Toko Berhasil Ditambahkan", {variant: "success"});
            }
            setIsLoading(false);
            isClose();
            onSuccess()
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }
  return (
    <Formik<FormProps>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
    >
        {({values, setFieldValue, submitForm}) => {
            return (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity flex justify-center items-center">
                        <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in duration-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                                        <Store size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Tambah Toko Baru</h3>
                                        <p className="text-xs text-slate-500 font-medium">Lengkapi informasi dan tentukan lokasi peta.</p>
                                    </div>
                                </div>
                                <button 
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                    onClick={isClose}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <Form className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                    <label className="flex gap-2 items-center text-black/60 font-semibold text-sm">
                                        <StoreIcon size={16}/> Nama Toko
                                    </label>
                                    <Field
                                        type="text"
                                        name="name"
                                        className="h-10 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none transition-all"
                                        placeholder="Contoh: Groceria Jakarta Pusat"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="flex gap-2 items-center text-black/60 font-semibold text-sm"><MapPin size={16}/>Province</label>
                                    <DropDown<ProvinceItem>
                                        items={provinces}
                                        labelKey="province_name"
                                        placeholder="Find Province..."
                                        value={values.provinceId}
                                        onSelect={async (item) => {
                                            setFieldValue("provinceId", item.id);
                                            setFieldValue("cityId", ""); 
                                            setCities([]);
                                            await getCitiesByProvinces(item.id)
                                        }}
                                        className="text-sm h-10 px-4"
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="flex gap-2 items-center text-black/60 font-semibold text-sm"><MapPin size={16}/> City</label>
                                    <DropDown<CitiesItem>
                                        items={cities}
                                        labelKey="city_name"
                                        placeholder="Find City..."
                                        value={values.cityId}
                                        onSelect={(item) => setFieldValue("cityId", item.id)}
                                        className="text-sm h-10 px-4"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex justify-between">
                                        <label className="flex gap-2 items-center text-black/60 font-semibold text-sm">
                                            <MapPin size={16}/> Alamat Lengkap
                                        </label>
                                        <button
                                            type="button"
                                            className="flex gap-1 justify-center items-center text-[12px] cursor-pointer hover:text-blue-500"
                                            onClick={async () => {
                                            if (coordinates && coordinates.lat && coordinates.lng) {
                                                const address = await getAddress(coordinates.lat, coordinates.lng);
                                                if (address) {
                                                    setFieldValue('address', address.formatted);
                                                    setFieldValue('latitude', address.geometry.lat);
                                                    setFieldValue('longitude', address.geometry.lng);
                                                    setFieldValue('postalCode', address.components.postcode);
                                                    console.log(address)
                                                }
                                            } else {
                                                    alert("Koordinat belum tersedia. Pastikan GPS aktif.");
                                                }
                                            }}
                                        >
                                            <MapPin size={14}/> Gunakan Lokasi Saat Ini
                                        </button>
                                    </div>
                                    <Field
                                        as="textarea"
                                        name="address"
                                        className="h-25 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 py-2 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none transition-all"
                                        placeholder="Masukkan alamat lengkap toko"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="flex gap-2 items-center text-black/60 font-semibold text-sm">
                                        <Activity size={16}/> Status Operasional
                                    </label>
                                    <Field
                                        as="select" 
                                        name="isActive"
                                        className="h-10 w-full appearance-none rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none transition-all"
                                    >
                                        <option value="" disabled>-- Pilih Status --</option>
                                        
                                        <option value="true">🟢 Buka</option>
                                        <option value="false">⚪ Tutup</option>
                                    </Field>
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" className="px-4 py-1 rounded-md cursor-pointer hover:bg-slate-100" onClick={isClose}>Batal</button>
                                    <ConfirmDialog
                                        onConfirm={submitForm}
                                        trigger={
                                            <Button 
                                                type="button"
                                                className="rounded-md" 
                                                disabled={isLoading}
                                            >
                                                {!isLoading ? (<span>Submit Address</span>) : (
                                                    <div className="h-full w-full flex justify-center items-center">
                                                        <Ring size={17} thickness={3} color="#FFFFFF"/>
                                                    </div>
                                                )}
                                            </Button>
                                        }
                                        action="Save Address"
                                        cancel="Cancel"
                                    />
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )
        }}
    </Formik>
  )
}

export default StoreModal
