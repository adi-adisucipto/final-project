import NotistackProvider from "@/providers/NotistackProvider"

function AuthLayout(
    { children } : { children: React.ReactNode }
) {
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthLayout
