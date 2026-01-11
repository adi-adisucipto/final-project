"use client";

import { cn } from "@/lib/utils";

interface OrderFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function OrderFilter({
  activeFilter,
  onFilterChange,
}: OrderFilterProps) {
  const filters = [
    { label: "Show all", value: "all" },
    { label: "Approved", value: "CONFIRMED" },
    { label: "Rejected", value: "CANCELLED" },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeFilter === filter.value
              ? "bg-gray-800 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}