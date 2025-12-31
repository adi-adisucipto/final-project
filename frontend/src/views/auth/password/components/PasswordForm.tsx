"use client"

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { Formik, Form, Field } from "formik"
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { changePasswordSchema } from "../schema";
import { useSearchParams } from "next/navigation";
import { changePassword } from "@/services/auth.service";
import { enqueueSnackbar } from "notistack";


function PasswordForm() {
    const [loading, setLoading] = useState(false);
    const initialValues = {password: "", confirmPassword: ""};
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

    const handleSubmit = async (values: {password:string, confirmPassword:string}) => {
        setLoading(true);

        try {
            const { message } = await changePassword(token, values.password, values.confirmPassword);

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
      validationSchema={changePasswordSchema}
      onSubmit={handleSubmit}
    >
      {({errors, touched}) => {
        return (
            <div className="xl:max-w-100">
                <Form>
                    <h1 className="xl:text-[36px] text-[24px] font-bold font-poppins">Change Password</h1>
                    <h3 className="my-7.5 xl:text-[20px] text-[18px]">You’re back in! Your account is secure and ready for your next purchase.</h3>

                    <div>
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
                            {errors.password && touched.password && (
                                <span className="text-red-500 text-[12px]">*{errors.password}</span>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className='text-[16px] mb-2'>Confirm Password</label>
                            <label className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 flex justify-between">
                                <Field
                                    type={type}
                                    name="confirmPassword"
                                    placeholder="At least 8 characters"
                                    className="w-full outline-0"
                                    disabled={loading}
                                />
                                <button type="button" onClick={handlePass} className="cursor-pointer">
                                    {eye ? (<Eye/>) : (<EyeClosed/>)}
                                </button>
                            </label>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <span className="text-red-500 text-[12px]">*{errors.confirmPassword}</span>
                            )}
                        </div>

                        <Button type='submit' className={`w-full h-13 text-[16px] mt-6 ${loading ? "cursor-wait" : ""}`} disabled={loading}>
                            {loading ? (
                                <div>
                                    <Spinner size={17} thickness={3}/>
                                </div>
                            ) : (
                                <div>Change Password</div>
                            )}
                        </Button>
                    </div>
                </Form>
            </div>
        )
      }}
    </Formik>
  )
}

export default PasswordForm
