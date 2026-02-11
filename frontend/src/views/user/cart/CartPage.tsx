"use client";

import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import ShippingAddress from "@/components/cart/ShippingAddress";
import StoreSection from "@/components/cart/StoreSection";
import CartSummary from "@/components/cart/CartSummary";
import CartSkeleton from "./CartSkeleton";
import { useCart } from "@/hooks/useCart";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { calculateCartTotals } from "@/lib/cart.utils";
import { updateCartItem, removeCartItem, addToCart } from "@/services/cart.services";

export default function CartPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();

  const { cartItems, groupedItems, isLoading, error, fetchCart } = useCart();
  const { address, isLoading: isLoadingAddress } = useShippingAddress();

  const handleCheckout = () => {
    if (!cartItems.length) {
      enqueueSnackbar("Cart is empty", { variant: "warning" });
      return;
    }
    if (!address) {
      enqueueSnackbar("Please select shipping address", { variant: "warning" });
      return;
    }
    router.push("/checkout");
  };

  const { subtotal, discount } = calculateCartTotals(cartItems);

  if (isLoading || isLoadingAddress) return <CartSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-semibold text-gray-800 mb-2">
        Gagal memuat keranjang
        </p>
      <p className="text-sm text-gray-500 mb-6">
        Periksa koneksi internet kamu lalu coba lagi.
      </p>
      <button
        onClick={fetchCart}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
      Coba Lagi
      </button>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <button onClick={() => router.push("/products")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        <ShippingAddress
          firstName={address?.firstName}
          lastName={address?.lastName}
          address={address?.address}
          onChangeAddress={() => router.push("/profile/address")}
        />

        {groupedItems.map((group) => (
          <StoreSection
            key={group.store.id}
            storeName={group.store.name}
            storeAddress={group.store.address}
            items={group.items}
            onUpdateQuantity={async (id, qty) => {
              await updateCartItem(id, { quantity: qty });
              await fetchCart();
            }}
            onRemove={async (id) => {
              await removeCartItem(id);
              await fetchCart();
            }}
          />
    ))}
      </div>
      <CartSummary
        subtotal={subtotal}
        discount={discount}
        onCheckout={handleCheckout}
      />
    </div>
  );
}