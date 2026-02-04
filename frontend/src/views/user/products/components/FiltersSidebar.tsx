"use client";

import { ProductCategory } from "@/types/product";

type FiltersSidebarProps = {
  categories: ProductCategory[];
  activeCategory?: string;
  minPrice: string;
  maxPrice: string;
  priceError?: string;
  onCategoryChange: (id?: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

function FiltersSidebar({
  categories,
  activeCategory,
  minPrice,
  maxPrice,
  priceError,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
}: FiltersSidebarProps) {
  let allClassName = "w-full rounded-lg px-3 py-2 text-left text-sm font-medium";
  if (!activeCategory) {
    allClassName += " bg-emerald-50 text-emerald-700";
  } else {
    allClassName += " text-black/70";
  }

  const categoryButtons = categories.map((category) => {
    const isActive = activeCategory === category.id;
    let className = "w-full rounded-lg px-3 py-2 text-left text-sm";
    if (isActive) {
      className += " bg-emerald-50 text-emerald-700";
    } else {
      className += " text-black/70 hover:bg-black/5";
    }
    return (
      <button
        key={category.id}
        type="button"
        onClick={() => onCategoryChange(category.id)}
        className={className}
      >
        {category.name}
      </button>
    );
  });

  let priceErrorMessage = null;
  if (priceError) {
    priceErrorMessage = (
      <p className="mt-2 text-xs text-red-500">{priceError}</p>
    );
  }

  return (
    <aside className="rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="rounded-t-2xl bg-emerald-500 px-4 py-3 text-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Categories
        </h2>
      </div>
      <div className="p-3">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={allClassName}
        >
          All
        </button>
        <div className="mt-2 flex flex-col gap-1">
          {categoryButtons}
        </div>
      </div>
      <div className="border-t border-black/10 p-4">
        <h3 className="text-sm font-semibold text-black/70">Price</h3>
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        {priceErrorMessage}
      </div>
    </aside>
  );
}

export default FiltersSidebar;
