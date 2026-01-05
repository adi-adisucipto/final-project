import BottomBar from "@/components/user/BottomBar"
import SideBar from "@/components/user/SideBar"

function UserProfile(
    { children } : { children: React.ReactNode }
) {
  return (
    <div>
        <div className="xl:flex xl:max-w-7xl mx-auto my-4 xl:gap-8">
          <SideBar/>
          <div className="xl:p-10 p-4 xl:border xl:border-black/30 xl:shadow-2xl rounded-xl w-full">
            {children}
          </div>
          <BottomBar/>
        </div>
    </div>
  )
}

export default UserProfile
