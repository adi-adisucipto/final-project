import axios from "axios";
import { getSession } from "next-auth/react";
import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  ApiResponse,
  CartItem,
  Store,
} from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const session = await getSession();
  const token = (session as { accessToken?: string })?.accessToken;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const axiosRequest = async <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  data?: unknown
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  try {
    const res = await axios.request<T>({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Request failed";

      throw new Error(message);
    }

    throw new Error("Unexpected error occurred");
  }
};

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const res = await axiosRequest<ApiResponse<CartResponse>>(
      "GET",
      "/cart"
    );
    return res.data!;
  },

  async getCartCount(): Promise<number> {
    const res = await axiosRequest<ApiResponse<{ count: number }>>(
      "GET",
      "/cart/count"
    );
    return res.data?.count ?? 0;
  },

  async addToCart(payload: AddToCartPayload): Promise<CartItem> {
    const res = await axiosRequest<ApiResponse<CartItem>>(
      "POST",
      "/cart",
      payload
    );
    return res.data!;
  },

  async updateCartItem(
    cartItemId: string,
    payload: UpdateCartPayload
  ): Promise<CartItem | { deleted: boolean }> {
    const res = await axiosRequest<
      ApiResponse<CartItem | { deleted: boolean }>
    >("PATCH", `/cart/${cartItemId}`, payload);

    return res.data!;
  },

  async removeCartItem(cartItemId: string): Promise<void> {
    await axiosRequest<ApiResponse<void>>(
      "DELETE",
      `/cart/${cartItemId}`
    );
  },

  async clearCart(): Promise<void> {
    await axiosRequest<ApiResponse<void>>("DELETE", "/cart");
  },

  groupCartItemsByStore(items: CartItem[]) {
    interface GroupedStore {
      store: Store;
      items: CartItem[];
      subtotal: number;
    }

    const grouped = items.reduce<Record<string, GroupedStore>>(
      (acc, item) => {
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
      },
      {}
    );

    return Object.values(grouped);
  },
};
