import { z } from 'zod'

// User validation schemas
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Expense validation schemas
export const expenseSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999.99, 'Amount too large'),
  categoryId: z.string().uuid('Invalid category'),
  expenseDate: z.string().datetime('Invalid date format'),
  description: z.string().max(500, 'Description too long').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
})

export const updateExpenseSchema = expenseSchema.partial()

// Category validation schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  description: z.string().max(200, 'Description too long').optional(),
  icon: z.string().max(10, 'Icon too long').optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
})

// Budget validation schemas
export const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  categoryId: z.string().uuid('Invalid category').optional(),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
})

// File upload validation
export const receiptFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(
          file.type
        ),
      'File must be a JPEG, PNG, or PDF'
    ),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ExpenseInput = z.infer<typeof expenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BudgetInput = z.infer<typeof budgetSchema>

