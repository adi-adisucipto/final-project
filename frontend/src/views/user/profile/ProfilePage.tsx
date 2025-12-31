"use client"

import { useSession } from "next-auth/react"
import Avatar from "./components/Avatar"
import { Field, Form, Formik } from "formik";
import { BadgeCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/services/profile.service";
import { enqueueSnackbar } from "notistack";
import { Ring } from 'react-css-spinners'
import { useState } from "react";

interface SubmitProps {
    firstName: string | null;
    lastName: string | null;
    email: string;
    referralCode: string;
    avatar: File | string | null
}

function ProfilePage() {
    const { data: session, status, update } = useSession();
    const [loading, setLoading] = useState(false);
    const initialValues = {
        firstName: session?.user?.first_name || "",
        lastName: session?.user?.last_name || "",
        email: session?.user?.email || "",
        referralCode: session?.user?.referral_code || "",
        avatar: null
    }

    const handleSubmit = async (values: SubmitProps) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('first_name', values.firstName || "");
            formData.append('last_name', values.lastName || "");
            if (values.avatar instanceof File) {
                formData.append('avatar', values.avatar);
            }
            const { message, data } = await updateUser(formData, session?.accessToken!);

            await update({
                ...session,
                user: {
                    ...session?.user,
                    ...data
                }
            });

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
        {({setFieldValue}) => {
            return (
                <Form>
                    <Avatar name="avatar" setFieldValue={setFieldValue}/>

                    <div className="flex gap-5 w-full">
                        <div className="flex flex-col gap-2 w-[50%]">
                            <label className="text-[20px] font-semibold">First Name</label>
                            <Field
                                type="text"
                                name="firstName"
                                className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 ${!session?.user?.is_verified ? "text-black/50": ""}`}
                                disabled={!session?.user?.is_verified}
                            />
                        </div>

                        <div className="flex flex-col gap-2 w-[50%]">
                            <label className="text-[20px] font-semibold">Last Name</label>
                            <Field
                                type="text"
                                name="lastName"
                                className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 ${!session?.user?.is_verified ? "text-black/50": ""}`}
                                disabled={!session?.user?.is_verified}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full my-6">
                        <label className="text-[20px] font-semibold">Email</label>
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

                    <div className="flex flex-col gap-2">
                        <label className="text-[20px] font-semibold">Referral Code</label>
                        <Field
                            type="text"
                            name="referralCode"
                            className={`h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0 text-black/50`}
                            disabled={true}
                        />
                    </div>

                    <div className="flex items-center mt-6 gap-2.5">
                        <Button type="button" className="rounded-md">
                            <Mail/>
                            Change Email
                        </Button>

                        <Button className="rounded-md flex justify-center items-center" variant={"outline"} type="submit" disabled={loading}>
                            {loading ? (
                                <div className="h-full w-full">
                                    <Ring size={17} thickness={3} color="#22C55E"/>
                                </div>
                            ) : (
                                <div className="h-full w-full">Save Change</div>
                            )}
                        </Button>
                    </div>
                </Form>
            )
        }}
    </Formik>
  )
}

export default ProfilePage
