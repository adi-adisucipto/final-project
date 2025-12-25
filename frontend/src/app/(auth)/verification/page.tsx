import VerificationPage from "@/views/auth/verification/VerificationPage"
import { Suspense } from "react"

function Verification() {
  return (
    <div>
      <Suspense fallback={<div>Loading verification data...</div>}>
        <VerificationPage />
      </Suspense>
    </div>
  )
}

export default Verification
