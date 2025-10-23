import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ExpenseService } from '@/lib/services/expenseService'
import { auth } from '@/lib/auth'
import { expenseSchema } from '@/lib/validations'

/**
 * GET /api/expenses
 * Fetch all expenses for the authenticated user with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const categoryId = searchParams.get('categoryId')
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')

    const filters = {
      ...(startDate && endDate && {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }),
      ...(categoryId && { categoryId }),
      ...(minAmount && maxAmount && {
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount),
      }),
    }

    const expenses = await ExpenseService.getUserExpenses(
      session.user.id,
      filters
    )

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/expenses
 * Create a new expense for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validatedData = expenseSchema.parse(body)

    // Create expense
    const expense = await ExpenseService.createExpense({
      userId: session.user.id,
      amount: validatedData.amount,
      categoryId: validatedData.categoryId,
      expenseDate: new Date(validatedData.expenseDate),
      description: validatedData.description,
      location: validatedData.location,
      tags: validatedData.tags,
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

