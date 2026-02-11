"use client"

import CardProducts, { ProductItem } from "@/components/product/CardProduct"
import { Button } from "@/components/ui/button";
import { addToCart } from "@/services/cart.services";
import { getProductCatalog } from "@/services/product.services";
import Link from "next/link"
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface ProductsProps {
    onOpenModal: () => void
    storeId?: string;
}

function Products({ onOpenModal, storeId } : ProductsProps) {
    const [product, setProduct] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsloading] = useState(false);

    const handleAddToCart = async (productId: string) => {
        setIsloading(true);
        try {
            await addToCart({
                productId: productId,
                storeId: storeId!,
                quantity: 1,
            });

            enqueueSnackbar("Added to cart", { variant: "success" });
            setIsloading(false);
        } catch (error) {
            enqueueSnackbar("Failed to add to cart", { variant: "error" });
            setIsloading(false);
        }
    }

    useEffect(() => {
        if (storeId) {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const data = await getProductCatalog({
                        page: 1,
                        limit: 6,
                        sort: "newest",
                        storeId
                    });
                    const mapped: ProductItem[] = data.products.map((item) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category?.name || "Uncategorized",
                        price: Number(item.price).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR"
                        }),
                        discont: "",
                        quantity: item.stock,
                        image: item.imageUrl || "/Indomilk.jpg"
                    }));
                    setProduct(mapped);
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
                        onAddToCart={(id) => handleAddToCart(id)}
                        loading={isLoading}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Products
