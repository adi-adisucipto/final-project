"use client"

import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/Spinner";
import { requestChangeEmail } from "@/services/changeEmail.service";
import { Field, Form, Formik } from "formik"
import { X } from "lucide-react"
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { signOut } from "next-auth/react"
import ConfirmDialog from "../../address/components/ConfirmDialog";
import { Ring } from "react-css-spinners";

interface ChangeEmailProps {
    onClose: () => void;
}

function ChangeEmail({onClose}: ChangeEmailProps) {
    const { data: session, status, update } = useSession();
    const [loading, setLoading] = useState(false);
    const initialValues = {
        newEmail: "",
        password: ""
    }

    const handleSubmit = async (values: {newEmail:string, password:string}) => {
        setLoading(true)
        try {
            const { message } = await requestChangeEmail(session?.accessToken!, values.newEmail, values.password);
            signOut();

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
        {({submitForm}) => (
            <div className="fixed inset-0 z-30 flex justify-center items-center px-4 w-full">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
                
                <div className="bg-white relative w-full max-w-150 rounded-xl">
                    <div className="flex justify-between items-center border-b border-slate-100 py-3 px-4">
                        <h3 className="text-xl font-bold">Change Email</h3>
                        <button type="button" className="hover:bg-slate-100 p-1 rounded-md cursor-pointer" onClick={onClose}><X/></button>
                    </div>

                    <Form className="p-4 flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="newEmail">New Email</label>
                            <Field
                                type="email"
                                placeholder="Example@email.com"
                                name="newEmail"
                                className="h-10 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                placeholder="At least 8 characters"
                                name="password"
                                className="h-10 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 text-sm focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none transition-all"
                            />
                        </div>

                        <ConfirmDialog
                            onConfirm={submitForm}
                            trigger={
                                <Button 
                                    type="button"
                                    className="rounded-md" 
                                    disabled={loading}
                                >
                                    {!loading ? (<span>Change Email</span>) : (
                                        <div className="h-full w-full flex justify-center items-center">
                                            <Ring size={17} thickness={3} color="#FFFFFF"/>
                                        </div>
                                            )}
                                </Button>
                            }
                            action="Change Email"
                            cancel="Cancel"
                        />
                    </Form>
                </div>
            </div>
        )}
    </Formik>
  )
}

export default ChangeEmail
