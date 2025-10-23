import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics - Expense Tracker',
  description: 'View your expense analytics and insights',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Insights and trends from your spending
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Spending by Category</h2>
          <p className="mt-4 text-center text-muted-foreground">
            No data available
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Monthly Trends</h2>
          <p className="mt-4 text-center text-muted-foreground">
            No data available
          </p>
        </div>
      </div>
    </div>
  )
}

