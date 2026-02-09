import { ChangeEvent, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getDiscountProducts,
  DiscountProductOption,
} from "@/services/admin.discounts.service"
import {
  DiscountFormPayload,
  DiscountItem,
  StoreOption,
} from "../types"
import DiscountFormFields, {
  DiscountFormErrors,
  DiscountFormState,
} from "./DiscountFormFields"

type DiscountModalProps = {
  open: boolean
  onClose: () => void
  onSave: (payload: DiscountFormPayload) => void
  discount: DiscountItem | null
  stores: StoreOption[]
  accessToken?: string
  storeLocked: boolean
  defaultStoreId?: string
}

const buildFormState = (
  discount?: DiscountItem | null,
  defaultStoreId?: string
): DiscountFormState => ({
  storeId: discount?.storeId ?? defaultStoreId ?? "",
  productId: discount?.productId ?? "",
  rule: discount?.rule ?? "MANUAL",
  type: discount?.type ?? "PERCENT",
  value: discount ? String(discount.value) : "",
  minPurchase: discount?.minPurchase ? String(discount.minPurchase) : "",
  maxDiscount: discount?.maxDiscount ? String(discount.maxDiscount) : "",
})

function DiscountModal({
  open,
  onClose,
  onSave,
  discount,
  stores,
  accessToken,
  storeLocked,
  defaultStoreId,
}: DiscountModalProps) {
  const [form, setForm] = useState<DiscountFormState>(() =>
    buildFormState(discount, defaultStoreId)
  )
  const [errors, setErrors] = useState<DiscountFormErrors>({})
  const [products, setProducts] = useState<DiscountProductOption[]>([])

  useEffect(() => {
    setForm(buildFormState(discount, defaultStoreId))
    setErrors({})
  }, [discount, defaultStoreId, open])

  useEffect(() => {
    const loadProducts = async () => {
      if (!accessToken || !form.storeId) {
        setProducts([])
        return
      }
      try {
        const items = await getDiscountProducts(accessToken, form.storeId)
        setProducts(items)
      } catch (error) {
        setProducts([])
      }
    }
    loadProducts()
  }, [accessToken, form.storeId])

  const updateField =
    (field: keyof DiscountFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = () => {
    const nextErrors: DiscountFormErrors = {}
    if (!form.storeId) nextErrors.storeId = "Store is required."
    if (!form.productId) nextErrors.productId = "Product is required."
    if (!form.rule) nextErrors.rule = "Rule is required."
    if (!form.type) nextErrors.type = "Type is required."

    if (form.rule !== "BOGO") {
      const value = Number(form.value)
      if (!form.value || !Number.isFinite(value) || value <= 0) {
        nextErrors.value = "Value must be greater than 0."
      } else if (form.type === "PERCENT" && value > 100) {
        nextErrors.value = "Percent must be 100 or less."
      }
    }

    if (form.rule === "MIN_PURCHASE") {
      const minPurchase = Number(form.minPurchase)
      const maxDiscount = Number(form.maxDiscount)
      if (!form.minPurchase || !Number.isFinite(minPurchase) || minPurchase <= 0) {
        nextErrors.minPurchase = "Minimum purchase is required."
      }
      if (!form.maxDiscount || !Number.isFinite(maxDiscount) || maxDiscount <= 0) {
        nextErrors.maxDiscount = "Max discount is required."
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onSave({
      id: discount?.id,
      storeId: form.storeId,
      productId: form.productId,
      rule: form.rule,
      type: form.rule === "BOGO" ? "NOMINAL" : form.type,
      value: form.rule === "BOGO" ? 0 : Number(form.value),
      minPurchase:
        form.rule === "MIN_PURCHASE" ? Number(form.minPurchase) : undefined,
      maxDiscount:
        form.rule === "MIN_PURCHASE" ? Number(form.maxDiscount) : undefined,
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {discount ? "Update Discount" : "Add New Discount"}
          </DialogTitle>
        </DialogHeader>
        <DiscountFormFields
          form={form}
          errors={errors}
          stores={stores}
          products={products}
          storeLocked={storeLocked}
          onFieldChange={updateField}
        />
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
            {discount ? "Update Discount" : "Add Discount"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DiscountModal
