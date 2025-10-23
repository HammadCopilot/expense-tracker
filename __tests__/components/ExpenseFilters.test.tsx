/**
 * Test Suite: AITEAM-488 - Categorize Expenses
 * 
 * Test Cases:
 * TC-ET-023: View Available Categories
 * TC-ET-024: Select Category When Adding Expense
 * TC-ET-025: Change Category When Editing Expense
 * TC-ET-026: Category Display Consistency
 * TC-ET-027: Default Category Selection
 * TC-ET-028: Filter Expenses by Category
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import * as useCategoriesHook from '@/hooks/useCategories'

jest.mock('@/hooks/useCategories')

const mockCategories = [
  { id: 'cat-1', name: 'Food', icon: '🍔', color: '#f59e0b', userId: 'user-1', description: 'Food expenses', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Travel', icon: '✈️', color: '#3b82f6', userId: 'user-1', description: 'Travel expenses', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Utilities', icon: '💡', color: '#8b5cf6', userId: 'user-1', description: 'Utility bills', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Entertainment', icon: '🎮', color: '#ec4899', userId: 'user-1', description: 'Entertainment', isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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

describe('ExpenseFilters - Categorize Expenses (AITEAM-488)', () => {
  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(useCategoriesHook, 'useCategories').mockReturnValue({
      data: mockCategories,
      isLoading: false,
      error: null,
    } as any)
  })

  // TC-ET-023: View Available Categories
  test('TC-ET-023: should display all available categories in filter', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Open category dropdown
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)

    // Verify all categories are displayed
    await waitFor(() => {
      expect(screen.getByText('Food')).toBeInTheDocument()
      expect(screen.getByText('Travel')).toBeInTheDocument()
      expect(screen.getByText('Utilities')).toBeInTheDocument()
      expect(screen.getByText('Entertainment')).toBeInTheDocument()
    })
  })

  // TC-ET-024: Select Category When Adding Expense
  // (This is already tested in ExpenseForm tests, but we can verify the filter)
  test('TC-ET-024: should allow selecting a category filter', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Select category
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    
    const foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          categoryId: 'cat-1',
        })
      )
    })
  })

  // TC-ET-026: Category Display Consistency
  test('TC-ET-026: should display category icons consistently', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Open category dropdown
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)

    // Verify icons are displayed with names
    await waitFor(() => {
      const foodOption = screen.getByText('Food').closest('div')
      expect(foodOption).toHaveTextContent('🍔')
    })
  })

  // TC-ET-028: Filter Expenses by Category
  test('TC-ET-028: should filter expenses by selected category', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Select category
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    
    const travelOption = await screen.findByText('Travel')
    await user.click(travelOption)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        categoryId: 'cat-2',
      })
    })
  })

  // Test date range filtering
  test('should allow filtering by date range', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Set start date
    const startDateInput = screen.getByLabelText(/start date/i)
    await user.type(startDateInput, '2024-01-01')

    // Set end date
    const endDateInput = screen.getByLabelText(/end date/i)
    await user.type(endDateInput, '2024-01-31')

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String),
        })
      )
    })
  })

  // Test amount range filtering
  test('should allow filtering by amount range', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Set min amount
    const minAmountInput = screen.getByLabelText(/min amount/i)
    await user.type(minAmountInput, '10')

    // Set max amount
    const maxAmountInput = screen.getByLabelText(/max amount/i)
    await user.type(maxAmountInput, '100')

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          minAmount: 10,
          maxAmount: 100,
        })
      )
    })
  })

  // Test clearing filters
  test('should clear all filters', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Set a filter
    const categorySelect = screen.getByRole('combobox', { name: /category/i })
    await user.click(categorySelect)
    const foodOption = await screen.findByText('Food')
    await user.click(foodOption)

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear all/i })
    await user.click(clearButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({})
    })
  })

  // Test collapse filters
  test('should collapse filter panel', async () => {
    const user = userEvent.setup()

    render(
      <ExpenseFilters onFiltersChange={mockOnFiltersChange} />,
      { wrapper: createWrapper() }
    )

    // Expand filters
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Verify expanded
    expect(screen.getByText(/filters/i)).toBeInTheDocument()

    // Collapse
    const closeButton = screen.getByRole('button', { name: '' }) // X button
    await user.click(closeButton)

    // Should show compact button again
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument()
    })
  })
})

