"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  LayoutGrid,
  Package,
  Percent,
  Tags,
  Users,
  Warehouse,
} from "lucide-react"

import { cn } from "@/lib/utils"

const adminLinks = [
  {
    label: "User Data",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Product Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Store Stocks",
    href: "/admin/store-stocks",
    icon: Warehouse,
  },
  {
    label: "Store Discount",
    href: "/admin/store-discount",
    icon: Percent,
  },
  {
    label: "Sales Report",
    href: "/admin/sales-report",
    icon: BarChart3,
  },
  {
    label: "Inventory Report",
    href: "/admin/inventory-report",
    icon: Warehouse,
  },
]

function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="animate-in fade-in-0 slide-in-from-left-2 duration-700 lg:sticky lg:top-28 h-fit">
      <div className="rounded-2xl border bg-white/90 shadow-lg shadow-100/40 backdrop-blur">
        <div className="px-5 pt-6 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-500">
            Admin Panel
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Groceria Console
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage users, products, and reporting.
          </p>
        </div>
        <nav className="px-3 pb-6">
          {adminLinks.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(`${item.href}/`))
            const Icon = item.icon

            const content = (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
                  "text-slate-600 hover:bg-gray-50 hover:text-emerald-700",
                  isActive &&
                    "bg-emerald-500 text-white shadow-md shadow-emerald-200/60"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border",
                    "border-emerald-100 bg-emerald-50",
                    isActive && "border-emerald-400 bg-emerald-400 text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </div>
            )

            return (
              <Link key={item.label} href={item.href} className="mb-2 block">
                {content}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default AdminSidebar
