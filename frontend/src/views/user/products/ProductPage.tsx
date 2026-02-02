"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import useGeolocation from "@/hooks/useGeolocation";
import { cartService } from "@/services/cart.services";
import { useProductCatalog } from "./hooks/useProductCatalog";
import FiltersSidebar from "./components/FiltersSidebar";
import PaginationControls from "./components/PaginationControls";
import ProductGrid from "./components/ProductGrid";
import ProductToolbar from "./components/ProductToolbar";

function ProductPage() {
  const router = useRouter();
  const { status } = useSession();
  const { loaded, coordinates, error: locationError } = useGeolocation();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">(
    "newest"
  );
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState<string | undefined>();
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  let coords: { lat: number; lng: number } | undefined;
  if (loaded && !locationError) {
    const lat = Number(coordinates.lat);
    const lng = Number(coordinates.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      coords = { lat, lng };
    }
  }

  const { catalog, categories, isLoading, priceError } = useProductCatalog({
    search,
    categoryId,
    sort,
    page,
    minPrice,
    maxPrice,
    coords,
    isReady: loaded,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinPrice(minPriceInput);
      setMaxPrice(maxPriceInput);
      setPage(1);
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [minPriceInput, maxPriceInput]);

  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed.length > 80) {
      setSearchError("Search is too long.");
      return;
    }
    setSearchError(undefined);
    setSearch(trimmed);
    setPage(1);
  };

  const handleAddToCart = async (productId: string) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    if (!catalog?.store.id) return;
    try {
      await cartService.addToCart({
        productId,
        storeId: catalog.store.id,
        quantity: 1,
      });
      enqueueSnackbar("Added to cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add to cart", { variant: "error" });
    }
  };

  const handleCategoryChange = (id?: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value.replace(/\D/g, ""));
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value.replace(/\D/g, ""));
  };

  const handleSortChange = (value: string) => {
    if (value === "price_asc" || value === "price_desc" || value === "newest") {
      setSort(value);
    }
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <ProductToolbar
        searchInput={searchInput}
        searchError={searchError}
        appliedSearch={search}
        storeName={catalog?.store.name}
        sort={sort}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onSortChange={handleSortChange}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <FiltersSidebar
          categories={categories}
          activeCategory={categoryId}
          minPrice={minPriceInput}
          maxPrice={maxPriceInput}
          priceError={priceError}
          onCategoryChange={handleCategoryChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
        />
        <div>
          {locationError ? (
            <p className="mb-3 text-sm text-black/50">
              Location blocked. Showing main store products.
            </p>
          ) : null}
          <ProductGrid
            products={catalog?.products ?? []}
            isLoading={isLoading || !loaded}
            storeId={catalog?.store.id}
            onAddToCart={handleAddToCart}
          />
          {catalog?.pagination ? (
            <PaginationControls
              page={catalog.pagination.page}
              totalPages={catalog.pagination.totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
