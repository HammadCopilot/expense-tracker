'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useUploadReceipt, useDeleteReceipt } from '@/hooks/useReceipts'
import { formatFileSize } from '@/lib/formatters'

interface Receipt {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

interface ReceiptUploadProps {
  expenseId: string
  receipts: Receipt[]
}

export function ReceiptUpload({ expenseId, receipts }: ReceiptUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadReceipt = useUploadReceipt()
  const deleteReceipt = useDeleteReceipt()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and PDF are allowed.')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size exceeds 5MB limit')
      return
    }

    await uploadReceipt.mutateAsync({ file, expenseId })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (receiptId: string) => {
    if (confirm('Are you sure you want to delete this receipt?')) {
      await deleteReceipt.mutateAsync(receiptId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,application/pdf"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              Drag and drop receipt here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, or PDF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Receipts */}
      {receipts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Receipts</h4>
          <div className="grid gap-2">
            {receipts.map((receipt) => (
              <Card key={receipt.id} className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {receipt.mimeType.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {receipt.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(receipt.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={receipt.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(receipt.id)}
                      disabled={deleteReceipt.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

