import { ChangeEvent } from "react"
import { DiscountProductOption } from "@/services/admin.discounts.service"
import { DiscountRule, DiscountType, StoreOption } from "../types"

export type DiscountFormState = {
  storeId: string
  productId: string
  rule: DiscountRule
  type: DiscountType
  value: string
  minPurchase: string
  maxDiscount: string
}

export type DiscountFormErrors = Partial<Record<keyof DiscountFormState, string>>

type FieldChangeHandler = (field: keyof DiscountFormState) => (
  event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => void

type DiscountFormFieldsProps = {
  form: DiscountFormState
  errors: DiscountFormErrors
  stores: StoreOption[]
  products: DiscountProductOption[]
  storeLocked: boolean
  onFieldChange: FieldChangeHandler
}

function DiscountFormFields({
  form,
  errors,
  stores,
  products,
  storeLocked,
  onFieldChange,
}: DiscountFormFieldsProps) {
  const showValueFields = form.rule !== "BOGO"
  const showMinFields = form.rule === "MIN_PURCHASE"

  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Store *</label>
        <select
          value={form.storeId}
          onChange={onFieldChange("storeId")}
          disabled={storeLocked}
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
          onChange={onFieldChange("productId")}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
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
          Discount Rule *
        </label>
        <select
          value={form.rule}
          onChange={onFieldChange("rule")}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
        >
          <option value="MANUAL">Manual</option>
          <option value="MIN_PURCHASE">Minimum Purchase</option>
          <option value="BOGO">Buy 1 Get 1</option>
        </select>
        {errors.rule && (
          <p className="mt-1 text-xs text-rose-500">{errors.rule}</p>
        )}
      </div>
      {showValueFields && (
        <>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Discount Type *
            </label>
            <select
              value={form.type}
              onChange={onFieldChange("type")}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
            >
              <option value="PERCENT">Percent (%)</option>
              <option value="NOMINAL">Nominal (IDR)</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-rose-500">{errors.type}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Discount Value *
            </label>
            <input
              value={form.value}
              onChange={onFieldChange("value")}
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder={form.type === "PERCENT" ? "10" : "5000"}
            />
            {errors.value && (
              <p className="mt-1 text-xs text-rose-500">{errors.value}</p>
            )}
          </div>
        </>
      )}
      {showMinFields && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Minimum Purchase *
            </label>
            <input
              value={form.minPurchase}
              onChange={onFieldChange("minPurchase")}
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="100000"
            />
            {errors.minPurchase && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.minPurchase}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Max Discount *
            </label>
            <input
              value={form.maxDiscount}
              onChange={onFieldChange("maxDiscount")}
              type="number"
              min={0}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
              placeholder="10000"
            />
            {errors.maxDiscount && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.maxDiscount}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountFormFields
