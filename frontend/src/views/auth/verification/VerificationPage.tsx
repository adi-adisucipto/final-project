import Image from "next/image"
import VerificationForm from "./components/VerificationForm"

function VerificationPage() {
  return (
    <div className='w-full h-screen xl:flex'>
      <div className='w-[94%] xl:hidden h-50 relative bg-cover m-4 rounded-xl'>
        <Image src={"/Login.jpg"} alt='cover' fill={true} className='absolute object-cover rounded-xl' />
      </div>

      <div className='xl:w-[50%] xl:flex justify-center items-center p-4 xl:p-0'>
        <VerificationForm/>
      </div>

      <div className='w-[50%] h-[92%] m-8 relative rounded-[24px] bg-cover xl:flex hidden'>
        <Image src={"/Login.jpg"} alt='cover' fill={true} className='absolute object-cover rounded-[24px]' />
      </div>
    </div>
  )
}

export default VerificationPage
