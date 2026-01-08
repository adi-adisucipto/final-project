"use client"

import { Field, Form, Formik } from "formik"
import { useSession } from "next-auth/react";
import DropDown from "./DropDown";
import { useEffect, useState } from "react";
import { SubmitProps, ProvinceItem, CitiesItem } from "../types/types";
import { citiesService, provinceService, userAddress } from "@/services/address.services";
import { Button } from "@/components/ui/button";
import { Ring } from "react-css-spinners";
import { enqueueSnackbar } from "notistack";
import ConfirmDialog from "./ConfirmDialog";

function AddressForm() {
    const { data: session, status, update } = useSession();
    const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
    const [cities, setCities] = useState<CitiesItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const initialValues = {
        firstName: session?.user?.first_name || "",
        lastName: session?.user?.last_name || "",
        provinceId: 0,
        cityId: 0,
        address: "",
        mainAddress: false
    }

    useEffect(() => {
        const provinces = async () => {
            try {
                const { data } = await provinceService();

                setProvinces(data);
            } catch (error) {
                
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

    const handleSubmit = async (values: SubmitProps) => {
        setIsLoading(true)
        try {
            const userId = session?.user?.id || ""
            await userAddress(
                values.firstName,
                values.lastName,
                values.provinceId,
                values.cityId,
                values.address,
                values.mainAddress,
                userId
            );

            enqueueSnackbar("Alamat berhasil ditambahkan", {variant: "success"});
            setIsLoading(false);
            values.address = '',
            values.provinceId = 0;
            values.cityId = 0;
            values.mainAddress = false
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
    >
        {({setFieldValue, values, submitForm}) => {
            return (
                <Form>
                    <div className="flex flex-col gap-1.25 mb-5">
                        <h3 className="text-[24px] font-semibold">Add New Address</h3>
                        <hr />
                    </div>

                    <div className="flex flex-col xl:flex-row xl:gap-5 gap-6 w-full">
                        <div className="flex flex-col gap-2 xl:w-[50%]">
                            <label className="text-[20px] font-semibold">First Name</label>
                            <Field
                                type="text"
                                name="firstName"
                                className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 ${!session?.user?.is_verified ? "text-black/50": ""}`}
                                disabled={!session?.user?.is_verified}
                            />
                        </div>

                        <div className="flex flex-col gap-2 xl:w-[50%]">
                            <label className="text-[20px] font-semibold">Last Name</label>
                            <Field
                                type="text"
                                name="lastName"
                                className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 ${!session?.user?.is_verified ? "text-black/50": ""}`}
                                disabled={!session?.user?.is_verified}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-[20px] font-semibold">Province</label>
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
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-[20px] font-semibold">City</label>
                        <DropDown<CitiesItem>
                            items={cities}
                            labelKey="city_name"
                            placeholder="Find City..."
                            value={values.cityId}
                            onSelect={(item) => setFieldValue("cityId", item.id)}
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <label className="text-[20px] font-semibold">Address</label>
                        <Field
                            as="textarea"
                            name="address"
                            rows="4"
                            className={`h-30 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] p-4 outline-0 ${!session?.user?.is_verified ? "text-black/50": ""}`}
                            placeholder="Masukkan alamat lengkap termasuk Kecamatan"
                        />
                    </div>

                    <label className="mt-4 flex gap-2 items-center font-medium">
                        <Field
                            type="checkbox"
                            name="mainAddress"
                            className="w-5 h-5"
                        />
                        This is your main address?
                    </label>

                    <div className="mt-5">
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
                        />
                    </div>
                </Form>
            )
        }}
    </Formik>
  )
}

export default AddressForm
