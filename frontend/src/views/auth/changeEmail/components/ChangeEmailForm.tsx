"use client"

import { Field, Form, Formik, ErrorMessage } from "formik"
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { changeEmail } from "@/services/changeEmail.service";
import { enqueueSnackbar } from "notistack";
import { TokenPayload } from "@/types/auth";
import { validationSchema } from "../validation/validationSchema";

function ChangeEmailForm() {
    const searchParam = useSearchParams();
    const token = searchParam.get("token") || "";
    const [loading, setLoading] = useState(false)
    const decoded = jwtDecode<TokenPayload>(token)

    const initialValues = {
        email: decoded.email
    }

    const handleSubmit = async (values: { email: string }) => {
        setLoading(true);
        try {
            const { message } = await changeEmail(token);

            enqueueSnackbar(message, {variant: "success"})
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
  return (
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitializ
    >
        {({errors, touched}) => (
            <Form className="xl:flex flex-col gap-4 w-full xl:max-w-100">
                <h1 className="xl:text-[36px] text-[24px] font-bold font-poppins">Change Email</h1>
                <div className="mb-6 xl:mb-0">
                    <label className='text-[16px] mb-2'>New Email</label>
                    <Field
                        type="text"
                        name="email"
                        className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
                        placeholder="New Email"
                        disabled={true}
                    />
                    <ErrorMessage 
                        name="email" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                    />
                </div>

                <Button type='submit' className={`w-full h-13 text-[16px] mt-6 ${loading ? "cursor-wait" : ""}`} disabled={loading}>
                    {loading ? (
                        <div>
                            <Spinner size={17} thickness={3}/>
                        </div>
                    ) : (
                        <div>Change Email</div>
                    )}
                </Button>
            </Form>
        )}
    </Formik>
  )
}

export default ChangeEmailForm
