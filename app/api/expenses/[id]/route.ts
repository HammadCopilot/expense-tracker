import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ExpenseService } from '@/lib/services/expenseService'
import { auth } from '@/lib/auth'
import { updateExpenseSchema } from '@/lib/validations'

/**
 * GET /api/expenses/[id]
 * Fetch a single expense by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const expense = await ExpenseService.getExpenseById(id, session.user.id)

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error fetching expense:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/expenses/[id]
 * Update an existing expense
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validatedData = updateExpenseSchema.parse(body)

    // Update expense
    const expense = await ExpenseService.updateExpense(id, session.user.id, {
      ...(validatedData.amount && { amount: validatedData.amount }),
      ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
      ...(validatedData.expenseDate && {
        expenseDate: new Date(validatedData.expenseDate),
      }),
      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),
      ...(validatedData.location !== undefined && {
        location: validatedData.location,
      }),
      ...(validatedData.tags && { tags: validatedData.tags }),
    })

    return NextResponse.json(expense)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    if (
      error instanceof Error &&
      error.message === 'Expense not found or unauthorized'
    ) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/expenses/[id]
 * Delete an expense
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await ExpenseService.deleteExpense(id, session.user.id)

    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Expense not found or unauthorized'
    ) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

