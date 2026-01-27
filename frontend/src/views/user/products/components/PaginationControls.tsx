"use client";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold ${
          isFirst
            ? "cursor-not-allowed border-black/10 text-black/30"
            : "border-black/10 text-black/70 hover:bg-black/5"
        }`}
      >
        Prev
      </button>
      <p className="text-sm text-black/60">
        Page {page} of {totalPages}
      </p>
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold ${
          isLast
            ? "cursor-not-allowed border-black/10 text-black/30"
            : "border-black/10 text-black/70 hover:bg-black/5"
        }`}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationControls;
