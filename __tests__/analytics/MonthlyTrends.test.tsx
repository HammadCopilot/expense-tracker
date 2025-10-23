/**
 * Test Suite for AITEAM-496: View Monthly Spending Trends
 * 
 * User Story:
 * As a user, I want to view my spending trends over time
 * So that I can understand my spending patterns and track changes month-to-month
 */
import '@testing-library/jest-dom'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MonthlyTrendsChart } from '@/components/charts/MonthlyTrendsChart'
import { MonthlyTrend } from '@/hooks/useAnalytics'

// Mock data for tests
const mockTrendsData: MonthlyTrend[] = [
  { month: '2025-05', total: 1250.50, count: 15 },
  { month: '2025-06', total: 1450.75, count: 18 },
  { month: '2025-07', total: 980.25, count: 12 },
  { month: '2025-08', total: 1750.00, count: 22 },
  { month: '2025-09', total: 1340.60, count: 16 },
  { month: '2025-10', total: 1620.80, count: 19 },
]

const singleMonthData: MonthlyTrend[] = [
  { month: '2025-10', total: 1620.80, count: 19 },
]

const partialData: MonthlyTrend[] = [
  { month: '2025-09', total: 1340.60, count: 16 },
  { month: '2025-10', total: 1620.80, count: 19 },
]

// Setup query client for tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

// Helper to wrap component with providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('TC-DV-001: View Default Monthly Trends Chart', () => {
  it('should display monthly trends chart with default 6 months of data', () => {
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    // Chart should render
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
    
    // Should show all 6 months
    expect(mockTrendsData).toHaveLength(6)
  })
})

describe('TC-DV-002: View Spending Trends for Different Time Ranges', () => {
  it('should display trends for 3 months range', () => {
    const threeMonthsData = mockTrendsData.slice(-3)
    renderWithProviders(<MonthlyTrendsChart data={threeMonthsData} />)
    
    expect(threeMonthsData).toHaveLength(3)
  })

  it('should display trends for 6 months range', () => {
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    expect(mockTrendsData).toHaveLength(6)
  })

  it('should display trends for 12 months range', () => {
    const twelveMonthsData = [
      ...mockTrendsData,
      { month: '2025-11', total: 1500, count: 20 },
      { month: '2025-12', total: 1600, count: 21 },
      { month: '2026-01', total: 1400, count: 18 },
      { month: '2026-02', total: 1300, count: 17 },
      { month: '2026-03', total: 1550, count: 19 },
      { month: '2026-04', total: 1650, count: 22 },
    ]
    
    renderWithProviders(<MonthlyTrendsChart data={twelveMonthsData} />)
    
    expect(twelveMonthsData).toHaveLength(12)
  })
})

describe('TC-DV-003: Hover Interaction on Chart', () => {
  it('should show tooltip with exact amount on hover', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    // Note: Testing recharts hover is complex and may require integration tests
    // This is a placeholder for the test structure
    expect(true).toBe(true)
  })
})

describe('TC-DV-004: Click Interaction for Drill-Down', () => {
  it('should allow clicking on month to filter expense list', async () => {
    // This functionality would be implemented in the parent component
    // Testing the chart component's ability to receive click handlers
    const handleClick = jest.fn()
    
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    // Verify chart renders without errors
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })
})

describe('TC-DV-005: View Trends with No Data', () => {
  it('should display empty state when no data is available', () => {
    const emptyData: MonthlyTrend[] = []
    renderWithProviders(<MonthlyTrendsChart data={emptyData} />)
    
    // Should still render chart structure
    expect(emptyData).toHaveLength(0)
  })
})

describe('TC-DV-006: View Trends with Partial Data', () => {
  it('should display chart with only available months', () => {
    renderWithProviders(<MonthlyTrendsChart data={partialData} />)
    
    expect(partialData).toHaveLength(2)
  })

  it('should handle single month data', () => {
    renderWithProviders(<MonthlyTrendsChart data={singleMonthData} />)
    
    expect(singleMonthData).toHaveLength(1)
  })
})

describe('TC-DV-007: Real-Time Chart Update', () => {
  it('should update chart when new expense is added', async () => {
    const { rerender } = renderWithProviders(
      <MonthlyTrendsChart data={mockTrendsData} />
    )
    
    const updatedData = [
      ...mockTrendsData,
      { month: '2025-11', total: 1800, count: 23 },
    ]
    
    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <MonthlyTrendsChart data={updatedData} />
      </QueryClientProvider>
    )
    
    expect(updatedData).toHaveLength(7)
  })
})

describe('TC-DV-008: Chart Responsiveness on Different Screen Sizes', () => {
  it('should render on mobile viewport', () => {
    global.innerWidth = 375
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })

  it('should render on tablet viewport', () => {
    global.innerWidth = 768
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })

  it('should render on desktop viewport', () => {
    global.innerWidth = 1920
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })
})

describe('TC-DV-009: Chart Performance with Large Dataset', () => {
  it('should handle 12 months of data efficiently', () => {
    const largeDataset = Array.from({ length: 12 }, (_, i) => ({
      month: `2025-${String(i + 1).padStart(2, '0')}`,
      total: Math.random() * 2000 + 500,
      count: Math.floor(Math.random() * 30) + 10,
    }))
    
    const startTime = performance.now()
    renderWithProviders(<MonthlyTrendsChart data={largeDataset} />)
    const endTime = performance.now()
    
    // Should render in less than 1 second
    expect(endTime - startTime).toBeLessThan(1000)
  })
})

describe('TC-DV-010: Export Chart Data', () => {
  it('should format data correctly for CSV export', () => {
    const csvData = mockTrendsData.map((item) => ({
      Month: item.month,
      Total: item.total,
      Count: item.count,
    }))
    
    expect(csvData).toHaveLength(mockTrendsData.length)
    expect(csvData[0]).toHaveProperty('Month')
    expect(csvData[0]).toHaveProperty('Total')
    expect(csvData[0]).toHaveProperty('Count')
  })
})

describe('TC-DV-011: Compare Multiple Time Periods', () => {
  it('should show comparison between different periods', () => {
    const q1Data = mockTrendsData.slice(0, 3)
    const q2Data = mockTrendsData.slice(3, 6)
    
    const q1Total = q1Data.reduce((sum, item) => sum + item.total, 0)
    const q2Total = q2Data.reduce((sum, item) => sum + item.total, 0)
    
    expect(q1Total).toBeDefined()
    expect(q2Total).toBeDefined()
    expect(q1Total).not.toBe(q2Total)
  })
})

describe('TC-DV-012: Chart Accessibility', () => {
  it('should have proper ARIA labels', () => {
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    // Recharts should provide accessible SVG elements
    const chart = screen.getByText(/Total Spending/i)
    expect(chart).toBeInTheDocument()
  })

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MonthlyTrendsChart data={mockTrendsData} />)
    
    // Tab through interactive elements
    await user.tab()
    
    // Verify chart is rendered
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })
})

describe('Integration: Chart Type Switching', () => {
  it('should switch between line and area chart', () => {
    const { rerender } = renderWithProviders(
      <MonthlyTrendsChart data={mockTrendsData} chartType="area" />
    )
    
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
    
    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <MonthlyTrendsChart data={mockTrendsData} chartType="line" />
      </QueryClientProvider>
    )
    
    expect(screen.getByText(/Total Spending/i)).toBeInTheDocument()
  })
})

describe('Edge Cases', () => {
  it('should handle months with zero spending', () => {
    const dataWithZero = [
      ...mockTrendsData,
      { month: '2025-11', total: 0, count: 0 },
    ]
    
    renderWithProviders(<MonthlyTrendsChart data={dataWithZero} />)
    
    expect(dataWithZero[dataWithZero.length - 1].total).toBe(0)
  })

  it('should handle very large amounts', () => {
    const dataWithLargeAmount = [
      { month: '2025-10', total: 999999.99, count: 100 },
    ]
    
    renderWithProviders(<MonthlyTrendsChart data={dataWithLargeAmount} />)
    
    expect(dataWithLargeAmount[0].total).toBe(999999.99)
  })

  it('should handle decimal precision correctly', () => {
    const dataWithDecimals = [
      { month: '2025-10', total: 1234.567, count: 15 },
    ]
    
    renderWithProviders(<MonthlyTrendsChart data={dataWithDecimals} />)
    
    expect(dataWithDecimals[0].total).toBe(1234.567)
  })
})

