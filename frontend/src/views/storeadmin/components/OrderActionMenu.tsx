import { MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderActionsMenuProps {
  orderId: string;
  orderStatus: string;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
}

export default function OrderActionsMenu({
  orderId,
  orderStatus,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  onViewDetails,
}: OrderActionsMenuProps) {
  const canApprove =
    orderStatus === "WAITING_CONFIRMATION" && !isApproving && !isRejecting;
  const canReject = canApprove;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="Open actions" className="rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={!canApprove}
          onClick={() => onApprove(orderId)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {isApproving ? "Approving..." : "Approve"}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={!canReject}
          onClick={() => onReject(orderId)}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {isRejecting ? "Rejecting..." : "Reject"}
        </DropdownMenuItem>
        {onViewDetails && (
          <DropdownMenuItem onClick={() => onViewDetails(orderId)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}