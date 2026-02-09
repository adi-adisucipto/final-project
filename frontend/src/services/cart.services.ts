import axios from "axios";
import { getSession } from "next-auth/react";
import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  ApiResponse,
  CartItem,
} from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getCart(): Promise<CartResponse> {
  try {
    const { data } = await axios.get<ApiResponse<CartResponse>>(
      `${API_BASE_URL}/cart`,
      { headers: await getAuthHeader() }
    );
    return data.data!;
  } catch (error) {
    throw error;
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const { data } = await axios.get<ApiResponse<{ count: number }>>(
      `${API_BASE_URL}/cart/count`,
      { headers: await getAuthHeader() }
    );
    return data.data?.count ?? 0;
  } catch (error) {
    throw error;
  }
}

export async function addToCart(payload: AddToCartPayload): Promise<CartItem> {
  try {
    const { data } = await axios.post<ApiResponse<CartItem>>(
      `${API_BASE_URL}/cart`,
      payload,
      { headers: await getAuthHeader() }
    );
    return data.data!;
  } catch (error) {
    throw error;
  }
}

export async function updateCartItem(
  cartItemId: string,
  payload: UpdateCartPayload
): Promise<CartItem | { deleted: boolean }> {
  try {
    const { data } = await axios.patch<ApiResponse<CartItem | { deleted: boolean }>>(
      `${API_BASE_URL}/cart/${cartItemId}`,
      payload,
      { headers: await getAuthHeader() }
    );
    return data.data!;
  } catch (error) {
    throw error;
  }
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`, {
      headers: await getAuthHeader(),
    });
  } catch (error) {
    throw error;
  }
}

export async function clearCart(): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/cart`, {
      headers: await getAuthHeader(),
    });
  } catch (error) {
    throw error;
  }
}

export function groupCartItemsByStore(items: CartItem[]) {
  const grouped = items.reduce<Record<string, any>>((acc, item) => {
    const storeId = item.storeId;
    if (!acc[storeId]) {
      acc[storeId] = {
        store: item.store,
        items: [],
        subtotal: 0,
      };
    }
    acc[storeId].items.push(item);
    acc[storeId].subtotal += Number(item.product.price) * item.quantity;
    return acc;
  }, {});

  return Object.values(grouped);
}