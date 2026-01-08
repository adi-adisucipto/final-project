import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SubmitAlertDialogProps {
  trigger: React.ReactNode;
  onConfirm: () => void;
}

function ConfirmDialog({trigger, onConfirm}:SubmitAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex gap-2.5 h-full cursor-pointer">
        {trigger}
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
        </AlertDialogHeader>
    
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} className="cursor-pointer rounded-md">Save Address</AlertDialogAction>
          <AlertDialogCancel className="rounded-md bg-red-500 border border-red-500 text-white hover:text-slate-100 hover:border-red-500 hover:bg-red-400">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog
