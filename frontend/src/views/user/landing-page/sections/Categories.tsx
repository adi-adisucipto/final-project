"use client"

import Image from "next/image"
import { motion } from 'framer-motion'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProductCategories } from "@/services/product.services"
import { ProductCategory } from "@/types/product"

type CategoriesProps = {
  storeId?: string
}

function Categories({ storeId }: CategoriesProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let active = true
    setLoading(true)
    getProductCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch(() => {
        if (active) setCategories([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="xl:mt-8 mt-4 px-4 xl:px-0">
      <h1 className="xl:text-[24px] text-[20px] font-bold xl:mb-4 mb-2">Shop by Categories</h1>
      {loading ? (
        <div className="text-sm text-slate-500">Loading categories...</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                const params = new URLSearchParams()
                params.set("categoryId", category.id)
                if (storeId) params.set("storeId", storeId)
                router.push(`/products?${params.toString()}`)
              }}
              className="p-4 rounded-2xl bg-[#22C55E]/10 hover:shadow-xl shadow-md hover:-translate-y-1 cursor-pointer duration-500 ease-in-out flex gap-4 justify-center items-center">
                <Image src="/paper-bag.png" alt={category.name} width={48} height={48} />
                <p className="font-semibold xl:flex hidden">{category.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Categories
