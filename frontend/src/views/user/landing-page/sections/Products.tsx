"use client"

import CardProducts from "@/components/product/CardProduct"
import { Button } from "@/components/ui/button";
import { productsByStore } from "@/services/nearStores"
import Link from "next/link"
import { useEffect, useState } from "react";
import ModalStore from "../components/ModalStore";

interface ProductsProps {
    onOpenModal: () => void
    storeId?: string;
}

function Products({ onOpenModal, storeId } : ProductsProps) {
    const [product, setProduct] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (storeId) {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const data = await productsByStore(storeId);
                    setProduct(data.product.products); 

                    console.log(data.product.products)
                } catch (error) {
                    console.error("Failed to fetch products", error);
                } finally {
                    setLoading(false);
                }
            }

            fetchProducts();
        }
    }, [storeId]);

  if (!storeId) return <div>Pilih toko terlebih dahulu...</div>;
  if (loading) return <div>Loading products...</div>;

  if(product.length == 0) {
    return (
        <div className="mt-8 border border-slate-200 p-4 rounded-xl flex flex-col justify-center items-center gap-4">
            <div className="font-bold">Toko belum memiliki product</div>
            <Button className="rounded-md" onClick={onOpenModal}>Pilih Toko lain</Button>
        </div>
    )
  }
  return (
    <div className="xl:my-8 my-4 px-4 xl:px-0">
        <div className="flex justify-between items-center xl:mb-4 mb-2">
            <h1 className="xl:text-[24px] text-[20px] font-bold">Best Deals Near You</h1>
            <Link
                href={storeId ? `/products?storeId=${storeId}` : "/products"}
                className="font-bold xl:text-lg text-green-500 hover:text-green-400"
            >
                View All
            </Link>
        </div>

        <div className="grid xl:grid-cols-3 gap-4 md:grid-cols-3 grid-cols-2 h-full">
            {product.map((productItem, index) => (
                <div key={index}>
                    <CardProducts
                        product={productItem}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Products
