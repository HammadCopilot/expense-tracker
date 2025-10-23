import { format } from 'date-fns'

/**
 * Export data to CSV file
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string = 'export.csv'
) {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export chart to PNG image
 * Uses html2canvas library if available
 */
export async function exportChartToPNG(
  elementId: string,
  filename: string = 'chart.png'
) {
  try {
    // Check if html2canvas is available (should be installed separately if needed)
    const html2canvas = (await import('html2canvas')).default
    
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found')
      return
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    })

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create blob')
        return
      }
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = url
      link.download = filename
      link.click()
      
      URL.revokeObjectURL(url)
    })
  } catch (error) {
    console.error('Error exporting chart:', error)
    alert('Export to PNG requires the html2canvas library. Please use CSV export instead.')
  }
}

/**
 * Format analytics data for CSV export
 */
export function formatMonthlyTrendsForExport(data: any[]) {
  return data.map((item) => ({
    Month: format(new Date(item.month + '-01'), 'MMMM yyyy'),
    'Total Spending': `$${item.total.toFixed(2)}`,
    'Number of Expenses': item.count,
  }))
}

/**
 * Format category breakdown data for CSV export
 */
export function formatCategoryBreakdownForExport(data: any[]) {
  return data.map((item) => ({
    Category: item.categoryName,
    'Total Spending': `$${item.total.toFixed(2)}`,
    Percentage: `${item.percentage.toFixed(2)}%`,
    'Number of Expenses': item.count,
  }))
}

