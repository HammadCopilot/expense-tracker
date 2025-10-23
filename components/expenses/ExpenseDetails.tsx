'use client'

import { format } from 'date-fns'
import { MapPin, Calendar, DollarSign, FileText } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { ReceiptUpload } from './ReceiptUpload'

interface ExpenseDetailsProps {
  expense: {
    id: string
    amount: number
    categoryId: string
    description: string | null
    expenseDate: string
    location: string | null
    tags: string[]
    category: {
      id: string
      name: string
      icon: string | null
      color: string | null
    }
    receipts: {
      id: string
      fileName: string
      fileUrl: string
      fileSize: number
      mimeType: string
    }[]
  }
}

export function ExpenseDetails({ expense }: ExpenseDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Expense Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {expense.category.icon && (
              <span className="text-3xl">{expense.category.icon}</span>
            )}
            <div>
              <CardTitle>{expense.category.name}</CardTitle>
              <CardDescription>Expense Details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(Number(expense.amount))}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">
                {format(new Date(expense.expenseDate), 'PPP')}
              </p>
            </div>
          </div>

          {/* Location */}
          {expense.location && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p className="text-sm">{expense.location}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {expense.description && (
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-sm">{expense.description}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {expense.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {expense.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Receipts</CardTitle>
          <CardDescription>
            Upload receipt images or PDFs for this expense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReceiptUpload expenseId={expense.id} receipts={expense.receipts} />
        </CardContent>
      </Card>
    </div>
  )
}

