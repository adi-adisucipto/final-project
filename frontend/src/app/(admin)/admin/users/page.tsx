"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { enqueueSnackbar } from "notistack"
import { MoreHorizontal, UserRound } from "lucide-react"

import Spinner from "@/components/ui/Spinner"
import { IconButton } from "@/components/ui/icon-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUserRole,
} from "@/services/admin.service"
import { cn } from "@/lib/utils"

type AdminUser = {
  id: string
  email: string
  role: "user" | "admin" | "super"
  first_name: string | null
  last_name: string | null
}

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
]

function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canAccess = useMemo(() => {
    const role = session?.user?.role
    return role === "admin" || role === "super"
  }, [session?.user?.role])

  const loadUsers = useCallback(async () => {
    if (!session?.accessToken) return
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminUsers(session.accessToken)
      setUsers(response.data ?? [])
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to load users"
        : "Failed to load users"
      setError(message)
      enqueueSnackbar(message, { variant: "error" })
    } finally {
      setLoading(false)
    }
  }, [session?.accessToken])

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user || !session?.accessToken) {
      router.push("/")
      return
    }
    if (!canAccess) {
      router.push("/")
      return
    }
    loadUsers()
  }, [status, session?.user, session?.accessToken, canAccess, loadUsers, router])

  const handleRoleChange = async (user: AdminUser, nextRole: string) => {
    if (!session?.accessToken) return
    if (user.role === "super") return
    if (nextRole !== "user" && nextRole !== "admin") return
    if (user.role === nextRole) return

    const previousRole = user.role
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id ? { ...item, role: nextRole } : item
      )
    )
    setRoleUpdatingId(user.id)
    try {
      await updateAdminUserRole(user.id, nextRole, session.accessToken)
      enqueueSnackbar("Role updated", { variant: "success" })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to update role"
        : "Failed to update role"
      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id ? { ...item, role: previousRole } : item
        )
      )
      enqueueSnackbar(message, { variant: "error" })
    } finally {
      setRoleUpdatingId(null)
    }
  }

  const handleDelete = async (user: AdminUser) => {
    if (!session?.accessToken) return
    const isSelf = session?.user?.id === user.id
    if (isSelf) {
      enqueueSnackbar("You cannot delete your own account", {
        variant: "warning",
      })
      return
    }
    if (user.role === "super") {
      enqueueSnackbar("Super admin cannot be deleted", { variant: "warning" })
      return
    }
    const confirmDelete = window.confirm(
      `Delete ${user.email}? This action cannot be undone.`
    )
    if (!confirmDelete) return

    setPendingId(user.id)
    try {
      await deleteAdminUser(user.id, session.accessToken)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      enqueueSnackbar("User deleted", { variant: "success" })
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to delete user"
        : "Failed to delete user"
      enqueueSnackbar(message, { variant: "error" })
    } finally {
      setPendingId(null)
    }
  }

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 text-slate-500">
          <Spinner size={26} thickness={3} />
          <span className="text-sm">Loading session...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          User Management
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Manage users, roles, and access
        </h1>
        <p className="text-sm text-slate-500">
          Review users, update their roles, and clean inactive programs.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-600">
          User Data
        </div>

        {loading ? (
          <div className="flex items-center gap-3 px-6 py-10 text-slate-500">
            <Spinner size={26} thickness={3} />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : error ? (
          <div className="px-6 py-10 text-sm text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">
            No users found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const name = [user.first_name, user.last_name]
                    .filter(Boolean)
                    .join(" ")
                  const displayName = name || user.email.split("@")[0]
                  const isSelf = session?.user?.id === user.id
                  const isSuper = user.role === "super"
                  const isDeleting = pendingId === user.id

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        "border-t border-slate-200",
                        index % 2 === 1 && "bg-slate-50"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            <UserRound className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {displayName}
                            </p>
                            {isSelf ? (
                              <p className="text-xs text-emerald-600">
                                This is you
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400">
                                Active account
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {isSuper ? (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                              Super
                            </span>
                          ) : (
                            <select
                              value={user.role}
                              onChange={(event) =>
                                handleRoleChange(user, event.target.value)
                              }
                              disabled={roleUpdatingId === user.id || isSelf}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none"
                            >
                              {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {roleUpdatingId === user.id ? (
                            <span className="text-xs text-slate-400">
                              Saving...
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              aria-label="Open actions"
                              className="rounded-full"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </IconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={isSelf || isSuper || isDeleting}
                              onClick={() => handleDelete(user)}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminUsersPage
