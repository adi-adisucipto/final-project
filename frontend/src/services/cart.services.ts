import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  ApiResponse,
  CartItem,
  Store
} from "@/types/cart";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession();
  return (session as unknown as { accessToken?: string })?.accessToken ?? null;
};

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON response:", text);
    throw new Error("Server did not return JSON");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
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
      {
        method: "GET",
      }
    );
    return response.data?.count || 0;
  },

  async addToCart(payload: AddToCartPayload): Promise<CartItem> {
    const response = await apiCall<ApiResponse<CartItem>>("/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data!;
  },

  async updateCartItem(
    cartItemId: string,
    payload: UpdateCartPayload
  ): Promise<CartItem | { deleted: boolean }> {
    const response = await apiCall<ApiResponse<CartItem | { deleted: boolean }>>(
      `/cart/${cartItemId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
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
      acc[storeId].subtotal += Number(item.product.price) * item.quantity;

      return acc;
    }, {} as Record<string, GroupedStore>);

    return Object.values(grouped);
  },
};