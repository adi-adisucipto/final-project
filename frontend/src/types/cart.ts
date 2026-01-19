export interface ProductImage {
  id: string;
  imageUrl: string;
  imageKey: string;
}

export interface ProductCategory {
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  images: ProductImage[];
  category?: ProductCategory;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  product: Product;
  store: Store;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface GroupedCartItems {
  store: Store;
  items: CartItem[];
  subtotal: number;
}

export interface AddToCartPayload {
  productId: string;
  storeId: string;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}