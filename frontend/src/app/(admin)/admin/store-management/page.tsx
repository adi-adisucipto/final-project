import StoreManagementPage from "@/views/super-admin/store-manangement/StoreManagementPage"

function StoreManagemet() {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
          Store Management
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Manage your store
        </h1>
        <p className="text-sm text-slate-500">
          Review store, update your admin store, and delete your store.
        </p>
      </header>
      <StoreManagementPage/>
    </div>
  )
}

export default StoreManagemet
