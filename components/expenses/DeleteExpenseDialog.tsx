'use client'

import { useDeleteExpense } from '@/hooks/useExpenses'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'

interface DeleteExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenseId: string
  expenseName: string
}

export function DeleteExpenseDialog({
  open,
  onOpenChange,
  expenseId,
  expenseName,
}: DeleteExpenseDialogProps) {
  const deleteExpense = useDeleteExpense()

  const handleDelete = async () => {
    await deleteExpense.mutateAsync(expenseId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Expense</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the expense &quot;{expenseName}
            &quot;? This action cannot be undone and will also delete any
            attached receipts.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteExpense.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

