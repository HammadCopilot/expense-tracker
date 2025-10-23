'use client'

import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { CategoryBreakdownItem } from '@/hooks/useAnalytics'
import { formatCurrency } from '@/lib/formatters'

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownItem[]
  chartType?: 'pie' | 'donut' | 'bar'
  showTopOnly?: number // Show only top N categories, rest as "Other"
}

export function CategoryBreakdownChart({
  data,
  chartType = 'donut',
  showTopOnly,
}: CategoryBreakdownChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const chartData = useMemo(() => {
    if (!showTopOnly || data.length <= showTopOnly) {
      return data
    }

    const topCategories = data.slice(0, showTopOnly)
    const otherCategories = data.slice(showTopOnly)

    if (otherCategories.length === 0) {
      return topCategories
    }

    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.total, 0)
    const otherCount = otherCategories.reduce((sum, cat) => sum + cat.count, 0)
    const total = data.reduce((sum, cat) => sum + cat.total, 0)

    return [
      ...topCategories,
      {
        categoryId: 'other',
        categoryName: 'Other',
        total: otherTotal,
        count: otherCount,
        color: '#94a3b8',
        percentage: (otherTotal / total) * 100,
      },
    ]
  }, [data, showTopOnly])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{data.categoryName}</p>
          <p className="text-sm text-muted-foreground">
            Amount: {formatCurrency(data.total)}
          </p>
          <p className="text-sm text-muted-foreground">
            Percentage: {data.percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Count: {data.count} expenses
          </p>
        </div>
      )
    }
    return null
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            type="number"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="categoryName"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ categoryName, percentage }) =>
            `${categoryName} (${percentage.toFixed(1)}%)`
          }
          outerRadius={chartType === 'donut' ? 100 : 120}
          innerRadius={chartType === 'donut' ? 60 : 0}
          fill="#8884d8"
          dataKey="total"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry: any) =>
            `${entry.payload.categoryName}: ${formatCurrency(entry.payload.total)}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

