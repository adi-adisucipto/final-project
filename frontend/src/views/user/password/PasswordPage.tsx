"use client"

import { Button } from "@/components/ui/button";
import { sendEmailChangePassword } from "@/services/profile.service";
import { Field, Form, Formik } from "formik"
import { BadgeCheck, Send } from "lucide-react";
import { useSession } from "next-auth/react"
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Ring } from "react-css-spinners";

function PasswordPage() {
    const {data: session, status} = useSession();
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: session?.user?.email || ""
    }

    const handleSubmit = async (values: {email:string}) => {
        setLoading(true)

        try {
            const { message } = await sendEmailChangePassword(values.email);

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
        enableReinitialize={true}
    >
        <Form>
            <div className="flex flex-col gap-2">
                <h1 className="text-[24px] font-bold">Change Password</h1>
                <hr/>
            </div>

            <div className="flex flex-col gap-5 mt-5">
                <label className="flex flex-col gap-0">
                    <h3 className="text-[20px] font-semibold">Email</h3>
                    <p>We will send you email for change password</p>
                </label>
                <label className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 text-black/50 flex justify-between items-center`}>
                    <Field
                        type="email"
                        name="email"
                        className="w-full"
                        disabled={true}
                    />
                    <div>
                        {session?.user?.is_verified ? (
                            <div className={`flex gap-2 text-green-500`}>
                                <BadgeCheck/>
                                Verified
                            </div>
                        ) : (
                            <div className={`flex gap-2 text-red-500 w-50 justify-end`}>
                                <BadgeCheck/>
                                Not Verified
                            </div>
                        )}
                    </div>
                </label>
            </div>

            <div className="flex items-center mt-6 gap-2.5">
                <Button className="rounded-md flex justify-center items-center" type="submit" disabled={loading}>
                    {loading ? (
                        <div className="h-full w-full">
                            <Ring size={17} thickness={3} color="#FFFFFF"/>
                        </div>
                    ) : (
                        <div className="h-full w-full font-semibold flex gap-2 justify-center items-center"><Send/> Send Email</div>
                    )}
                </Button>
            </div>
        </Form>
    </Formik>
  )
}

export default PasswordPage
