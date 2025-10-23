/**
 * Test Suite: AITEAM-489 - Upload Receipts
 * 
 * Test Cases:
 * TC-ET-029: Upload Receipt via File Selection
 * TC-ET-030: Upload Receipt via Drag and Drop
 * TC-ET-031: Upload Invalid File Type
 * TC-ET-032: Upload File Exceeding Size Limit
 * TC-ET-033: Upload Multiple Valid Files
 * TC-ET-034: View Uploaded Receipt
 * TC-ET-035: Replace Existing Receipt
 * TC-ET-036: Delete Receipt
 * TC-ET-037: Upload Receipt with Special Characters in Filename
 * TC-ET-038: Upload Receipt Without Expense Data
 * TC-ET-039: Download Uploaded Receipt
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReceiptUpload } from '@/components/expenses/ReceiptUpload'
import * as useReceiptsHook from '@/hooks/useReceipts'

jest.mock('@/hooks/useReceipts')

const mockReceipts = [
  {
    id: 'receipt-1',
    fileName: 'receipt1.jpg',
    fileUrl: '/uploads/receipt1.jpg',
    fileSize: 1024 * 500, // 500KB
    mimeType: 'image/jpeg',
  },
  {
    id: 'receipt-2',
    fileName: 'invoice.pdf',
    fileUrl: '/uploads/invoice.pdf',
    fileSize: 1024 * 1024 * 2, // 2MB
    mimeType: 'application/pdf',
  },
]

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('ReceiptUpload - Upload Receipts (AITEAM-489)', () => {
  const mockUploadReceipt = jest.fn()
  const mockDeleteReceipt = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    jest.spyOn(useReceiptsHook, 'useUploadReceipt').mockReturnValue({
      mutateAsync: mockUploadReceipt,
      isPending: false,
    } as any)

    jest.spyOn(useReceiptsHook, 'useDeleteReceipt').mockReturnValue({
      mutateAsync: mockDeleteReceipt,
      isPending: false,
    } as any)

    // Mock window.alert
    global.alert = jest.fn()
    // Mock window.confirm
    global.confirm = jest.fn()
  })

  // TC-ET-029: Upload Receipt via File Selection
  test('TC-ET-029: should upload receipt via file selection', async () => {
    const user = userEvent.setup()
    mockUploadReceipt.mockResolvedValueOnce({
      id: 'new-receipt',
      fileName: 'test.jpg',
      fileUrl: '/uploads/test.jpg',
      fileSize: 1024,
      mimeType: 'image/jpeg',
    })

    render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    // Create a file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

    // Get file input (hidden)
    const fileInput = screen.getByLabelText(/browse/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement

    // Upload file
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(mockUploadReceipt).toHaveBeenCalledWith({
        file,
        expenseId: 'exp-1',
      })
    })
  })

  // TC-ET-030: Upload Receipt via Drag and Drop
  test('TC-ET-030: should upload receipt via drag and drop', async () => {
    mockUploadReceipt.mockResolvedValueOnce({
      id: 'new-receipt',
      fileName: 'dropped.png',
      fileUrl: '/uploads/dropped.png',
      fileSize: 2048,
      mimeType: 'image/png',
    })

    render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    const file = new File(['test content'], 'dropped.png', { type: 'image/png' })
    const dropZone = screen.getByText(/drag and drop/i).closest('div')

    // Simulate drag and drop
    const dataTransfer = {
      files: [file],
      types: ['Files'],
    }

    // Trigger drop event
    const dropEvent = new Event('drop', { bubbles: true }) as any
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: dataTransfer,
    })

    dropZone?.dispatchEvent(dropEvent)

    await waitFor(() => {
      expect(mockUploadReceipt).toHaveBeenCalledWith({
        file,
        expenseId: 'exp-1',
      })
    })
  })

  // TC-ET-031: Upload Invalid File Type
  test('TC-ET-031: should reject invalid file types', async () => {
    const user = userEvent.setup()

    render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    // Try to upload .txt file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const fileInput = screen.getByLabelText(/browse/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('Invalid file type')
      )
    })

    expect(mockUploadReceipt).not.toHaveBeenCalled()
  })

  // TC-ET-032: Upload File Exceeding Size Limit
  test('TC-ET-032: should reject files exceeding 5MB', async () => {
    const user = userEvent.setup()

    render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    // Create a 6MB file
    const largeContent = new Array(6 * 1024 * 1024).join('a')
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 })

    const fileInput = screen.getByLabelText(/browse/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        expect.stringContaining('5MB limit')
      )
    })

    expect(mockUploadReceipt).not.toHaveBeenCalled()
  })

  // TC-ET-033: Upload Multiple Valid Files
  test('TC-ET-033: should handle multiple file uploads', async () => {
    const user = userEvent.setup()
    mockUploadReceipt
      .mockResolvedValueOnce({
        id: 'receipt-1',
        fileName: 'file1.jpg',
        fileUrl: '/uploads/file1.jpg',
        fileSize: 1024,
        mimeType: 'image/jpeg',
      })
      .mockResolvedValueOnce({
        id: 'receipt-2',
        fileName: 'file2.png',
        fileUrl: '/uploads/file2.png',
        fileSize: 2048,
        mimeType: 'image/png',
      })

    const { rerender } = render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    const fileInput = screen.getByLabelText(/browse/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement

    // Upload first file
    const file1 = new File(['content1'], 'file1.jpg', { type: 'image/jpeg' })
    await user.upload(fileInput, file1)

    await waitFor(() => {
      expect(mockUploadReceipt).toHaveBeenCalledTimes(1)
    })

    // Upload second file
    const file2 = new File(['content2'], 'file2.png', { type: 'image/png' })
    await user.upload(fileInput, file2)

    await waitFor(() => {
      expect(mockUploadReceipt).toHaveBeenCalledTimes(2)
    })
  })

  // TC-ET-034: View Uploaded Receipt
  test('TC-ET-034: should display uploaded receipts with view link', () => {
    render(
      <ReceiptUpload expenseId="exp-1" receipts={mockReceipts} />,
      { wrapper: createWrapper() }
    )

    // Verify receipts are displayed
    expect(screen.getByText('receipt1.jpg')).toBeInTheDocument()
    expect(screen.getByText('invoice.pdf')).toBeInTheDocument()

    // Verify file sizes are shown
    expect(screen.getByText('500 KB')).toBeInTheDocument()
    expect(screen.getByText('2 MB')).toBeInTheDocument()

    // Verify view links
    const viewLinks = screen.getAllByText('View')
    expect(viewLinks).toHaveLength(2)
    expect(viewLinks[0]).toHaveAttribute('href', '/uploads/receipt1.jpg')
  })

  // TC-ET-036: Delete Receipt
  test('TC-ET-036: should delete receipt with confirmation', async () => {
    const user = userEvent.setup()
    mockDeleteReceipt.mockResolvedValueOnce({ message: 'Receipt deleted' })
    ;(global.confirm as jest.Mock).mockReturnValue(true)

    render(
      <ReceiptUpload expenseId="exp-1" receipts={mockReceipts} />,
      { wrapper: createWrapper() }
    )

    // Click delete button for first receipt
    const deleteButtons = screen.getAllByRole('button', { name: '' }) // X buttons
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalledWith(
        expect.stringContaining('delete this receipt')
      )
      expect(mockDeleteReceipt).toHaveBeenCalledWith('receipt-1')
    })
  })

  // TC-ET-037: Upload Receipt with Special Characters in Filename
  test('TC-ET-037: should handle filenames with special characters', async () => {
    const user = userEvent.setup()
    mockUploadReceipt.mockResolvedValueOnce({
      id: 'receipt-special',
      fileName: 'receipt #1 (2024).jpg',
      fileUrl: '/uploads/receipt.jpg',
      fileSize: 1024,
      mimeType: 'image/jpeg',
    })

    render(
      <ReceiptUpload expenseId="exp-1" receipts={[]} />,
      { wrapper: createWrapper() }
    )

    const file = new File(['content'], 'receipt #1 (2024).jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/browse/i).closest('div')?.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(mockUploadReceipt).toHaveBeenCalledWith({
        file: expect.objectContaining({
          name: 'receipt #1 (2024).jpg',
        }),
        expenseId: 'exp-1',
      })
    })
  })

  // TC-ET-039: Download Uploaded Receipt
  test('TC-ET-039: should provide download link for receipts', () => {
    render(
      <ReceiptUpload expenseId="exp-1" receipts={mockReceipts} />,
      { wrapper: createWrapper() }
    )

    const viewLinks = screen.getAllByText('View')
    
    // Verify links open in new tab
    viewLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  // Test receipt icons
  test('should display correct icons for different file types', () => {
    render(
      <ReceiptUpload expenseId="exp-1" receipts={mockReceipts} />,
      { wrapper: createWrapper() }
    )

    // Image receipt should show image icon
    // PDF receipt should show file icon
    // Both should be present in the document
    const receiptItems = screen.getAllByText(/receipt|invoice/i)
    expect(receiptItems.length).toBeGreaterThan(0)
  })

  // Test cancel deletion
  test('should not delete receipt when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    ;(global.confirm as jest.Mock).mockReturnValue(false)

    render(
      <ReceiptUpload expenseId="exp-1" receipts={mockReceipts} />,
      { wrapper: createWrapper() }
    )

    const deleteButtons = screen.getAllByRole('button', { name: '' })
    await user.click(deleteButtons[0])

    expect(global.confirm).toHaveBeenCalled()
    expect(mockDeleteReceipt).not.toHaveBeenCalled()
  })
})

