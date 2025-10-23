/**
 * Test Suite: AITEAM-487 - Delete Expense
 * 
 * Test Cases:
 * TC-ET-016: Delete Expense Successfully
 * TC-ET-017: Cancel Expense Deletion
 * TC-ET-018: Delete Expense with Receipt Attached
 * TC-ET-019: Delete Last Remaining Expense
 * TC-ET-020: Attempt to Delete Already Deleted Expense
 * TC-ET-021: Delete Multiple Expenses Sequentially
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DeleteExpenseDialog } from '@/components/expenses/DeleteExpenseDialog'
import * as useExpensesHook from '@/hooks/useExpenses'

jest.mock('@/hooks/useExpenses')

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

describe('DeleteExpenseDialog - Delete Expense (AITEAM-487)', () => {
  const mockDeleteExpense = jest.fn()
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(useExpensesHook, 'useDeleteExpense').mockReturnValue({
      mutateAsync: mockDeleteExpense,
      isPending: false,
    } as any)
  })

  // TC-ET-016: Delete Expense Successfully
  test('TC-ET-016: should successfully delete expense', async () => {
    const user = userEvent.setup()
    mockDeleteExpense.mockResolvedValueOnce({ message: 'Expense deleted successfully' })

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-1"
        expenseName="Food"
      />,
      { wrapper: createWrapper() }
    )

    // Verify confirmation dialog content
    expect(screen.getByText(/delete expense/i)).toBeInTheDocument()
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    expect(screen.getByText(/food/i)).toBeInTheDocument()
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('exp-1')
    })

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  // TC-ET-017: Cancel Expense Deletion
  test('TC-ET-017: should cancel deletion and not delete expense', async () => {
    const user = userEvent.setup()

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-1"
        expenseName="Food"
      />,
      { wrapper: createWrapper() }
    )

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockDeleteExpense).not.toHaveBeenCalled()
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  // TC-ET-018: Delete Expense with Receipt Attached
  test('TC-ET-018: should warn about receipt deletion', async () => {
    const user = userEvent.setup()
    mockDeleteExpense.mockResolvedValueOnce({ message: 'Expense and receipts deleted' })

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-1"
        expenseName="Food"
      />,
      { wrapper: createWrapper() }
    )

    // Verify warning about receipts
    expect(screen.getByText(/delete any attached receipts/i)).toBeInTheDocument()

    // Proceed with deletion
    const deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('exp-1')
    })
  })

  // TC-ET-019: Delete Last Remaining Expense
  test('TC-ET-019: should allow deleting the last expense', async () => {
    const user = userEvent.setup()
    mockDeleteExpense.mockResolvedValueOnce({ message: 'Expense deleted successfully' })

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="last-exp"
        expenseName="Last Expense"
      />,
      { wrapper: createWrapper() }
    )

    const deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('last-exp')
    })
  })

  // TC-ET-020: Attempt to Delete Already Deleted Expense
  test('TC-ET-020: should handle error when deleting non-existent expense', async () => {
    const user = userEvent.setup()
    mockDeleteExpense.mockRejectedValueOnce(new Error('Expense not found'))

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="non-existent"
        expenseName="Deleted Expense"
      />,
      { wrapper: createWrapper() }
    )

    const deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('non-existent')
    })

    // Error should be handled by the mutation's onError callback
  })

  // TC-ET-021: Delete Multiple Expenses Sequentially
  test('TC-ET-021: should handle sequential deletions', async () => {
    const user = userEvent.setup()
    mockDeleteExpense
      .mockResolvedValueOnce({ message: 'First expense deleted' })
      .mockResolvedValueOnce({ message: 'Second expense deleted' })

    const { rerender } = render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-1"
        expenseName="First Expense"
      />,
      { wrapper: createWrapper() }
    )

    // Delete first expense
    let deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('exp-1')
    })

    // Reopen for second expense
    rerender(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-2"
        expenseName="Second Expense"
      />
    )

    // Delete second expense
    deleteButton = screen.getByRole('button', { name: /delete expense/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(mockDeleteExpense).toHaveBeenCalledWith('exp-2')
      expect(mockDeleteExpense).toHaveBeenCalledTimes(2)
    })
  })

  // Test loading state
  test('should disable buttons while deletion is pending', async () => {
    const user = userEvent.setup()
    
    jest.spyOn(useExpensesHook, 'useDeleteExpense').mockReturnValue({
      mutateAsync: mockDeleteExpense,
      isPending: true,
    } as any)

    render(
      <DeleteExpenseDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        expenseId="exp-1"
        expenseName="Food"
      />,
      { wrapper: createWrapper() }
    )

    const deleteButton = screen.getByRole('button', { name: /delete expense/i })
    const cancelButton = screen.getByRole('button', { name: /cancel/i })

    expect(deleteButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })
})

