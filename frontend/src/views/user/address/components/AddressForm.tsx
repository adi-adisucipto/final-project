"use client"

import { Field, Form, Formik } from "formik"
import { useSession } from "next-auth/react";
import DropDown from "./DropDown";
import { useEffect, useState } from "react";
import { SubmitProps, ProvinceItem, CitiesItem } from "../types/types";
import { citiesService, provinceService } from "@/services/address.services";
import { Button } from "@/components/ui/button";

function AddressForm() {
    const { data: session, status, update } = useSession();
    const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
    const [cities, setCities] = useState<CitiesItem[]>([]);
    
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
        console.log(cities)
    }

    console.log(cities)
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
    >
        {({setFieldValue, values}) => {
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

                    

                    <Button type="submit" className="mt-5 rounded-md">Submit</Button>
                </Form>
            )
        }}
    </Formik>
  )
}

export default AddressForm
