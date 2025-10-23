import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { ExpenseService } from '@/lib/services/expenseService'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

/**
 * GET /api/analytics/monthly-trends
 * Get monthly spending trends data
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
    const range = searchParams.get('range') || '6' // Default 6 months

    // Calculate date range
    const months = parseInt(range, 10)
    const endDate = endOfMonth(new Date())
    const startDate = startOfMonth(subMonths(endDate, months - 1))

    // Get monthly trends data
    const trends = await ExpenseService.getMonthlyTrends(
      session.user.id,
      startDate,
      endDate
    )

    return NextResponse.json({
      trends,
      range: months,
      startDate,
      endDate,
    })
  } catch (error) {
    console.error('Error fetching monthly trends:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monthly trends' },
      { status: 500 }
    )
  }
}

