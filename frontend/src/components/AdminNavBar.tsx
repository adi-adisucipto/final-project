"use client"

import Image from "next/image"
import Link from "next/link"

import Dropdown from "@/components/user/Dropdown"

function AdminNavBar() {
  return (
    <div className="sticky top-4 z-30 mx-4 mt-4 rounded-xl border bg-white shadow-lg xl:mx-auto xl:max-w-7xl xl:px-4">
      <div className="mx-auto flex items-center justify-between gap-3 px-4 py-2 xl:max-w-7xl xl:px-0 xl:py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={170}
            height={40}
            className="w-30 xl:w-42.5"
          />
        </Link>
        <Dropdown />
      </div>
    </div>
  )
}

export default AdminNavBar
