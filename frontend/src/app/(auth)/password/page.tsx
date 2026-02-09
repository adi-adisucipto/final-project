import PasswordPage from "@/views/auth/password/Password"
import { Suspense } from "react"

function Password() {
  return (
    <Suspense fallback={<div>Loading verification data...</div>}>
      <PasswordPage />
    </Suspense>
  )
}

export default Password
