import { Metadata } from 'next'
import { SignUpForm } from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Sign Up - Expense Tracker',
  description: 'Create your expense tracker account',
}

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your account to start tracking expenses
        </p>
      </div>
      <SignUpForm />
    </div>
  )
}

