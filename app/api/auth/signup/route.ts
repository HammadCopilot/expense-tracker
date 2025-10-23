import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    // Create default categories for the user
    await prisma.category.createMany({
      data: [
        {
          userId: user.id,
          name: 'Food & Dining',
          icon: '🍔',
          color: '#f59e0b',
          isDefault: true,
        },
        {
          userId: user.id,
          name: 'Transportation',
          icon: '🚗',
          color: '#3b82f6',
          isDefault: true,
        },
        {
          userId: user.id,
          name: 'Shopping',
          icon: '🛍️',
          color: '#ec4899',
          isDefault: true,
        },
        {
          userId: user.id,
          name: 'Entertainment',
          icon: '🎬',
          color: '#8b5cf6',
          isDefault: true,
        },
        {
          userId: user.id,
          name: 'Bills & Utilities',
          icon: '💡',
          color: '#10b981',
          isDefault: true,
        },
        {
          userId: user.id,
          name: 'Healthcare',
          icon: '🏥',
          color: '#ef4444',
          isDefault: true,
        },
      ],
    })

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

