import { cn } from "@/lib/utils";

interface OrderRowSkeletonProps {
  index: number;
}

export default function OrderRowSkeleton({ index }: OrderRowSkeletonProps) {
  return (
    <tr
      className={cn(
        "border-t border-slate-200",
        index % 2 === 1 && "bg-slate-50"
      )}
    >
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
      </td>

      <td className="px-6 py-4">
        <div className="h-6 w-36 bg-slate-200 rounded-full animate-pulse" />
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </td>

      <td className="px-6 py-4 text-right">
        <div className="inline-block h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
      </td>
    </tr>
  );
}