"use client";

import { Search } from "lucide-react";

type ProductToolbarProps = {
  searchInput: string;
  searchError?: string;
  appliedSearch?: string;
  storeName?: string;
  sort: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSortChange: (value: string) => void;
};

function ProductToolbar({
  searchInput,
  searchError,
  appliedSearch,
  storeName,
  sort,
  onSearchInputChange,
  onSearchSubmit,
  onSortChange,
}: ProductToolbarProps) {
  let storeMessage = null;
  if (storeName) {
    storeMessage = (
      <p className="mt-1 text-sm text-black/50">
        Shopping at <span className="font-semibold">{storeName}</span>
      </p>
    );
  }

  let searchErrorMessage = null;
  if (searchError) {
    searchErrorMessage = (
      <p className="mt-1 text-xs text-red-500">{searchError}</p>
    );
  }

  let appliedSearchMessage = null;
  if (appliedSearch) {
    appliedSearchMessage = (
      <p className="text-sm text-black/60">
        Showing search for &quot;{appliedSearch}&quot;
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Search for your product</h1>
        {storeMessage}
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
            <input
              type="text"
              placeholder="Search for product.."
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearchSubmit();
                }
              }}
              className="w-full bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={onSearchSubmit}
              className="rounded-full bg-emerald-500 p-2 text-white hover:bg-emerald-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          {searchErrorMessage}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-400"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>
        </div>
      </div>
      {appliedSearchMessage}
    </div>
  );
}

export default ProductToolbar;
