"use client"
import { ChangeEvent, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryOption, ProductFormPayload, ProductItem } from "../types"
import ProductFormFields, { FormErrors, ProductFormState } from "./ProductFormFields"
type ProductModalProps = {
  open: boolean
  onClose: () => void
  onSave: (payload: ProductFormPayload) => void
  product: ProductItem | null
  categories: CategoryOption[]
  existingProducts: ProductItem[]
}

const allowedExtensions = ["jpg", "jpeg", "png", "gif"]
const maxFileSize = 1024 * 1024
const buildFormState = (product?: ProductItem | null): ProductFormState => ({
  name: product?.name ?? "",
  categoryId: product?.categoryId ?? "",
  price: product ? String(product.price) : "",
  description: product?.description ?? "",
  files: [],
})
function ProductModal({
  open,
  onClose,
  onSave,
  product,
  categories,
  existingProducts,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductFormState>(() => buildFormState(product))
  const [errors, setErrors] = useState<FormErrors>({})
  const [fileError, setFileError] = useState("")
  useEffect(() => {
    setForm(buildFormState(product))
    setErrors({})
    setFileError("")
  }, [product, open])

  const updateField =
    (field: keyof ProductFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles: File[] = []
    let error = ""
    files.forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      if (!allowedExtensions.includes(ext)) {
        error = `Only .jpg, .jpeg, .png, .gif files are allowed (${file.name}).`
      } else if (file.size > maxFileSize) {
        error = `Max file size is 1MB (${file.name}).`
      } else {
        validFiles.push(file)
      }
    })
    setFileError(error)
    setForm((prev) => ({ ...prev, files: validFiles }))
    event.target.value = ""
  }
  const handleClearFiles = () => {
    setForm((prev) => ({ ...prev, files: [] }))
    setFileError("")
  }
  const handleSubmit = () => {
    const nextErrors: FormErrors = {}
    const name = form.name.trim()
    if (!name) {
      nextErrors.name = "Product name is required."
    } else {
      const cleanedName = name.toLowerCase()
      const hasDuplicate = existingProducts.some(
        (item) =>
          item.id !== product?.id &&
          item.name.trim().toLowerCase() === cleanedName
      )
      if (hasDuplicate) nextErrors.name = "Product name already exists."
    }

    if (!form.categoryId) nextErrors.categoryId = "Category is required."
    if (!form.price.trim()) {
      nextErrors.price = "Price must be greater than 0."
    } else {
      const price = Number(form.price)
      if (!Number.isFinite(price) || price <= 0) {
        nextErrors.price = "Price must be greater than 0."
      }
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required."
    }

    if (!product && form.files.length === 0) {
      nextErrors.files = "At least one photo is required."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length || fileError) return
    onSave({
      id: product?.id,
      name,
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: form.categoryId,
      files: form.files,
    })
  }
  const handleOpenChange = (value: boolean) => {
    if (!value) onClose()
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Update Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <ProductFormFields
          form={form}
          errors={errors}
          fileError={fileError}
          categories={categories}
          onFieldChange={updateField}
          onFilesChange={handleFilesChange}
          onClearFiles={handleClearFiles}
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
            {product ? "Update Product" : "Add Product"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductModal
