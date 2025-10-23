import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ExpenseService } from '@/lib/services/expenseService'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

/**
 * GET /api/analytics/category-breakdown
 * Get category breakdown data with percentages
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '1' // Default current month

    // Calculate date range
    const months = parseInt(range, 10)
    const endDate = endOfMonth(new Date())
    const startDate = startOfMonth(subMonths(endDate, months - 1))

    // Get category breakdown
    const data = await ExpenseService.getCategoryBreakdown(
      session.user.id,
      startDate,
      endDate
    )

    return NextResponse.json({
      ...data,
      range: months,
      startDate,
      endDate,
    })
  } catch (error) {
    console.error('Error fetching category breakdown:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category breakdown' },
      { status: 500 }
    )
  }
}

