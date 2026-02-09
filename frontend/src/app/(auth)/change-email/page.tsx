import ChangeEmail from '@/views/auth/changeEmail/ChangeEmail'
import { Suspense } from 'react'

function ChangeEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification data...</div>}>
      <ChangeEmail />
    </Suspense>
  )
}

export default ChangeEmailPage
