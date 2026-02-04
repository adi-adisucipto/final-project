export interface ProductCategory {
  id: string;
  name: string;
}

export interface StoreSummary {
  id: string;
  name: string;
  address: string;
  cityId: number;
  provinceId: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: ProductCategory | null;
  stock: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductCatalog {
  store: StoreSummary;
  products: CatalogProduct[];
  pagination: PaginationMeta;
}

export interface ProductDetail {
  store: StoreSummary;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category?: ProductCategory | null;
    stock: number;
  };
}
