"use client";

import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { ShoppingBag } from "lucide-react";
import ShippingAddress from "@/components/cart/ShippingAddress";
import StoreSection from "@/components/cart/StoreSection";
import CartSummary from "@/components/cart/CartSummary";
import AddOnProduct from "@/components/cart/AddOnProduct";
import CartSkeleton from "./CartSkeleton";
import { useCart } from "@/hooks/useCart";
import { useShippingAddress } from "@/hooks/useShippingAddress";
import { ADD_ON_PRODUCTS } from "./komponent/addOnProducts";
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

  const { subtotal, shipping, discount } = calculateCartTotals(cartItems);

  if (isLoading || isLoadingAddress) return <CartSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={fetchCart}>Retry</button>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
        <button onClick={() => router.push("/products")}>Mulai Belanja</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
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
        <div className="grid grid-cols-4 gap-4 mt-8">
          {ADD_ON_PRODUCTS.map((p) => (
            <AddOnProduct
              key={p.id}
              {...p}
              onAddToCart={async (id) => {
                await addToCart({
                  productId: id,
                  storeId: groupedItems[0]?.store.id,
                  quantity: 1,
                });
                await fetchCart();
              }}
            />
          ))}
        </div>
      </div>
      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        discount={discount}
        onCheckout={handleCheckout}
      />
    </div>
  );
}