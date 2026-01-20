"use client"

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import { Field, Form, Formik } from "formik"
import { Eye, EyeClosed } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react"

function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [eye, setEye] = useState(true);
    const [type, setType] = useState("password");
    const router = useRouter()

    const handlePass = () => {
        setEye(!eye);
        if(type === "password") { 
            setType("text");
        } else {
            setType("password");
        }
    }

    const initialValues = {
        email: "",
        password: "",
    }

    const handleSubmit = async (values: {email: string, password: string}) => {
        setLoading(true);

        try {
            const { email, password } = values;
            const tokens = await signIn("credentials", {
                email, password,
                redirect: false
            });

            if(tokens?.ok) {
                enqueueSnackbar("Login success", {variant: "success"});
                const session = await getSession();

                if (!session?.user) {
                    throw new Error("Failed to get user session")
                }
            
                const { role, isStoreAdmin, storeAdminId } = session.user;
                 if (role === "super") {
                router.push("/admin");
                } else if (role === "admin") {
                if (isStoreAdmin || storeAdminId) {
                    router.push("/storeadmin");
                } else {
                    enqueueSnackbar("You are not assigned to any store. Please contact support.", {variant: "error"});
                    router.push("/");
                }
            } else if (role === "user") {
                router.push("/");
            } else {
                enqueueSnackbar("Your account is not properly configured. Please contact support.", {variant: "error"});
                router.push("/");
            }
        } else {
            enqueueSnackbar("Email or password invalid", {variant: "error"})
        }
        setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        await signIn("google", { callbackUrl: "/auth/role-redirect" });
    }
  return (
    <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
    >
        <div className="xl:max-w-100">
            <Form>
                <h1 className="xl:text-[36px] text-[24px] font-bold font-poppins">Welcome Back  👋</h1>
                <h3 className="xl:text-[20px] text-[18px] my-7.5">Today is new day. It’s your day. You shape it. Sign in to buy your need in the town.</h3>
                
                <div>
                    <label className='text-[16px] mb-2'>Email</label>
                    <Field
                        type="email"
                        name="email"
                        className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
                        placeholder="Example@email.com"
                        disabled={loading}
                    />
                </div>

                <div className="my-6">
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

                <Link href={"/forgot-password"} className="text-[#1E4AE9] flex justify-end">Forgot Password?</Link>

                <Button type='submit' className={`w-full h-13 text-[16px] mt-6 ${loading ? "cursor-wait" : ""}`} disabled={loading}>
                    {loading ? (
                        <div>
                            <Spinner size={17} thickness={3}/>
                        </div>
                    ) : (
                        <div>Login</div>
                    )}
                </Button>
            </Form> 

            <div className='mt-9.5'>
                <div className='flex justify-between items-center'>
                    <hr className='border border-black/20 w-[30%]' />
                    <p>Or sign in with</p>
                    <hr className='border border-black/20 w-[30%]' />
                </div>

                <button onClick={handleGoogleLogin} className='flex justify-center items-center gap-4 bg-[#F3F9FA] w-full p-3 rounded-xl cursor-pointer my-6'>
                    <Image src="/Google.png" alt='pic' width={28} height={28} />
                    <p>Google</p>
                </button>

                <p className='text-[16px] text-center'>Don’t you have an account? <Link href={"/registration"} className='text-[#1E4AE9] hover:text-[#1E4AE9]/80'>Sign up </Link></p>
            </div>
        </div>
    </Formik>
  )
}

export default LoginForm
