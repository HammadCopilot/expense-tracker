import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login - Expense Tracker',
  description: 'Sign in to your expense tracker account',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  )
}

