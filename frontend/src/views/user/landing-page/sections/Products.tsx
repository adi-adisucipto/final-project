import CardProducts from "@/components/product/CardProduct"
import Link from "next/link"

const products = [
    {
        name: "indomilk kental manis swiss choco (260g)",
        category: "Drinks",
        price: "Rp8.900",
        discont: "Rp7.000",
        stock: "50",
    },
    {
        name: "indomilk kental manis swiss choco (260g)",
        category: "Drinks",
        price: "Rp8.900",
        discont: "",
        stock: "50",
    },
    {
        name: "indomilk kental manis swiss choco (260g)",
        category: "Drinks",
        price: "Rp8.900",
        discont: "Rp7.000",
        stock: "50",
    },
]

function Products() {
  return (
    <div className="xl:my-8 my-4 px-4 xl:px-0">
        <div className="flex justify-between items-center xl:mb-4 mb-2">
            <h1 className="xl:text-[24px] text-[20px] font-bold">Best Deals Near You</h1>
            <Link href={"/products"} className="font-bold xl:text-lg text-green-500 hover:text-green-400">View All</Link>
        </div>

        <div className="grid xl:grid-cols-3 gap-4 md:grid-cols-3 grid-cols-2 h-full">
            {products.map((product, index) => (
                <div key={index}>
                    <CardProducts
                        product={product}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Products
