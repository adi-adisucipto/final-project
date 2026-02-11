import { Plus, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { Ring } from 'react-css-spinners';

export interface ProductItem {
    id: string,
    name: string,
    category?: string,
    price?: string | number,
    discont?: string,
    quantity?: string | number,
    image?: string
}

interface ProductProps {
    product: ProductItem;
    onAddToCart: (id: string) => void;
    loading: boolean;
}

function CardProducts({product, onAddToCart, loading}: ProductProps) {
  return (
    <div className="shadow-xl rounded-xl border border-black/10 w-full h-full">
        <div className='relative w-full xl:h-100 md:h-90 h-55 overflow-hidden rounded-t-xl bg-gray-50'>
            <Image 
                src={product.image ?? "/Indomilk.jpg"}
                alt='product' 
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className='object-cover hover:scale-105 transition-transform duration-500'
                priority
            />
        </div>
        <div className='px-4 py-2 flex flex-col justify-between gap-4'>
            <div>
                <p className='text-green-600 tracking-widest font-bold xl:text-sm text-xs'>{product.category}</p>
                <h3 className='font-bold xl:text-xl leading-tight line-clamp-2'>{product.name}</h3>
            </div>
            <div>
                {product.discont ? (
                    <div className='flex items-center gap-2'>
                        <div className='text-xs text-gray-400 line-through'>{product.price}</div>
                        <div className='xl:text-lg font-bold text-green-500'>{product.discont}</div>
                    </div>
                ) : (
                    <div className='xl:text-xl font-bold text-red-500'>{product.price}</div>
                )}
            </div>
            <div className='text-xs font-bold flex justify-between items-center'>
                <div>
                    <p className='text-slate-400'>Sisa stock</p>
                    <p>{product.quantity} pcs</p>
                </div>

                <button className='bg-green-500 p-3 rounded-md text-white hover:bg-green-400 cursor-pointer group' onClick={() => onAddToCart(product.id)} disabled={loading}>
                    {loading ? (
                        <Ring size={20} thickness={3}/>
                    ) : (
                        <Plus className="group-hover:rotate-90 transition-transform duration-300"/>
                    )}
                </button>
            </div>
        </div>
    </div>
  )
}

export default CardProducts
