import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export interface ExpenseFilters {
  startDate?: Date
  endDate?: Date
  categoryId?: string
  minAmount?: number
  maxAmount?: number
  tags?: string[]
}

export class ExpenseService {
  /**
   * Get user expenses with optional filters
   */
  static async getUserExpenses(userId: string, filters?: ExpenseFilters) {
    const where: Prisma.ExpenseWhereInput = {
      userId,
      ...(filters?.startDate &&
        filters?.endDate && {
          expenseDate: {
            gte: filters.startDate,
            lte: filters.endDate,
          },
        }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.minAmount &&
        filters?.maxAmount && {
          amount: {
            gte: filters.minAmount,
            lte: filters.maxAmount,
          },
        }),
      ...(filters?.tags &&
        filters.tags.length > 0 && {
          tags: {
            hasSome: filters.tags,
          },
        }),
    }

    return await prisma.expense.findMany({
      where,
      include: {
        category: true,
        receipts: true,
      },
      orderBy: {
        expenseDate: 'desc',
      },
    })
  }

  /**
   * Get a single expense by ID
   */
  static async getExpenseById(id: string, userId: string) {
    return await prisma.expense.findFirst({
      where: { id, userId },
      include: {
        category: true,
        receipts: true,
      },
    })
  }

  /**
   * Create a new expense
   */
  static async createExpense(data: {
    userId: string
    amount: number
    categoryId: string
    expenseDate: Date
    description?: string
    location?: string
    tags?: string[]
  }) {
    return await prisma.expense.create({
      data: {
        ...data,
        amount: new Prisma.Decimal(data.amount),
      },
      include: {
        category: true,
        receipts: true,
      },
    })
  }

  /**
   * Update an existing expense
   */
  static async updateExpense(
    id: string,
    userId: string,
    data: Partial<{
      amount: number
      categoryId: string
      expenseDate: Date
      description: string
      location: string
      tags: string[]
    }>
  ) {
    // Verify ownership
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
    })

    if (!expense) {
      throw new Error('Expense not found or unauthorized')
    }

    return await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        ...(data.amount && { amount: new Prisma.Decimal(data.amount) }),
      },
      include: {
        category: true,
        receipts: true,
      },
    })
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(id: string, userId: string) {
    // Verify ownership
    const expense = await prisma.expense.findFirst({
      where: { id, userId },
    })

    if (!expense) {
      throw new Error('Expense not found or unauthorized')
    }

    // This will cascade delete receipts
    return await prisma.expense.delete({
      where: { id },
    })
  }

  /**
   * Get expense statistics for a user
   */
  static async getExpenseStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    })

    const total = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    const byCategory = expenses.reduce(
      (acc, expense) => {
        const categoryName = expense.category.name
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        acc[categoryName] += Number(expense.amount)
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total,
      count: expenses.length,
      byCategory,
      average: expenses.length > 0 ? total / expenses.length : 0,
    }
  }
}

