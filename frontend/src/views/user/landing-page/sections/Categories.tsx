"use client"

import Image from "next/image"
import { categories } from "../constant/categories"
import { motion } from 'framer-motion'

function Categories() {
  return (
    <div className="xl:mt-8 mt-4 px-4 xl:px-0">
      <h1 className="xl:text-[24px] text-[20px] font-bold xl:mb-4 mb-2">Shop by Categories</h1>
      <div className="flex gap-4">
        {categories.map((category, index) => (
          <motion.div 
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-2xl bg-[#22C55E]/10 hover:shadow-xl shadow-md hover:-translate-y-1 cursor-pointer duration-500 ease-in-out flex gap-4 justify-center items-center">
              <Image src={category.icon} alt={category.name} width={48} height={48} />
              <p className="font-semibold xl:flex hidden">{category.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Categories
