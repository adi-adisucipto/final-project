"use client"

import { data } from "@/lib/UserLink"
import { LogOut, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ExitDialog from "../ExitDialog"

function SideBar() {
    const path = usePathname();
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])
  return (
    <div className="xl:w-[35%] h-full p-4 border border-black/30 rounded-xl shadow-xl xl:flex hidden flex-col gap-5">
        <div className="flex flex-col gap-4 justify-center items-center">
            {session?.user?.avatar === null ? (
                <div className="w-17 h-17 rounded-full bg-gray-100 flex justify-center items-center">
                    <User className="w-10 h-10"/>
                </div>
            ) : (
                <div>
                    <Image src={session?.user?.avatar || "/default-avatar.png"} alt="cover" width={70} height={70} className="rounded-full border border-black/20"/>
                </div>
            )}
                <div className="flex flex-col justify-center items-center">
                    {session?.user?.first_name === null ? (
                        <h3 className="text-[20px] font-semibold">User</h3>
                    ) : (
                        <div>
                            <h3 className="text-[20px] font-semibold">{session?.user?.first_name} {session?.user?.last_name}</h3>
                        </div>
                    )}
                    <p className="text-black/50">{session?.user?.email}</p>
                </div>
            </div>

            <div className="flex gap-2.5 flex-col">
                {data.map((item, index) => {
                    const isActive = path === item.href;
                    return (
                        <Link key={index} href={item.href}>
                            <div className={`flex gap-2.5 w-full p-3 rounded-xl font-medium border border-black/20 ${isActive ? "text-white bg-green-500 border-0" : "shadow-md hover:bg-green-500 hover:text-white"}`}>{item.icon} {item.name}</div>
                        </Link>
                    )
                })}

                <div className="flex cursor-pointer gap-2.5 w-full p-3 rounded-xl bg-red-500 hover:bg-red-500/90 font-medium shadow-md border border-black/20 text-white">
                    <LogOut/>
                    <ExitDialog/>
                </div>
            </div>
        </div>
  )
}

export default SideBar
