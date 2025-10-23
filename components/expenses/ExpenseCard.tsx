'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { MoreVertical, Pencil, Trash2, MapPin, Eye } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatters'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { DeleteExpenseDialog } from '@/components/expenses/DeleteExpenseDialog'
import { ExpenseDetails } from '@/components/expenses/ExpenseDetails'

interface ExpenseCardProps {
  expense: {
    id: string
    amount: number
    categoryId: string
    description: string | null
    expenseDate: string
    location: string | null
    tags: string[]
    category: {
      id: string
      name: string
      icon: string | null
      color: string | null
    }
    receipts: {
      id: string
      fileName: string
      fileUrl: string
      fileSize: number
      mimeType: string
    }[]
  }
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowDetailsDialog(true)}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {expense.category.icon && (
                <span className="text-2xl">{expense.category.icon}</span>
              )}
              <CardTitle className="text-lg font-semibold">
                {expense.category.name}
              </CardTitle>
            </div>
            <CardDescription>
              {format(new Date(expense.expenseDate), 'PPP')}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {formatCurrency(Number(expense.amount))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowDetailsDialog(true); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowEditDialog(true); }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(true); }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {expense.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {expense.description}
            </p>
          )}

          {expense.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{expense.location}</span>
            </div>
          )}

          {expense.receipts.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                {expense.receipts.length} receipt(s) attached
              </p>
            </div>
          )}

          {expense.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {expense.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          <ExpenseDetails expense={expense} />
        </DialogContent>
      </Dialog>

      <ExpenseForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        expense={expense}
      />

      <DeleteExpenseDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        expenseId={expense.id}
        expenseName={expense.category.name}
      />
    </>
  )
}

