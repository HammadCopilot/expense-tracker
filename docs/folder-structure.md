# Project Folder Structure

## Overview
This document outlines the complete folder structure for the AI-Powered Expense Tracker Next.js application following best practices for the App Router architecture.

---

## Complete Directory Tree

```
expense-tracker/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── .husky/
│   ├── pre-commit                    # Pre-commit hooks
│   └── pre-push                      # Pre-push hooks
├── .vscode/
│   ├── settings.json                 # VSCode settings
│   └── extensions.json               # Recommended extensions
├── app/
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── signup/
│   │   │   └── page.tsx              # Signup page
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Password reset
│   │   └── layout.tsx                # Auth layout (centered)
│   ├── (dashboard)/                  # Dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main dashboard
│   │   ├── expenses/
│   │   │   ├── page.tsx              # Expenses list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Single expense view
│   │   │   └── new/
│   │   │       └── page.tsx          # Add expense
│   │   ├── analytics/
│   │   │   └── page.tsx              # Analytics & reports
│   │   ├── settings/
│   │   │   ├── page.tsx              # Settings page
│   │   │   ├── profile/
│   │   │   │   └── page.tsx          # Profile settings
│   │   │   └── security/
│   │   │       └── page.tsx          # Security settings
│   │   └── layout.tsx                # Dashboard layout (sidebar)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   │   └── route.ts          # POST /api/auth/signup
│   │   │   ├── login/
│   │   │   │   └── route.ts          # POST /api/auth/login
│   │   │   ├── logout/
│   │   │   │   └── route.ts          # POST /api/auth/logout
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # NextAuth handler
│   │   ├── user/
│   │   │   ├── profile/
│   │   │   │   └── route.ts          # GET, PUT /api/user/profile
│   │   │   ├── password/
│   │   │   │   └── route.ts          # PUT /api/user/password
│   │   │   └── profile-picture/
│   │   │       └── route.ts          # POST /api/user/profile-picture
│   │   ├── expenses/
│   │   │   ├── route.ts              # GET, POST /api/expenses
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE /api/expenses/[id]
│   │   ├── categories/
│   │   │   └── route.ts              # GET /api/categories
│   │   ├── receipts/
│   │   │   ├── route.ts              # POST /api/receipts
│   │   │   └── [id]/
│   │   │       └── route.ts          # DELETE /api/receipts/[id]
│   │   └── analytics/
│   │       ├── trends/
│   │       │   └── route.ts          # GET /api/analytics/trends
│   │       └── categories/
│   │           └── route.ts          # GET /api/analytics/categories
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing/home page
│   ├── globals.css                   # Global styles
│   └── error.tsx                     # Error boundary
├── components/
│   ├── ui/                           # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   └── ...                       # Other Shadcn components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── expenses/
│   │   ├── ExpenseForm.tsx           # Add/Edit expense form
│   │   ├── ExpenseList.tsx           # List of expenses
│   │   ├── ExpenseCard.tsx           # Individual expense card
│   │   ├── ExpenseFilters.tsx        # Filter controls
│   │   ├── ExpenseStats.tsx          # Quick stats
│   │   └── ReceiptUpload.tsx         # Receipt upload component
│   ├── charts/
│   │   ├── MonthlyTrendsChart.tsx    # Line/bar chart for trends
│   │   ├── CategoryPieChart.tsx      # Pie chart for categories
│   │   └── ChartLegend.tsx           # Custom legend
│   ├── layouts/
│   │   ├── Header.tsx                # App header
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── MobileNav.tsx             # Mobile navigation
│   │   └── Footer.tsx                # App footer
│   ├── shared/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Pagination.tsx
│   │   └── DateRangePicker.tsx
│   └── providers/
│       ├── QueryProvider.tsx         # React Query provider
│       ├── ThemeProvider.tsx         # Theme provider
│       └── AuthProvider.tsx          # Auth context provider
├── hooks/
│   ├── useAuth.ts                    # Authentication hook
│   ├── useExpenses.ts                # Expenses data hook
│   ├── useExpenseMutations.ts        # Expense mutations
│   ├── useCategories.ts              # Categories data hook
│   ├── useAnalytics.ts               # Analytics data hook
│   ├── useDebounce.ts                # Debounce hook
│   ├── useMediaQuery.ts              # Responsive hook
│   └── useFileUpload.ts              # File upload hook
├── lib/
│   ├── prisma.ts                     # Prisma client instance
│   ├── auth.ts                       # NextAuth configuration
│   ├── validations.ts                # Zod schemas
│   ├── utils.ts                      # Utility functions (cn, etc.)
│   ├── constants.ts                  # App constants
│   ├── errorHandler.ts               # Error handling utilities
│   └── formatters.ts                 # Data formatters (currency, date)
├── lib/services/
│   ├── authService.ts                # Authentication service
│   ├── expenseService.ts             # Expense business logic
│   ├── uploadService.ts              # File upload service (S3)
│   ├── analyticsService.ts           # Analytics calculations
│   └── emailService.ts               # Email service (optional)
├── prisma/
│   ├── schema.prisma                 # Prisma schema
│   ├── migrations/                   # Database migrations
│   │   └── [timestamp]_init/
│   │       └── migration.sql
│   └── seed.ts                       # Database seed data
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── placeholder.png
│   ├── icons/
│   │   └── favicon.ico
│   └── uploads/                      # Local file uploads (dev only)
├── store/
│   ├── userStore.ts                  # Zustand user state
│   ├── uiStore.ts                    # Zustand UI state
│   └── expenseStore.ts               # Zustand expense filters state
├── types/
│   ├── index.ts                      # Shared types
│   ├── api.ts                        # API response types
│   ├── expense.ts                    # Expense types
│   ├── user.ts                       # User types
│   └── next-auth.d.ts                # NextAuth type extensions
├── .env.local                        # Environment variables (local)
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore file
├── .prettierrc                       # Prettier configuration
├── components.json                   # Shadcn UI configuration
├── docker-compose.yml                # Docker Compose for PostgreSQL
├── Dockerfile                        # Docker container definition
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── pnpm-lock.yaml                    # Lock file (if using pnpm)
├── postcss.config.js                 # PostCSS configuration
├── README.md                         # Project documentation
├── tailwind.config.ts                # TailwindCSS configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## Directory Descriptions

### `/app` - Next.js App Router
The main application directory using Next.js 14 App Router structure.

**Route Groups:**
- `(auth)`: Authentication pages with centered layout
- `(dashboard)`: Protected dashboard pages with sidebar layout

**Special Files:**
- `layout.tsx`: Defines layout for route segment
- `page.tsx`: Page component for route
- `route.ts`: API route handler
- `error.tsx`: Error boundary
- `loading.tsx`: Loading UI

---

### `/components` - React Components
Organized by feature and responsibility.

**`/ui`**: Shadcn UI primitive components (auto-generated)
**`/auth`**: Authentication-related components
**`/expenses`**: Expense management components
**`/charts`**: Data visualization components
**`/layouts`**: Layout and navigation components
**`/shared`**: Reusable UI components
**`/providers`**: Context and provider components

---

### `/hooks` - Custom React Hooks
Reusable hooks for data fetching and logic.

**Naming Convention:** `use[Feature].ts`

Examples:
- `useExpenses`: Fetches expenses data
- `useAuth`: Manages authentication state
- `useDebounce`: Debounces values

---

### `/lib` - Utilities and Configuration
Core library code and configurations.

**Key Files:**
- `prisma.ts`: Database client singleton
- `auth.ts`: NextAuth configuration
- `validations.ts`: Zod validation schemas
- `utils.ts`: Helper functions

**`/services`**: Business logic layer
- Separates business logic from API routes
- Handles complex operations and transactions

---

### `/store` - Zustand State Management
Client-side global state stores.

**Stores:**
- `userStore`: User session and profile data
- `uiStore`: UI state (sidebar, modals, theme)
- `expenseStore`: Expense filters and temporary data

---

### `/types` - TypeScript Type Definitions
Centralized type definitions.

**Files:**
- `index.ts`: Shared types
- `api.ts`: API request/response types
- `expense.ts`: Expense domain types
- `next-auth.d.ts`: NextAuth type extensions

---

### `/prisma` - Database
Prisma ORM configuration and migrations.

**Files:**
- `schema.prisma`: Database schema definition
- `/migrations`: Version-controlled migrations
- `seed.ts`: Seed data script

---

### `/public` - Static Assets
Public files served directly.

**Subdirectories:**
- `/images`: Images and graphics
- `/icons`: Icons and favicons
- `/uploads`: User uploads (development only)

---

## Key Configuration Files

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... Shadcn colors
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### `components.json` (Shadcn UI)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Environment Variables

### `.env.example`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AWS S3 (optional for file uploads)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="expense-tracker-receipts"

# App
NODE_ENV="development"
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "prepare": "husky install"
  }
}
```

