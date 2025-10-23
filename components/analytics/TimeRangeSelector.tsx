'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type TimeRange = '1' | '3' | '6' | '12'

interface TimeRangeSelectorProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  label?: string
}

export function TimeRangeSelector({
  value,
  onChange,
  label = 'Time Period',
}: TimeRangeSelectorProps) {
  const ranges = [
    { value: '1', label: 'This Month' },
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 12 Months' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{label}:</span>
      <div className="hidden sm:flex gap-2">
        {ranges.map((range) => (
          <Button
            key={range.value}
            variant={value === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(range.value as TimeRange)}
          >
            {range.label}
          </Button>
        ))}
      </div>
      <div className="sm:hidden">
        <Select value={value} onValueChange={(v) => onChange(v as TimeRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ranges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

