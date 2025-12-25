"use client"

import { Field, Form, Formik } from "formik"
import { VerificationProps } from "../types/verification-props"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/Spinner"
import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"
import { verificationService } from "@/services/auth.service"
import { useSearchParams } from "next/navigation"
import { enqueueSnackbar } from "notistack"

function VerificationForm() {
    const [loading, setLoading] = useState(false);
    const [eye, setEye] = useState(true);
    const [type, setType] = useState("password");
    const searchParam = useSearchParams();
    const token = searchParam.get("token") || "";

    const handlePass = () => {
        setEye(!eye);
        if(type === "password") { 
            setType("text");
        } else {
            setType("password");
        }
    }

    const initialValues = {
        firstName: "",
        lastName: "",
        password: "",
        refCode: ""
    }

    const handleSubmit = async (values: VerificationProps) => {
        setLoading(true);
        
        try {
            const { password, firstName, lastName, refCode } = values
            const { message } = await verificationService(password, firstName, lastName, refCode, token);

            enqueueSnackbar(message, {variant: "success"});
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
    >
        <div className="xl:max-w-100">
            <Form>
                <h1 className="xl:text-[36px] text-[24px] font-bold font-poppins">Welcome Stranger 👋</h1>
                <h3 className="my-7.5 xl:text-[20px] text-[18px]">Today is new day. It’s your day. Ready to find what you need? Register now to buy your need in town.</h3>

                <div>
                    <div className="xl:flex gap-4">
                        <div className="mb-6 xl:mb-0">
                            <label className='text-[16px] mb-2'>First Name</label>
                            <Field
                                type="text"
                                name="firstName"
                                className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
                                placeholder="Your First Name"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className='text-[16px] mb-2'>Last Name</label>
                            <Field
                                type="text"
                                name="lastName"
                                className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
                                placeholder="Your Last Name"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className='text-[16px] mb-2'>Password</label>
                        <label className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 flex justify-between">
                            <Field
                                type={type}
                                name="password"
                                placeholder="At least 8 characters"
                                className="w-full outline-0"
                                disabled={loading}
                            />
                            <button type="button" onClick={handlePass} className="cursor-pointer">
                                {eye ? (<Eye/>) : (<EyeClosed/>)}
                            </button>
                        </label>
                    </div>

                    <div className="mt-6">
                        <label className='text-[16px] mb-2'>Referral Code</label>
                        <Field
                            type="text"
                            name="refCode"
                            className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
                            placeholder="Input referral code"
                            disabled={loading}
                        />
                    </div>

                    <Button type='submit' className={`w-full h-13 text-[16px] mt-6 ${loading ? "cursor-wait" : ""}`} disabled={loading}>
                        {loading ? (
                            <div>
                                <Spinner size={17} thickness={3}/>
                            </div>
                        ) : (
                            <div>Register</div>
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    </Formik>
  )
}

export default VerificationForm
