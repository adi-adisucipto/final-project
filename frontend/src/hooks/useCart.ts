import { useState, useEffect } from "react";
import { cartService } from "@/services/cart.services";
import { CartItem, GroupedCartItems } from "@/types/cart";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedCartItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCartItems(data.items);
      setGroupedItems(cartService.groupCartItemsByStore(data.items));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cartItems,
    groupedItems,
    isLoading,
    error,
    fetchCart,
  };
}
