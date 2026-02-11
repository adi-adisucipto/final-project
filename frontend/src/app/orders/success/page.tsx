import { Suspense } from 'react'
import OrderSuccessPage from '@/views/user/profile/orders/OrderSuccessPage'

function page() {
  return (
    <Suspense fallback={<div>Loading verification data...</div>}>
      <OrderSuccessPage />
    </Suspense>
  )
}

export default page
