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

  /**
   * Get monthly spending trends
   * Returns aggregated spending data grouped by month
   */
  static async getMonthlyTrends(
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
      select: {
        amount: true,
        expenseDate: true,
      },
      orderBy: {
        expenseDate: 'asc',
      },
    })

    // Group expenses by month
    const monthlyData = expenses.reduce(
      (acc, expense) => {
        const date = new Date(expense.expenseDate)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            total: 0,
            count: 0,
          }
        }
        
        acc[monthKey].total += Number(expense.amount)
        acc[monthKey].count += 1
        
        return acc
      },
      {} as Record<string, { month: string; total: number; count: number }>
    )

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    )
  }

  /**
   * Get category breakdown
   * Returns spending aggregated by category with percentages
   */
  static async getCategoryBreakdown(
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

    // Calculate total for percentage calculation
    const total = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    // Group by category
    const categoryData = expenses.reduce(
      (acc, expense) => {
        const categoryId = expense.category.id
        const categoryName = expense.category.name
        
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName,
            total: 0,
            count: 0,
            color: expense.category.color || '#8884d8',
          }
        }
        
        acc[categoryId].total += Number(expense.amount)
        acc[categoryId].count += 1
        
        return acc
      },
      {} as Record<
        string,
        {
          categoryId: string
          categoryName: string
          total: number
          count: number
          color: string
        }
      >
    )

    // Convert to array, calculate percentages, and sort by total
    const breakdown = Object.values(categoryData)
      .map((category) => ({
        ...category,
        percentage: total > 0 ? (category.total / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)

    return {
      breakdown,
      total,
      count: expenses.length,
    }
  }
}

