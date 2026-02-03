"use client"

import { ChangeEvent, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryFormPayload, CategoryItem } from "../types"

type CategoryModalProps = {
  open: boolean
  onClose: () => void
  onSave: (payload: CategoryFormPayload) => void
  category: CategoryItem | null
  existingCategories: CategoryItem[]
}

function CategoryModal({
  open,
  onClose,
  onSave,
  category,
  existingCategories,
}: CategoryModalProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setName(category?.name ?? "")
    setError("")
  }, [category, open])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Category name is required.")
      return
    }
    const duplicate = existingCategories.some((item) => {
      if (item.id === category?.id) return false
      return item.name.trim().toLowerCase() === trimmed.toLowerCase()
    })
    if (duplicate) {
      setError("Category name already exists.")
      return
    }
    onSave({ id: category?.id, name: trimmed })
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {category ? "Update Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Category Name *
          </label>
          <input
            value={name}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:bg-white focus:outline-none"
            placeholder="Category name"
          />
          {error ? <p className="mt-1 text-xs text-rose-500">{error}</p> : null}
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
            {category ? "Update Category" : "Add Category"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryModal
