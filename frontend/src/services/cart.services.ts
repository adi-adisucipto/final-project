import axios, { AxiosRequestConfig, AxiosError } from "axios";
import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  ApiResponse,
  CartItem,
  Store,
} from "@/types/cart";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession();
  return (session as { accessToken?: string })?.accessToken ?? null;
};

async function apiCall<T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const token = await getAuthToken();

  try {
    const response = await axios.request<T>({
      baseURL: API_BASE_URL,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
      (error.response?.data as {message?: string })?.message ||
      error.message ||
      "Something went wrong";

      throw new Error(message);
    }
    throw new Error("unexpected error occured");
  }
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await apiCall<ApiResponse<CartResponse>>("/cart", {
      method: "GET",
    });
    return response.data!;
  },

  async getCartCount(): Promise<number> {
    const response = await apiCall<ApiResponse<{ count: number }>>(
      "/cart/count",
      { method: "GET" }
    );
    return response.data?.count ?? 0;
  },

  async addToCart(payload: AddToCartPayload): Promise<CartItem> {
    const response = await apiCall<ApiResponse<CartItem>>("/cart", {
      method: "POST",
      data: payload,
    });
    return response.data!;
  },

  async updateCartItem(
    cartItemId: string,
    payload: UpdateCartPayload
  ): Promise<CartItem | { deleted: boolean }> {
    const response = await apiCall<
      ApiResponse<CartItem | { deleted: boolean }>
    >(`/cart/${cartItemId}`, {
      method: "PATCH",
      data: payload,
    });

    return response.data!;
  },

  async removeCartItem(cartItemId: string): Promise<void> {
    await apiCall<ApiResponse<void>>(`/cart/${cartItemId}`, {
      method: "DELETE",
    });
  },

  async clearCart(): Promise<void> {
    await apiCall<ApiResponse<void>>("/cart", {
      method: "DELETE",
    });
  },

  groupCartItemsByStore(items: CartItem[]) {
    interface GroupedStore {
      store: Store;
      items: CartItem[];
      subtotal: number;
    }

    const grouped = items.reduce((acc, item) => {
      const storeId = item.storeId;

      if (!acc[storeId]) {
        acc[storeId] = {
          store: item.store,
          items: [],
          subtotal: 0,
        };
      }

      acc[storeId].items.push(item);
      acc[storeId].subtotal +=
        Number(item.product.price) * item.quantity;

      return acc;
    }, {} as Record<string, GroupedStore>);

    return Object.values(grouped);
  },
};
