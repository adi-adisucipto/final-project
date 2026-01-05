import NavBar from "@/components/user/NavBar"

function UserLayout(
    { children } : { children : React.ReactNode }
) {
  return (
    <div>
      <NavBar/>
      <main className="flex-1 xl:pt-8 pt-4"> 
        { children }
      </main>
    </div>
  )
}

export default UserLayout
