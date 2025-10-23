import { useQuery } from '@tanstack/react-query'

export interface MonthlyTrend {
  month: string
  total: number
  count: number
}

export interface CategoryBreakdownItem {
  categoryId: string
  categoryName: string
  total: number
  count: number
  color: string
  percentage: number
}

export interface CategoryBreakdownData {
  breakdown: CategoryBreakdownItem[]
  total: number
  count: number
  range: number
  startDate: string
  endDate: string
}

export interface MonthlyTrendsData {
  trends: MonthlyTrend[]
  range: number
  startDate: string
  endDate: string
}

/**
 * Fetch monthly spending trends
 * @param range - Number of months to fetch (3, 6, 12, custom)
 */
export const useMonthlyTrends = (range: number = 6) => {
  return useQuery<MonthlyTrendsData>({
    queryKey: ['analytics', 'monthly-trends', range],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/monthly-trends?range=${range}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch monthly trends')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Fetch category breakdown
 * @param range - Number of months to include (1 = current month, 3, 6, 12, custom)
 */
export const useCategoryBreakdown = (range: number = 1) => {
  return useQuery<CategoryBreakdownData>({
    queryKey: ['analytics', 'category-breakdown', range],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/category-breakdown?range=${range}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch category breakdown')
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

