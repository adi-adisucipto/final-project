import SideBar from "@/components/user/SideBar"

function UserProfile(
    { children } : { children: React.ReactNode }
) {
  return (
    <div>
        <div className="flex max-w-7xl mx-auto my-10.5 gap-8">
          <SideBar/>
          <div className="p-10 border border-black/30 shadow-2xl rounded-xl w-full h-full">
            {children}
          </div>
        </div>
    </div>
  )
}

export default UserProfile
