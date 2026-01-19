"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { ShoppingBag } from "lucide-react";
import ShippingAddress from "@/components/cart/ShippingAddress";
import StoreSection from "@/components/cart/StoreSection";
import CartSummary from "@/components/cart/CartSummary";
import AddOnProduct from "@/components/cart/AddOnProduct";
import { cartService } from "@/services/cart.services";
import { CartItem, GroupedCartItems } from "@/types/cart";
import { getErrorMessage } from "@/lib/error-handler";

export default function CartPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedCartItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mockdata shipping address
  const [shippingAddress] = useState({
    firstName: "Alamat",
    lastName: "Pengiriman",
    address: "Perumahan Bumi Suko Indah C3 No.09, Jawa Timur, Sidoarjo, Sidoarjo, 61224, Rumah",
  });

  // Mockdata add-on products
  const [addOnProducts] = useState([
    {
      id: "1",
      name: "Aqua Galon Refill 19L",
      category: "Drinks",
      image: "/placeholder-product.png",
      price: 18000,
    },
    {
      id: "2",
      name: "Aqua Galon Refill 19L",
      category: "Drinks",
      image: "/placeholder-product.png",
      price: 18000,
    },
    {
      id: "3",
      name: "Aqua Galon Refill 19L",
      category: "Drinks",
      image: "/placeholder-product.png",
      price: 18000,
    },
    {
      id: "4",
      name: "Aqua Galon Refill 19L",
      category: "Drinks",
      image: "/placeholder-product.png",
      price: 18000,
    },
  ]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCartItems(data.items);
      setGroupedItems(cartService.groupCartItemsByStore(data.items));
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await cartService.updateCartItem(cartItemId, { quantity });
      await fetchCart();
      enqueueSnackbar("Quantity updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: "error" });
      throw err;
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await cartService.removeCartItem(cartItemId);
      await fetchCart();
      enqueueSnackbar("Item removed from cart", { variant: "success" });
    } catch (err) {
enqueueSnackbar(getErrorMessage(err), { variant: "error" });
      throw err;
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const storeId = groupedItems[0]?.store.id || "";
      await cartService.addToCart({ productId, storeId, quantity: 1 });
      await fetchCart();
      enqueueSnackbar("Product added to cart!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: "error" });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }

    if (!shippingAddress.address) {
      enqueueSnackbar("Please select shipping address", { variant: "warning" });
      return;
    }

    setIsProcessing(true);
    try {
      router.push("/checkout");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeAddress = () => {
    router.push("/profile/address");
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);

    const shipping = 5000;
    const discount = 0;

    return { subtotal, shipping, discount };
  };

  const { subtotal, shipping, discount } = calculateTotals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Keranjang Belanja Kosong
          </h2>
          <p className="text-gray-600 mb-6">
            Yuk, mulai belanja sekarang!
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
          >
            Mulai Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShippingAddress
              firstName={shippingAddress.firstName}
              lastName={shippingAddress.lastName}
              address={shippingAddress.address}
              onChangeAddress={handleChangeAddress}
            />
            {groupedItems.map((group) => (
              <StoreSection
                key={group.store.id}
                storeName={group.store.name}
                storeAddress={group.store.address}
                items={group.items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
            {addOnProducts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Add On
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {addOnProducts.map((product) => (
                    <AddOnProduct
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      category={product.category}
                      image={product.image}
                      price={product.price}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}