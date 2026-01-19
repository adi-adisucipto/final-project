import {
  CartResponse,
  AddToCartPayload,
  UpdateCartPayload,
  ApiResponse,
  CartItem,
  Store
} from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await apiCall<ApiResponse<CartResponse>>("/api/cart", {
      method: "GET",
    });
    return response.data!;
  },

  async getCartCount(): Promise<number> {
    const response = await apiCall<ApiResponse<{ count: number }>>(
      "/api/cart/count",
      {
        method: "GET",
      }
    );
    return response.data?.count || 0;
  },

  async addToCart(payload: AddToCartPayload): Promise<CartItem> {
    const response = await apiCall<ApiResponse<CartItem>>("/api/cart", {
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
      `/api/cart/${cartItemId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return response.data!;
  },

  async removeCartItem(cartItemId: string): Promise<void> {
    await apiCall<ApiResponse<void>>(`/api/cart/${cartItemId}`, {
      method: "DELETE",
    });
  },

  async clearCart(): Promise<void> {
    await apiCall<ApiResponse<void>>("/api/cart", {
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