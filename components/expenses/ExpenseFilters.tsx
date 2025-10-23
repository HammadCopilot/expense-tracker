'use client'

import { useState } from 'react'
import { useCategories } from '@/hooks/useCategories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Filter } from 'lucide-react'

interface ExpenseFiltersProps {
  onFiltersChange: (filters: {
    startDate?: string
    endDate?: string
    categoryId?: string
    minAmount?: number
    maxAmount?: number
  }) => void
}

export function ExpenseFilters({ onFiltersChange }: ExpenseFiltersProps) {
  const { data: categories } = useCategories()
  const [isExpanded, setIsExpanded] = useState(false)

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
    minAmount: '',
    maxAmount: '',
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Convert to the format expected by the API
    const apiFilters = {
      ...(newFilters.startDate && { startDate: newFilters.startDate }),
      ...(newFilters.endDate && { endDate: newFilters.endDate }),
      ...(newFilters.categoryId && { categoryId: newFilters.categoryId }),
      ...(newFilters.minAmount && {
        minAmount: parseFloat(newFilters.minAmount),
      }),
      ...(newFilters.maxAmount && {
        maxAmount: parseFloat(newFilters.maxAmount),
      }),
    }

    onFiltersChange(apiFilters)
  }

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      categoryId: '',
      minAmount: '',
      maxAmount: '',
    })
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  if (!isExpanded) {
    return (
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Active
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-category">Category</Label>
            <Select
              value={filters.categoryId}
              onValueChange={(value) => handleFilterChange('categoryId', value)}
            >
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-start-date">Start Date</Label>
            <Input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              max={filters.endDate || new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* End Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-end-date">End Date</Label>
            <Input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              min={filters.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Min Amount Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-min-amount">Min Amount</Label>
            <Input
              id="filter-min-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />
          </div>

          {/* Max Amount Filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-max-amount">Max Amount</Label>
            <Input
              id="filter-max-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

