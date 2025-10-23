/**
 * Test Suite: AITEAM-486 - Edit Expense
 * 
 * Test Cases:
 * TC-ET-009: Edit Expense Successfully
 * TC-ET-010: Edit Expense and Cancel
 * TC-ET-011: Edit Expense with Invalid Data
 * TC-ET-012: Edit Multiple Fields Simultaneously
 * TC-ET-013: Edit Expense Amount Format
 * TC-ET-014: Edit Expense Date to Current Date
 */

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import * as useExpensesHook from '@/hooks/useExpenses'
import * as useCategoriesHook from '@/hooks/useCategories'

jest.mock('@/hooks/useExpenses')
jest.mock('@/hooks/useCategories')

const mockCategories = [
  { id: 'cat-1', name: 'Food', icon: '🍔', color: '#f59e0b', userId: 'user-1', description: null, isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Travel', icon: '✈️', color: '#3b82f6', userId: 'user-1', description: null, isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const mockExpense = {
  id: 'exp-1',
  amount: 50.00,
  categoryId: 'cat-1',
  expenseDate: '2024-01-15T00:00:00.000Z',
  description: 'Original description',
  location: 'Original location',
  tags: ['tag1'],
}

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

describe('ExpenseForm - Edit Expense (AITEAM-486)', () => {
  const mockUpdateExpense = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(useCategoriesHook, 'useCategories').mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    } as any)

    jest.spyOn(useExpensesHook, 'useCreateExpense').mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any)

    jest.spyOn(useExpensesHook, 'useUpdateExpense').mockReturnValue({
      mutateAsync: mockUpdateExpense,
      isPending: false,
    } as any)
  })

  // TC-ET-009: Edit Expense Successfully
  test('TC-ET-009: should successfully edit expense', async () => {
    const user = userEvent.setup()
    mockUpdateExpense.mockResolvedValueOnce({
      ...mockExpense,
      amount: 75.50,
      description: 'Updated description',
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    // Verify form is pre-populated
    expect(screen.getByLabelText(/amount/i)).toHaveValue(50)
    expect(screen.getByLabelText(/description/i)).toHaveValue('Original description')

    // Update amount
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '75.50')

    // Update description
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Updated description')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /update expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalledWith({
        id: 'exp-1',
        data: expect.objectContaining({
          amount: 75.50,
          description: 'Updated description',
        }),
      })
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  // TC-ET-010: Edit Expense and Cancel
  test('TC-ET-010: should cancel editing without saving changes', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    // Make some changes
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '100')

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockUpdateExpense).not.toHaveBeenCalled()
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  // TC-ET-011: Edit Expense with Invalid Data
  test('TC-ET-011: should show validation error when editing with invalid data', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    // Enter invalid amount
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '-50')

    const submitButton = screen.getByRole('button', { name: /update expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument()
    })
    expect(mockUpdateExpense).not.toHaveBeenCalled()
  })

  // TC-ET-012: Edit Multiple Fields Simultaneously
  test('TC-ET-012: should successfully update multiple fields at once', async () => {
    const user = userEvent.setup()
    mockUpdateExpense.mockResolvedValueOnce({
      ...mockExpense,
      amount: 125.99,
      categoryId: 'cat-2',
      description: 'Multi-field update',
      location: 'New location',
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    // Update amount
    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '125.99')

    // Change category
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const travelOption = await screen.findByText('Travel')
    await user.click(travelOption)

    // Update description
    const descriptionInput = screen.getByLabelText(/description/i)
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'Multi-field update')

    // Update location
    const locationInput = screen.getByLabelText(/location/i)
    await user.clear(locationInput)
    await user.type(locationInput, 'New location')

    // Submit
    const submitButton = screen.getByRole('button', { name: /update expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalledWith({
        id: 'exp-1',
        data: expect.objectContaining({
          amount: 125.99,
          categoryId: 'cat-2',
          description: 'Multi-field update',
          location: 'New location',
        }),
      })
    })
  })

  // TC-ET-013: Edit Expense Amount Format
  test('TC-ET-013: should handle decimal precision when editing amount', async () => {
    const user = userEvent.setup()
    mockUpdateExpense.mockResolvedValueOnce({
      ...mockExpense,
      amount: 99.99,
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    const amountInput = screen.getByLabelText(/amount/i)
    await user.clear(amountInput)
    await user.type(amountInput, '99.99')

    const submitButton = screen.getByRole('button', { name: /update expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalledWith({
        id: 'exp-1',
        data: expect.objectContaining({
          amount: 99.99,
        }),
      })
    })
  })

  // TC-ET-014: Edit Expense Date to Current Date
  test('TC-ET-014: should allow updating expense date to current date', async () => {
    const user = userEvent.setup()
    const today = new Date().toISOString().split('T')[0]
    mockUpdateExpense.mockResolvedValueOnce({
      ...mockExpense,
      expenseDate: new Date(today).toISOString(),
    })

    render(
      <ExpenseForm open={true} onOpenChange={mockOnOpenChange} expense={mockExpense} />,
      { wrapper: createWrapper() }
    )

    const dateInput = screen.getByLabelText(/date/i)
    await user.clear(dateInput)
    await user.type(dateInput, today)

    const submitButton = screen.getByRole('button', { name: /update expense/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalled()
    })
  })
})

