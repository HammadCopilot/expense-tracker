import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { UploadService } from '@/lib/services/uploadService'

/**
 * DELETE /api/receipts/[id]
 * Delete a receipt
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get receipt with expense to verify ownership
    const receipt = await prisma.receipt.findFirst({
      where: { id },
      include: { expense: true },
    })

    if (!receipt) {
      return NextResponse.json(
        { error: 'Receipt not found' },
        { status: 404 }
      )
    }

    // Verify user owns the expense
    if (receipt.expense.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete from S3/storage
    try {
      if (process.env.NODE_ENV === 'production' && process.env.S3_BUCKET_NAME) {
        // Extract key from URL or use stored key
        const key = receipt.fileUrl.includes('s3.amazonaws.com')
          ? receipt.fileUrl.split('.com/')[1]
          : receipt.fileUrl

        await UploadService.deleteReceipt(key)
      }
      // For local development, you might want to delete the file from public folder
    } catch (error) {
      console.error('Error deleting file from storage:', error)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.receipt.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Receipt deleted successfully' })
  } catch (error) {
    console.error('Error deleting receipt:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

