import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export class UploadService {
  /**
   * Upload a receipt file to S3
   */
  static async uploadReceipt(
    file: File,
    expenseId: string
  ): Promise<{ url: string; key: string }> {
    const fileExtension = file.name.split('.').pop()
    const fileName = `receipts/${expenseId}/${uuidv4()}.${fileExtension}`

    const buffer = Buffer.from(await file.arrayBuffer())

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    )

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    return { url, key: fileName }
  }

  /**
   * Delete a receipt file from S3
   */
  static async deleteReceipt(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      })
    )
  }

  /**
   * Upload to local storage (development)
   */
  static async uploadLocal(
    file: File,
    expenseId: string
  ): Promise<{ url: string; key: string }> {
    // For development, we can save to public folder
    // This is a simplified version - in production, use S3
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const path = `/uploads/receipts/${expenseId}/${fileName}`

    // Note: In a real implementation, you would save the file to the filesystem
    // For now, we'll return a placeholder
    return {
      url: path,
      key: path,
    }
  }
}

