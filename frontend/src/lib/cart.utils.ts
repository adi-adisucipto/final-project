import { CartItem } from "@/types/cart";

export function calculateCartTotals(cartItems: CartItem[]) {
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  return {
    subtotal,
    shipping: 5000,
    discount: 0,
  };
}
