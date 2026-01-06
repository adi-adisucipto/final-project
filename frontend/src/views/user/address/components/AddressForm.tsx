"use client"

import { Field, Form, Formik } from "formik"
import { useSession } from "next-auth/react";

interface SubmitProps {
    firstName: string;
    lastName: string;
    province: string;
    city: string;
    address: string;
    mainAddress: boolean
}

function AddressForm() {
    const { data: session, status, update } = useSession();
    const initialValues = {
        firstName: session?.user?.first_name || "",
        lastName: session?.user?.last_name || "",
        province: "",
        city: "",
        address: "",
        mainAddress: false
    }

    const handleSubmit = async (values: SubmitProps) => {

    }
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize={true}
    >
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

            
        </Form>
    </Formik>
  )
}

export default AddressForm
