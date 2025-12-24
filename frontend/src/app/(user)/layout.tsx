import NavBar from "@/components/user/NavBar"

function UserLayout(
    { children } : { children : React.ReactNode }
) {
  return (
    <div>
      <NavBar/>
      { children }
    </div>
  )
}

export default UserLayout
