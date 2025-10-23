import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Expense Tracker',
  description: 'Your expense tracking dashboard',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your expense tracking dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </div>
          <div className="mt-2 text-2xl font-bold">$0.00</div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            This Month
          </div>
          <div className="mt-2 text-2xl font-bold">$0.00</div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Categories
          </div>
          <div className="mt-2 text-2xl font-bold">0</div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Budget Left
          </div>
          <div className="mt-2 text-2xl font-bold">$0.00</div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        <p className="mt-4 text-center text-muted-foreground">
          No expenses yet. Start by adding your first expense!
        </p>
      </div>
    </div>
  )
}