---

## File Naming Conventions

### Components
- **PascalCase**: `ExpenseCard.tsx`, `MonthlyTrendsChart.tsx`
- **Suffix**: Component type in name when helpful

### Hooks
- **camelCase with `use` prefix**: `useExpenses.ts`, `useAuth.ts`

### Utilities
- **camelCase**: `formatters.ts`, `errorHandler.ts`

### API Routes
- **kebab-case folders, route.ts file**: `api/user/profile/route.ts`

### Pages
- **kebab-case folders, page.tsx file**: `app/expenses/new/page.tsx`

---

## Import Aliases

Using `@/` prefix for cleaner imports:

```typescript
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/formatters';
import { prisma } from '@/lib/prisma';
import type { Expense } from '@/types/expense';
```

---

## Best Practices

### Component Organization
1. External imports first
2. Internal imports (grouped by type)
3. Type definitions
4. Component definition
5. Exports

### File Size
- Components: Max 300 lines (split if larger)
- Services: Max 500 lines
- Use barrel exports (`index.ts`) for related modules

### Code Splitting
- Dynamic imports for heavy components
- Route-based splitting (automatic with Next.js)
- Lazy load charts and visualizations

---

## Development Workflow

1. **Start Database**: `docker-compose up -d`
2. **Run Migrations**: `npm run db:migrate`
3. **Seed Database**: `npm run db:seed`
4. **Start Dev Server**: `npm run dev`
5. **Open Prisma Studio**: `npm run db:studio` (optional)

---

## Building for Production

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Start production server
npm run start
```

---

## Git Workflow

### Husky Pre-commit Hook
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run typecheck
```

### Recommended Branches
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes

