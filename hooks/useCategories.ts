import { useQuery } from '@tanstack/react-query'

interface Category {
  id: string
  userId: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Fetch all categories for the authenticated user
 */
export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories')

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  })
}

