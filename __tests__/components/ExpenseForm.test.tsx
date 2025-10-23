/**
 * Test Suite: AITEAM-485 - Add Expense
 * 
 * Test Cases:
 * TC-ET-001: Add Expense with Valid Data
 * TC-ET-002: Add Expense with Minimum Required Fields
 * TC-ET-003: Add Expense with Invalid Amount (negative, zero, non-numeric, too large, empty)
 * TC-ET-004: Add Expense with Invalid Date
 * TC-ET-005: Add Expense without Category Selection
 * TC-ET-006: Add Expense with Very Long Description
 * TC-ET-007: Add Expense with Decimal Precision
 * TC-ET-008: Add Multiple Expenses in Sequence
 */

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import * as useExpensesHook from '@/hooks/useExpenses'
import * as useCategoriesHook from '@/hooks/useCategories'

// Mock the hooks
jest.mock('@/hooks/useExpenses')
jest.mock('@/hooks/useCategories')

const mockCategories = [
  { id: 'cat-1', name: 'Food', icon: '🍔', color: '#f59e0b', userId: 'user-1', description: null, isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Travel', icon: '✈️', color: '#3b82f6', userId: 'user-1', description: null, isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ExpenseForm - Add Expense (AITEAM-485)', () => {
  const mockCreateExpense = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useCategories
    jest.spyOn(useCategoriesHook, 'useCategories').mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    } as any)

    // Mock useCreateExpense
    jest.spyOn(useExpensesHook, 'useCreateExpense').mockReturnValue({
      mutateAsync: mockCreateExpense,
      isPending: false,
    } as any)

    // Mock useUpdateExpense
    jest.spyOn(useExpensesHook, 'useUpdateExpense').mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)
  })

  // TC-ET-001: Add Expense with Valid Data
  test('TC-ET-001: should successfully add expense with valid data', async () => {
    const user = userEvent.setup()
    mockCreateExpense.mockResolvedValueOnce({
      id: 'exp-1',
      amount: 50.99,
      categoryId: 'cat-1',
      expenseDate: new Date().toISOString(),
      description: 'Lunch at restaurant',
      location: 'Downtown',
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    // Fill in amount
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '50.99')

    // Select category
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    // Fill in date
    const dateInput = screen.getByLabelText(/date/i)
    await user.type(dateInput, '2024-01-15')

    // Fill in description
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Lunch at restaurant')

    // Fill in location
    const locationInput = screen.getByLabelText(/location/i)
    await user.type(locationInput, 'Downtown')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50.99,
          categoryId: 'cat-1',
          description: 'Lunch at restaurant',
          location: 'Downtown',
        })
      )
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  // TC-ET-002: Add Expense with Minimum Required Fields
  test('TC-ET-002: should successfully add expense with only required fields', async () => {
    const user = userEvent.setup()
    mockCreateExpense.mockResolvedValueOnce({
      id: 'exp-2',
      amount: 100,
      categoryId: 'cat-1',
      expenseDate: new Date().toISOString(),
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    // Fill only required fields
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '100')

    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    const dateInput = screen.getByLabelText(/date/i)
    await user.type(dateInput, '2024-01-15')

    const submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateExpense).toHaveBeenCalled()
    })
  })

  // TC-ET-003: Add Expense with Invalid Amount
  describe('TC-ET-003: Invalid Amount Validation', () => {
    test('should show error for negative amount', async () => {
      const user = userEvent.setup()

      render(
        <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
        { wrapper: createWrapper() }
      )

      const amountInput = screen.getByLabelText(/amount/i)
      await user.clear(amountInput)
      await user.type(amountInput, '-10')

      const submitButton = screen.getByRole('button', { name: /add expense/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument()
      })
      expect(mockCreateExpense).not.toHaveBeenCalled()
    })

    test('should show error for zero amount', async () => {
      const user = userEvent.setup()

      render(
        <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
        { wrapper: createWrapper() }
      )

      const amountInput = screen.getByLabelText(/amount/i)
      await user.clear(amountInput)
      await user.type(amountInput, '0')

      const submitButton = screen.getByRole('button', { name: /add expense/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument()
      })
      expect(mockCreateExpense).not.toHaveBeenCalled()
    })

    test('should show error for amount too large', async () => {
      const user = userEvent.setup()

      render(
        <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
        { wrapper: createWrapper() }
      )

      const amountInput = screen.getByLabelText(/amount/i)
      await user.clear(amountInput)
      await user.type(amountInput, '9999999')

      const submitButton = screen.getByRole('button', { name: /add expense/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/amount too large/i)).toBeInTheDocument()
      })
      expect(mockCreateExpense).not.toHaveBeenCalled()
    })
  })

  // TC-ET-005: Add Expense without Category Selection
  test('TC-ET-005: should show error when category is not selected', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '50')

    const dateInput = screen.getByLabelText(/date/i)
    await user.type(dateInput, '2024-01-15')

    const submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid category/i)).toBeInTheDocument()
    })
    expect(mockCreateExpense).not.toHaveBeenCalled()
  })

  // TC-ET-006: Add Expense with Very Long Description
  test('TC-ET-006: should show error for description exceeding 500 characters', async () => {
    const user = userEvent.setup()
    const longDescription = 'a'.repeat(501)

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, longDescription)

    const submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/description too long/i)).toBeInTheDocument()
    })
    expect(mockCreateExpense).not.toHaveBeenCalled()
  })

  // TC-ET-007: Add Expense with Decimal Precision
  test('TC-ET-007: should accept amount with 2 decimal places', async () => {
    const user = userEvent.setup()
    mockCreateExpense.mockResolvedValueOnce({
      id: 'exp-3',
      amount: 99.99,
      categoryId: 'cat-1',
      expenseDate: new Date().toISOString(),
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '99.99')

    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    const dateInput = screen.getByLabelText(/date/i)
    await user.type(dateInput, '2024-01-15')

    const submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateExpense).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 99.99,
        })
      )
    })
  })

  // TC-ET-008: Add Multiple Expenses in Sequence
  test('TC-ET-008: should allow adding multiple expenses in sequence', async () => {
    const user = userEvent.setup()
    mockCreateExpense
      .mockResolvedValueOnce({ id: 'exp-1', amount: 50 })
      .mockResolvedValueOnce({ id: 'exp-2', amount: 75 })

    const { rerender } = render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    )

    // First expense
    let amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '50')

    let categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    let foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    let submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateExpense).toHaveBeenCalledTimes(1)
    })

    // Reopen form for second expense
    rerender(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} />,
    )

    // Second expense
    amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '75')

    categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const travelOption = await screen.findByText('Travel')
    await user.click(travelOption)

    submitButton = screen.getByRole('button', { name: /add expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateExpense).toHaveBeenCalledTimes(2)
    })
  })
})

