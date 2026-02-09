import { ChangeEvent, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InventoryAdjustPayload } from "@/services/admin.inventory.service"
import { InventoryAction, ProductOption, StockItem, StoreOption } from "../types"

type FormState = {
  storeId: string
  productId: string
  quantity: string
  note: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

type InventoryAdjustModalProps = {
  open: boolean
  action: InventoryAction
  stock: StockItem | null
  stores: StoreOption[]
  products: ProductOption[]
  storeLocked: boolean
  defaultStoreId?: string
  onClose: () => void
  onSave: (payload: InventoryAdjustPayload) => void
}

const buildFormState = (
  stock: StockItem | null,
  defaultStoreId?: string
): FormState => ({
  storeId: stock?.storeId ?? defaultStoreId ?? "",
  productId: stock?.productId ?? "",
  quantity: "",
  note: "",
})

function InventoryAdjustModal({
  open,
  action,
  stock,
  stores,
  products,
  storeLocked,
  defaultStoreId,
  onClose,
  onSave,
}: InventoryAdjustModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    buildFormState(stock, defaultStoreId)
  )
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setForm(buildFormState(stock, defaultStoreId))
    setErrors({})
  }, [stock, defaultStoreId, open])

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = () => {
    const nextErrors: FormErrors = {}
    if (!form.storeId) nextErrors.storeId = "Store is required."
    if (!form.productId) nextErrors.productId = "Product is required."

    if (!form.quantity.trim()) {
      nextErrors.quantity = "Quantity is required."
    } else {
      const qty = Number(form.quantity)
      if (!Number.isFinite(qty) || qty <= 0) {
        nextErrors.quantity = "Quantity must be greater than 0."
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onSave({
      storeId: form.storeId,
      productId: form.productId,
      action,
      quantity: Number(form.quantity),
      note: form.note.trim() || undefined,
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) onClose()
  }

  const modalTitle = action === "IN" ? "Add Stock" : "Reduce Stock"
  const buttonLabel = action === "IN" ? "Add Stock" : "Reduce Stock"
  const isStoreLocked = storeLocked || Boolean(stock)
  const isProductLocked = Boolean(stock)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Store *
            </label>
            <select
              value={form.storeId}
              onChange={updateField("storeId")}
              disabled={isStoreLocked}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Select store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            {errors.storeId && (
              <p className="mt-1 text-xs text-rose-500">{errors.storeId}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Product *
            </label>
            <select
              value={form.productId}
              onChange={updateField("productId")}
              disabled={isProductLocked}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-xs text-rose-500">{errors.productId}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Quantity *
            </label>
            <input
              value={form.quantity}
              onChange={updateField("quantity")}
              type="number"
              min={1}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-rose-500">{errors.quantity}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Note</label>
            <textarea
              value={form.note}
              onChange={updateField("note")}
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="Optional note"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
          >
            {buttonLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InventoryAdjustModal
