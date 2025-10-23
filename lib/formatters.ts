import { format, formatDistanceToNow } from 'date-fns'

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number | string,
  currency: string = 'USD'
): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

/**
 * Format a date to a readable string
 */
export const formatDate = (
  date: Date | string,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

/**
 * Format a date to show relative time (e.g., "2 hours ago")
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

