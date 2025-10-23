import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ExpenseInput } from '@/lib/validations'

interface Expense {
  id: string
  userId: string
  categoryId: string
  amount: number
  description: string | null
  expenseDate: string
  location: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    description: string | null
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

interface ExpenseFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  minAmount?: number
  maxAmount?: number
}

/**
 * Fetch all expenses for the authenticated user
 */
export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery<Expense[]>({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.categoryId) params.append('categoryId', filters.categoryId)
      if (filters?.minAmount)
        params.append('minAmount', filters.minAmount.toString())
      if (filters?.maxAmount)
        params.append('maxAmount', filters.maxAmount.toString())

      const response = await fetch(`/api/expenses?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch expenses')
      }

      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch a single expense by ID
 */
export const useExpense = (id: string) => {
  return useQuery<Expense>({
    queryKey: ['expense', id],
    queryFn: async () => {
      const response = await fetch(`/api/expenses/${id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch expense')
      }

      return response.json()
    },
    enabled: !!id,
  })
}

/**
 * Create a new expense
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ExpenseInput) => {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create expense')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create expense')
    },
  })
}

/**
 * Update an existing expense
 */
export const useUpdateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<ExpenseInput>
    }) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update expense')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense'] })
      toast.success('Expense updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update expense')
    },
  })
}

/**
 * Delete an expense
 */
export const useDeleteExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete expense')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete expense')
    },
  })
}

