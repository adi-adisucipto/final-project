"use client"

import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import { sendEmailChangePassword } from '@/services/profile.service';
import { Formik, Form, Field } from 'formik';
import { Send } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

function ForgotForm() {
  const [loading, setLoading] = useState(false);
  const initialValues = {email: ""}

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true)
    
    try {
      const {message} = await sendEmailChangePassword(values.email);

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
          <h1 className="xl:text-[36px] text-[24px] font-bold font-poppins">Change Password</h1>
          <h3 className="my-7.5 xl:text-[20px] text-[18px]">You’re back in! Your account is secure and ready for your next purchase.</h3>

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
                <div className='flex justify-center items-center gap-2'><Send/> Send Email</div>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Formik>
  )
}

export default ForgotForm
