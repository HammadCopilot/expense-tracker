'use client'

import { useExpenses } from '@/hooks/useExpenses'
import { ExpenseCard } from './ExpenseCard'
import { Loader2, Inbox } from 'lucide-react'

interface ExpenseListProps {
  filters?: {
    startDate?: string
    endDate?: string
    categoryId?: string
    minAmount?: number
    maxAmount?: number
  }
}

export function ExpenseList({ filters }: ExpenseListProps) {
  const { data: expenses, isLoading, error } = useExpenses(filters)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load expenses. Please try again.
        </p>
      </div>
    )
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-1">No expenses found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by adding your first expense.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  )
}

