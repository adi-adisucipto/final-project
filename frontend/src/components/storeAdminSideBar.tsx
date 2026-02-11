"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { storeadminsideLinks } from "@/lib/side-bar-store-lnk"

import { cn } from "@/lib/utils"

function StoreSidebar() {
  const pathname = usePathname()

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-28 h-fit">
        <div className="rounded-2xl border bg-white shadow-lg">
          <div className="px-5 pt-6 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
              Admin Store Panel
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              Groceria
            </h2>
          </div>

          <nav className="px-3 pb-6">
            {storeadminsideLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(`${item.href}/`))

              const Icon = item.icon

              return (
                <Link key={item.label} href={item.href} className="mb-2 block">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                      "text-slate-600 hover:bg-gray-50 hover:text-emerald-700",
                      isActive &&
                        "bg-emerald-500 text-white shadow-md shadow-emerald-200/60"
                    )}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center lg:hidden ">
        <div className="flex justify-between items-center w-[90%] max-w-md bg-white border rounded-2xl shadow-lg px-6 py-3">
          {storeadminsideLinks.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center text-xs font-medium transition",
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-500 hover:text-emerald-600"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default StoreSidebar
