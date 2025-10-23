'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'

export default function ExpensesPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [filters, setFilters] = useState<{
    startDate?: string
    endDate?: string
    categoryId?: string
    minAmount?: number
    maxAmount?: number
  }>({})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage all your expenses
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <ExpenseFilters onFiltersChange={setFilters} />

      <ExpenseList filters={filters} />

      <ExpenseForm open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}

