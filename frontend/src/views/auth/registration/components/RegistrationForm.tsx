"use client"

import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import { registrationService } from '@/services/auth.service';
import { Formik, Form, Field } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const initialValues = {email: ""}

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true)
    
    try {
      const {message} = await registrationService(values.email);

      enqueueSnackbar(message, {variant: "success"});
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false)
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
          <h3 className="my-7.5 xl:text-[20px] text-[18px]">Today is new day. It’s your day. Ready to find what you need? Sign up to buy your need in town.</h3>

          <div>
            <label className='text-[16px] mb-2'>Email</label>
            <Field
              type="email"
              name="email"
              className="h-12 w-full rounded-xl bg-[#F7FBFF] border border-[#D4D7E3] px-4 outline-0"
              placeholder="Example@email.com"
              disabled={loading}
            />
            <Button type='submit' className={`w-full h-13 text-[16px] mt-6 ${loading ? "cursor-wait" : ""}`} disabled={loading}>
              {loading ? (
                <div>
                  <Spinner size={17} thickness={3}/>
                </div>
              ) : (
                <div>Sign up</div>
              )}
            </Button>
          </div>
        </Form>

        <div className='mt-9.5'>
          <div className='flex justify-between items-center'>
            <hr className='border border-black/20 w-[30%]' />
            <p>Or sign up with</p>
            <hr className='border border-black/20 w-[30%]' />
          </div>

          <button className='flex justify-center items-center gap-4 bg-[#F3F9FA] w-full p-3 rounded-xl cursor-pointer my-6'>
            <Image src="/Google.png" alt='pic' width={28} height={28} />
            <p>Google</p>
          </button>

          <p className='text-[16px] text-center'>Do you have an account? <Link href={"/login"} className='text-[#1E4AE9] hover:text-[#1E4AE9]/80'>Sign in</Link></p>
        </div>
      </div>
    </Formik>
  )
}

export default RegistrationForm
