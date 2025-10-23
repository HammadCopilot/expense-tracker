import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Upload a receipt for an expense
 */
export const useUploadReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, expenseId }: { file: File; expenseId: string }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('expenseId', expenseId)

      const response = await fetch('/api/receipts', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload receipt')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense'] })
      toast.success('Receipt uploaded successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload receipt')
    },
  })
}

/**
 * Delete a receipt
 */
export const useDeleteReceipt = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (receiptId: string) => {
      const response = await fetch(`/api/receipts/${receiptId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete receipt')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense'] })
      toast.success('Receipt deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete receipt')
    },
  })
}

