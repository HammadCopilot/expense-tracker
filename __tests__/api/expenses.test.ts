/**
 * API Integration Tests for Expense Routes
 * Tests for AITEAM-485, AITEAM-486, AITEAM-487
 */

import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/expenses/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/expenses/[id]/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    expense: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockSession = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  },
}

const mockExpense = {
  id: 'exp-1',
  userId: 'user-123',
  categoryId: 'cat-1',
  amount: 50.00,
  description: 'Test expense',
  expenseDate: new Date('2024-01-15'),
  location: 'Test location',
  tags: ['test'],
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    id: 'cat-1',
    name: 'Food',
    icon: '🍔',
    color: '#f59e0b',
  },
  receipts: [],
}

describe('Expense API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(auth as jest.Mock).mockResolvedValue(mockSession)
  })

  describe('GET /api/expenses', () => {
    it('should return expenses for authenticated user', async () => {
      (prisma.expense.findMany as jest.Mock).mockResolvedValue([mockExpense])

      const request = new NextRequest('http://localhost:3000/api/expenses')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(1)
      expect(data[0]).toMatchObject({
        id: 'exp-1',
        amount: 50.00,
      })
    })

    it('should return 401 for unauthenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/expenses')
      const response = await GET(request)

      expect(response.status).toBe(401)
    })

    it('should filter expenses by date range', async () => {
      (prisma.expense.findMany as jest.Mock).mockResolvedValue([mockExpense])

      const request = new NextRequest(
        'http://localhost:3000/api/expenses?startDate=2024-01-01&endDate=2024-01-31'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user-123',
          }),
        })
      )
    })
  })

  describe('POST /api/expenses', () => {
    it('should create expense with valid data', async () => {
      (prisma.expense.create as jest.Mock).mockResolvedValue(mockExpense)

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          amount: 50.00,
          categoryId: 'cat-1',
          expenseDate: '2024-01-15T00:00:00.000Z',
          description: 'Test expense',
          location: 'Test location',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.id).toBe('exp-1')
    })

    it('should return 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          amount: -10, // Invalid negative amount
          categoryId: 'cat-1',
          expenseDate: '2024-01-15T00:00:00.000Z',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should return 401 for unauthenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          amount: 50,
          categoryId: 'cat-1',
          expenseDate: '2024-01-15T00:00:00.000Z',
        }),
      })

      const response = await POST(request)

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /api/expenses/[id]', () => {
    it('should update expense successfully', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense)
      ;(prisma.expense.update as jest.Mock).mockResolvedValue({
        ...mockExpense,
        amount: 75.00,
      })

      const request = new NextRequest('http://localhost:3000/api/expenses/exp-1', {
        method: 'PUT',
        body: JSON.stringify({
          amount: 75.00,
        }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'exp-1' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.amount).toBe(75.00)
    })

    it('should return 404 for non-existent expense', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/expenses/non-existent', {
        method: 'PUT',
        body: JSON.stringify({
          amount: 75.00,
        }),
      })

      const response = await PUT(request, {
        params: Promise.resolve({ id: 'non-existent' }),
      })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/expenses/[id]', () => {
    it('should delete expense successfully', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense)
      ;(prisma.expense.delete as jest.Mock).mockResolvedValue(mockExpense)

      const request = new NextRequest('http://localhost:3000/api/expenses/exp-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'exp-1' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toContain('deleted successfully')
    })

    it('should return 404 when deleting non-existent expense', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/expenses/non-existent', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'non-existent' }),
      })

      expect(response.status).toBe(404)
    })

    it('should prevent deleting another user\'s expense', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(null) // Returns null because userId doesn't match

      const request = new NextRequest('http://localhost:3000/api/expenses/exp-1', {
        method: 'DELETE',
      })

      const response = await DELETE(request, {
        params: Promise.resolve({ id: 'exp-1' }),
      })

      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/expenses/[id]', () => {
    it('should return single expense', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense)

      const request = new NextRequest('http://localhost:3000/api/expenses/exp-1')
      const response = await GET_BY_ID(request, {
        params: Promise.resolve({ id: 'exp-1' }),
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('exp-1')
    })

    it('should return 404 for non-existent expense', async () => {
      (prisma.expense.findFirst as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/expenses/non-existent')
      const response = await GET_BY_ID(request, {
        params: Promise.resolve({ id: 'non-existent' }),
      })

      expect(response.status).toBe(404)
    })
  })
})

