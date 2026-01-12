import AdminNavBar from "@/components/AdminNavBar"
import StoreSidebar from "@/components/storeAdminSideBar"

function StoreAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavBar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-16 pt-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <StoreSidebar />
          <section className="min-h-[60vh]">{children}</section>
        </div>
      </main>
    </div>
  )
}

export default StoreAdminLayout
