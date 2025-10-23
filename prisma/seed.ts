import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create a test user
  const testUserEmail = 'test@example.com'
  const existingUser = await prisma.user.findUnique({
    where: { email: testUserEmail },
  })

  let userId: string

  if (existingUser) {
    console.log('Test user already exists')
    userId = existingUser.id
  } else {
    const passwordHash = await hash('Test123!@#', 10)
    const user = await prisma.user.create({
      data: {
        email: testUserEmail,
        passwordHash,
        name: 'Test User',
      },
    })
    userId = user.id
    console.log('Created test user:', testUserEmail)
  }

  // Create default categories
  const defaultCategories = [
    {
      name: 'Food',
      description: 'Groceries, restaurants, and dining',
      icon: '🍔',
      color: '#f59e0b',
    },
    {
      name: 'Travel',
      description: 'Transportation, flights, and accommodation',
      icon: '✈️',
      color: '#3b82f6',
    },
    {
      name: 'Utilities',
      description: 'Electricity, water, internet, and phone bills',
      icon: '💡',
      color: '#8b5cf6',
    },
    {
      name: 'Entertainment',
      description: 'Movies, games, and leisure activities',
      icon: '🎮',
      color: '#ec4899',
    },
    {
      name: 'Healthcare',
      description: 'Medical expenses, insurance, and pharmacy',
      icon: '⚕️',
      color: '#10b981',
    },
    {
      name: 'Shopping',
      description: 'Clothing, electronics, and general purchases',
      icon: '🛍️',
      color: '#f43f5e',
    },
    {
      name: 'Education',
      description: 'Courses, books, and learning materials',
      icon: '📚',
      color: '#06b6d4',
    },
    {
      name: 'Other',
      description: 'Miscellaneous expenses',
      icon: '📦',
      color: '#6b7280',
    },
  ]

  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: category.name,
      },
    })

    if (!existing) {
      await prisma.category.create({
        data: {
          ...category,
          userId,
          isDefault: true,
        },
      })
      console.log(`Created category: ${category.name}`)
    }
  }

  console.log('Database seed completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

