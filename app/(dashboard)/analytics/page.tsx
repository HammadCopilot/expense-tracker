'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyTrendsChart } from '@/components/charts/MonthlyTrendsChart'
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart'
import { TimeRangeSelector, TimeRange } from '@/components/analytics/TimeRangeSelector'
import { useMonthlyTrends, useCategoryBreakdown } from '@/hooks/useAnalytics'
import {
  exportToCSV,
  formatMonthlyTrendsForExport,
  formatCategoryBreakdownForExport,
} from '@/lib/utils/exportUtils'
import { formatCurrency } from '@/lib/formatters'

export default function AnalyticsPage() {
  const [trendsRange, setTrendsRange] = useState<TimeRange>('6')
  const [categoryRange, setCategoryRange] = useState<TimeRange>('1')
  const [categoryChartType, setCategoryChartType] = useState<'pie' | 'donut' | 'bar'>('donut')

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useMonthlyTrends(parseInt(trendsRange))

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategoryBreakdown(parseInt(categoryRange))

  const handleExportTrends = () => {
    if (trendsData?.trends) {
      const exportData = formatMonthlyTrendsForExport(trendsData.trends)
      exportToCSV(exportData, `monthly-trends-${trendsRange}months.csv`)
    }
  }

  const handleExportCategories = () => {
    if (categoryData?.breakdown) {
      const exportData = formatCategoryBreakdownForExport(categoryData.breakdown)
      exportToCSV(exportData, `category-breakdown-${categoryRange}months.csv`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and trends from your spending
        </p>
      </div>

      {/* Monthly Trends Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Monthly Spending Trends</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <TimeRangeSelector
                value={trendsRange}
                onChange={setTrendsRange}
                label="Period"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportTrends}
                disabled={!trendsData?.trends?.length}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trendsLoading && (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          )}
          
          {trendsError && (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-destructive">Failed to load chart data</p>
            </div>
          )}
          
          {trendsData && !trendsLoading && !trendsError && (
            <>
              {trendsData.trends.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">No expense data available</p>
                    <p className="text-sm text-muted-foreground">
                      Add some expenses to see your spending trends
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <Tabs defaultValue="area" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="area">Area Chart</TabsTrigger>
                      <TabsTrigger value="line">Line Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="area" className="h-[350px]">
                      <MonthlyTrendsChart data={trendsData.trends} chartType="area" />
                    </TabsContent>
                    <TabsContent value="line" className="h-[350px]">
                      <MonthlyTrendsChart data={trendsData.trends} chartType="line" />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Spending by Category</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <TimeRangeSelector
                value={categoryRange}
                onChange={setCategoryRange}
                label="Period"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCategories}
                disabled={!categoryData?.breakdown?.length}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          {categoryData && categoryData.breakdown.length > 0 && (
            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold">{formatCurrency(categoryData.total)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expenses: </span>
                <span className="font-semibold">{categoryData.count}</span>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {categoryLoading && (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          )}
          
          {categoryError && (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-destructive">Failed to load chart data</p>
            </div>
          )}
          
          {categoryData && !categoryLoading && !categoryError && (
            <>
              {categoryData.breakdown.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">No expense data available</p>
                    <p className="text-sm text-muted-foreground">
                      Add some expenses to see your category breakdown
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[400px]">
                  <Tabs value={categoryChartType} onValueChange={(v) => setCategoryChartType(v as any)}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="donut">Donut Chart</TabsTrigger>
                      <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="donut" className="h-[350px]">
                      <CategoryBreakdownChart 
                        data={categoryData.breakdown} 
                        chartType="donut"
                        showTopOnly={categoryData.breakdown.length > 8 ? 5 : undefined}
                      />
                    </TabsContent>
                    <TabsContent value="pie" className="h-[350px]">
                      <CategoryBreakdownChart 
                        data={categoryData.breakdown} 
                        chartType="pie"
                        showTopOnly={categoryData.breakdown.length > 8 ? 5 : undefined}
                      />
                    </TabsContent>
                    <TabsContent value="bar" className="h-[350px]">
                      <CategoryBreakdownChart 
                        data={categoryData.breakdown} 
                        chartType="bar"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

