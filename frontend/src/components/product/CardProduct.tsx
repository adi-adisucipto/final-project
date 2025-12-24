import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface ProductItem {
    image: string;
    categories: string;
    title: string;
    price: number;
}

interface ProductsProps {
    data: ProductItem;
}

function Products({data} : ProductsProps) {
  return (
    <div className="shadow-xl rounded-xl p-3">
        <div className="h-50 bg-gray-50 rounded-xl border border-black/20 flex justify-center items-center">
            <Image src={data.image} alt="product" width={150} height={150} />
        </div>
        <div className="py-1">
            <p className="font-semibold text-black/30">{data.categories}</p>
            <h3 className="font-bold pt-2">{data.title}</h3>
            <h1 className="font-bold text-3xl pt-3">{Number(data.price).toLocaleString("id-ID", {style: "currency", currency: "IDR"})}</h1>
            <button className="flex gap-2 justify-center items-center text-white bg-[#22C55E] hover:bg-[#22C55E]/80 w-full py-2 rounded-xl mt-5 cursor-pointer">
                Add Cart
                <ShoppingCart className="w-5 h-5"/>
            </button>
        </div>
    </div>
  )
}

export default Products
