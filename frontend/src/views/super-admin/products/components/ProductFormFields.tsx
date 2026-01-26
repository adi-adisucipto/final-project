import { ChangeEvent } from "react"
import { CategoryOption, StoreOption } from "../types"
export type ProductFormState = {
  name: string
  categoryId: string
  storeId: string
  price: string
  stock: string
  description: string
  files: File[]
}
export type FormErrors = Partial<Record<keyof ProductFormState, string>>
type FieldChangeHandler = (field: keyof ProductFormState) => (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void
type ProductFormFieldsProps = {
  form: ProductFormState
  errors: FormErrors
  fileError: string
  stores: StoreOption[]
  categories: CategoryOption[]
  onFieldChange: FieldChangeHandler
  onFilesChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClearFiles: () => void
}
function ProductFormFields({
  form,
  errors,
  fileError,
  stores,
  categories,
  onFieldChange,
  onFilesChange,
  onClearFiles,
}: ProductFormFieldsProps) {
  const fileNames = form.files.map((file) => file.name)
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Product Name *
        </label>
        <input
          value={form.name}
          onChange={onFieldChange("name")}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          placeholder="Product name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">Store *</label>
        <select
          value={form.storeId}
          onChange={onFieldChange("storeId")}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
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
          Category *
        </label>
        <select
          value={form.categoryId}
          onChange={onFieldChange("categoryId")}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-xs text-rose-500">{errors.categoryId}</p>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Price (IDR) *
          </label>
          <input
            value={form.price}
            onChange={onFieldChange("price")}
            type="number"
            min={0}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="0"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Stock *</label>
          <input
            value={form.stock}
            onChange={onFieldChange("stock")}
            type="number"
            min={0}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Description *
        </label>
        <textarea
          value={form.description}
          onChange={onFieldChange("description")}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
          placeholder="Tell customers what this product is about."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold text-slate-700">
          Product Photos *
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Formats: .jpg, .jpeg, .png, .gif | Max 1MB per file
        </p>
        <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-8 text-sm text-slate-500">
          <span className="font-semibold text-emerald-600">
            Click to upload photos
          </span>
          <span className="text-xs text-slate-400">or drag and drop</span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            multiple
            onChange={onFilesChange}
            className="sr-only"
          />
        </label>
        {errors.files && (
          <p className="mt-1 text-xs text-rose-500">{errors.files}</p>
        )}
        {fileError && (
          <p className="mt-2 text-xs text-rose-500">{fileError}</p>
        )}
        {fileNames.length > 0 && (
          <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                Selected photos ({fileNames.length})
              </span>
              <button
                type="button"
                onClick={onClearFiles}
                className="text-emerald-700 underline"
              >
                Clear all
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {fileNames.map((image) => (
                <span
                  key={image}
                  className="rounded-full bg-white px-3 py-1 text-slate-600"
                >
                  {image}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFormFields
