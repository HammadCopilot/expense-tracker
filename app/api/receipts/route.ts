import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { UploadService } from '@/lib/services/uploadService'

/**
 * POST /api/receipts
 * Upload a receipt for an expense
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const expenseId = formData.get('expenseId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!expenseId) {
      return NextResponse.json(
        { error: 'Expense ID required' },
        { status: 400 }
      )
    }

    // Verify expense ownership
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: session.user.id,
      },
    })

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found or unauthorized' },
        { status: 404 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Upload file
    let fileUrl: string
    let fileKey: string

    if (process.env.NODE_ENV === 'production' && process.env.S3_BUCKET_NAME) {
      // Upload to S3 in production
      const result = await UploadService.uploadReceipt(file, expenseId)
      fileUrl = result.url
      fileKey = result.key
    } else {
      // For development, use local storage or placeholder
      const result = await UploadService.uploadLocal(file, expenseId)
      fileUrl = result.url
      fileKey = result.key
    }

    // Save receipt metadata to database
    const receipt = await prisma.receipt.create({
      data: {
        expenseId,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json(receipt, { status: 201 })
  } catch (error) {
    console.error('Error uploading receipt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

