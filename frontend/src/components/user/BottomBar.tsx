"use client"

import { data } from '@/lib/UserLink';
import Link from 'next/link';
import { usePathname } from "next/navigation"

function BottomBar() {
    const path = usePathname();
  return (
    <div className='sticky xl:hidden bottom-4 z-30 border backdrop-blur-xl rounded-xl shadow-lg my-4 mt-100 max-w-75 w-75 mx-auto p-4'>
        <div className="flex justify-between">
                {data.map((item, index) => {
                    const isActive = path === item.href;
                    return (
                        <Link key={index} href={item.href}>
                            <div className={`flex gap-2.5 w-full rounded-xl font-medium ${isActive ? "text-green-500 border-0" : "hover:text-green-500"}`}>{item.icon}</div>
                        </Link>
                    )
                })}
            </div>
    </div>
  )
}

export default BottomBar
