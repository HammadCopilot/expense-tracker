# API Design Documentation

## Overview
This document provides comprehensive API endpoint specifications for the AI-Powered Expense Tracker application. All endpoints follow REST principles and return JSON responses.

---

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication
All protected endpoints require a valid session cookie set by NextAuth.js.

**Authentication Header:**
```
Cookie: next-auth.session-token=<token>
```

**Unauthenticated Response:**
```json
{
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## API Endpoints

### Authentication Endpoints

#### 1. Sign Up
**Endpoint:** `POST /api/auth/signup`  
**Authentication:** Not required  
**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 characters, must include uppercase, lowercase, number, special character
- `name`: Optional, max 100 characters

**Success Response (201):**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-10-23T10:00:00.000Z"
  },
  "message": "Account created successfully"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// 409 - Conflict
{
  "error": "Email already registered"
}
```

---

#### 2. Login
**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required  
**Description:** Authenticate user and create session

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe",
      "profilePictureUrl": "https://..."
    },
    "session": {
      "expiresAt": "2025-11-23T10:00:00.000Z"
    }
  }
}
```
*Sets session cookie automatically*

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

---

#### 3. Logout
**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Description:** Terminate user session

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### User Endpoints

#### 4. Get User Profile
**Endpoint:** `GET /api/user/profile`  
**Authentication:** Required  
**Description:** Retrieve current user's profile information

**Success Response (200):**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePictureUrl": "https://...",
    "emailVerified": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "lastLogin": "2025-10-23T09:30:00.000Z"
  }
}
```

---

#### 5. Update User Profile
**Endpoint:** `PUT /api/user/profile`  
**Authentication:** Required  
**Description:** Update user profile information

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "newemail@example.com"
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "newemail@example.com",
    "name": "John Smith",
    "updatedAt": "2025-10-23T10:15:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Response (409):**
```json
{
  "error": "Email already in use"
}
```

---

#### 6. Change Password
**Endpoint:** `PUT /api/user/password`  
**Authentication:** Required  
**Description:** Change user password

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Current password is incorrect"
}
```

---

#### 7. Upload Profile Picture
**Endpoint:** `POST /api/user/profile-picture`  
**Authentication:** Required  
**Content-Type:** `multipart/form-data`  
**Description:** Upload or update profile picture

**Request Body (FormData):**
```
file: [image file]
```

**Success Response (200):**
```json
{
  "data": {
    "profilePictureUrl": "https://s3.amazonaws.com/bucket/users/123e4567/profile.jpg"
  },
  "message": "Profile picture updated"
}
```

**Error Response (400):**
```json
{
  "error": "File size exceeds 5MB limit"
}
```

---

### Expense Endpoints

#### 8. Get All Expenses
**Endpoint:** `GET /api/expenses`  
**Authentication:** Required  
**Description:** Retrieve user's expenses with optional filtering

**Query Parameters:**
- `startDate` (optional): ISO date string (e.g., 2025-10-01)
- `endDate` (optional): ISO date string
- `categoryId` (optional): UUID of category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)
- `sortBy` (optional): `date` or `amount` (default: date)
- `sortOrder` (optional): `asc` or `desc` (default: desc)

**Example Request:**
```
GET /api/expenses?startDate=2025-10-01&endDate=2025-10-31&categoryId=cat-uuid&page=1&limit=20
```

**Success Response (200):**
```json
{
  "data": {
    "expenses": [
      {
        "id": "exp-uuid-1",
        "amount": "45.99",
        "expenseDate": "2025-10-22",
        "description": "Grocery shopping",
        "category": {
          "id": "cat-uuid",
          "name": "Food & Dining",
          "color": "#EF4444",
          "icon": "Utensils"
        },
        "receipts": [
          {
            "id": "receipt-uuid",
            "fileUrl": "https://...",
            "fileName": "receipt.jpg",
            "fileType": "image/jpeg"
          }
        ],
        "createdAt": "2025-10-22T14:30:00.000Z",
        "updatedAt": "2025-10-22T14:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    },
    "summary": {
      "totalAmount": "3456.78",
      "count": 156
    }
  }
}
```

---

#### 9. Create Expense
**Endpoint:** `POST /api/expenses`  
**Authentication:** Required  
**Description:** Create a new expense entry

**Request Body:**
```json
{
  "amount": 45.99,
  "categoryId": "cat-uuid",
  "expenseDate": "2025-10-22",
  "description": "Lunch at restaurant"
}
```

**Validation Rules:**
- `amount`: Required, positive number, max 2 decimal places
- `categoryId`: Required, valid UUID, must exist
- `expenseDate`: Required, valid date, not in future
- `description`: Optional, max 500 characters

**Success Response (201):**
```json
{
  "data": {
    "id": "exp-uuid-new",
    "amount": "45.99",
    "categoryId": "cat-uuid",
    "expenseDate": "2025-10-22",
    "description": "Lunch at restaurant",
    "category": {
      "id": "cat-uuid",
      "name": "Food & Dining",
      "color": "#EF4444"
    },
    "createdAt": "2025-10-23T10:30:00.000Z",
    "updatedAt": "2025-10-23T10:30:00.000Z"
  },
  "message": "Expense created successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be positive"
    }
  ]
}
```

---

#### 10. Get Single Expense
**Endpoint:** `GET /api/expenses/[id]`  
**Authentication:** Required  
**Description:** Retrieve a specific expense by ID

**Success Response (200):**
```json
{
  "data": {
    "id": "exp-uuid",
    "amount": "45.99",
    "expenseDate": "2025-10-22",
    "description": "Lunch at restaurant",
    "category": {
      "id": "cat-uuid",
      "name": "Food & Dining",
      "color": "#EF4444",
      "icon": "Utensils"
    },
    "receipts": [
      {
        "id": "receipt-uuid",
        "fileUrl": "https://...",
        "fileName": "receipt.jpg",
        "fileSize": 245678,
        "uploadedAt": "2025-10-22T14:35:00.000Z"
      }
    ],
    "createdAt": "2025-10-22T14:30:00.000Z",
    "updatedAt": "2025-10-22T14:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Expense not found"
}
```

---

#### 11. Update Expense
**Endpoint:** `PUT /api/expenses/[id]`  
**Authentication:** Required  
**Description:** Update an existing expense

**Request Body:**
```json
{
  "amount": 50.00,
  "categoryId": "new-cat-uuid",
  "expenseDate": "2025-10-22",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "exp-uuid",
    "amount": "50.00",
    "categoryId": "new-cat-uuid",
    "expenseDate": "2025-10-22",
    "description": "Updated description",
    "category": {
      "id": "new-cat-uuid",
      "name": "Transportation",
      "color": "#3B82F6"
    },
    "updatedAt": "2025-10-23T10:45:00.000Z"
  },
  "message": "Expense updated successfully"
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "Expense not found"
}

// 403 - Forbidden
{
  "error": "You don't have permission to update this expense"
}
```

---

#### 12. Delete Expense
**Endpoint:** `DELETE /api/expenses/[id]`  
**Authentication:** Required  
**Description:** Delete an expense (and associated receipts)

**Success Response (200):**
```json
{
  "message": "Expense deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Expense not found"
}
```

---

### Category Endpoints

#### 13. Get All Categories
**Endpoint:** `GET /api/categories`  
**Authentication:** Required  
**Description:** Retrieve all expense categories

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "cat-uuid-1",
      "name": "Food & Dining",
      "color": "#EF4444",
      "icon": "Utensils",
      "isDefault": true,
      "displayOrder": 1
    },
    {
      "id": "cat-uuid-2",
      "name": "Transportation",
      "color": "#3B82F6",
      "icon": "Car",
      "isDefault": true,
      "displayOrder": 2
    }
  ]
}
```

---

### Receipt Endpoints

#### 14. Upload Receipt
**Endpoint:** `POST /api/receipts`  
**Authentication:** Required  
**Content-Type:** `multipart/form-data`  
**Description:** Upload a receipt file for an expense

**Request Body (FormData):**
```
file: [image/pdf file]
expenseId: "exp-uuid"
```

**Validation:**
- File types: image/jpeg, image/png, application/pdf
- Max file size: 5MB

**Success Response (201):**
```json
{
  "data": {
    "id": "receipt-uuid",
    "expenseId": "exp-uuid",
    "fileUrl": "https://s3.amazonaws.com/bucket/receipts/exp-uuid/receipt-uuid.jpg",
    "fileName": "receipt.jpg",
    "fileType": "image/jpeg",
    "fileSize": 245678,
    "uploadedAt": "2025-10-23T11:00:00.000Z"
  },
  "message": "Receipt uploaded successfully"
}
```

**Error Responses:**
```json
// 400 - Invalid file
{
  "error": "Unsupported file format. Please upload JPEG, PNG, or PDF"
}

// 400 - File too large
{
  "error": "File size exceeds 5MB limit"
}

// 404 - Expense not found
{
  "error": "Expense not found"
}
```

---

#### 15. Delete Receipt
**Endpoint:** `DELETE /api/receipts/[id]`  
**Authentication:** Required  
**Description:** Delete a receipt file

**Success Response (200):**
```json
{
  "message": "Receipt deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Receipt not found"
}
```

---

### Analytics Endpoints

#### 16. Get Spending Trends
**Endpoint:** `GET /api/analytics/trends`  
**Authentication:** Required  
**Description:** Get monthly spending trends

**Query Parameters:**
- `period` (optional): `3m`, `6m`, `1y`, `all` (default: 6m)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Example Request:**
```
GET /api/analytics/trends?period=6m
```

**Success Response (200):**
```json
{
  "data": {
    "trends": [
      {
        "month": "2025-05",
        "monthLabel": "May 2025",
        "totalAmount": "856.43",
        "transactionCount": 34
      },
      {
        "month": "2025-06",
        "monthLabel": "Jun 2025",
        "totalAmount": "923.17",
        "transactionCount": 41
      },
      {
        "month": "2025-07",
        "monthLabel": "Jul 2025",
        "totalAmount": "1045.28",
        "transactionCount": 38
      }
    ],
    "summary": {
      "totalPeriod": "5432.87",
      "averageMonthly": "905.48",
      "highestMonth": {
        "month": "2025-07",
        "amount": "1045.28"
      },
      "lowestMonth": {
        "month": "2025-05",
        "amount": "856.43"
      }
    }
  }
}
```

---

#### 17. Get Category Breakdown
**Endpoint:** `GET /api/analytics/categories`  
**Authentication:** Required  
**Description:** Get spending breakdown by category

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `period` (optional): `month`, `quarter`, `year` (default: month)

**Example Request:**
```
GET /api/analytics/categories?startDate=2025-10-01&endDate=2025-10-31
```

**Success Response (200):**
```json
{
  "data": {
    "categories": [
      {
        "categoryId": "cat-uuid-1",
        "categoryName": "Food & Dining",
        "categoryColor": "#EF4444",
        "totalAmount": "456.78",
        "transactionCount": 23,
        "percentage": 35.2
      },
      {
        "categoryId": "cat-uuid-2",
        "categoryName": "Transportation",
        "categoryColor": "#3B82F6",
        "totalAmount": "234.50",
        "transactionCount": 12,
        "percentage": 18.1
      }
    ],
    "summary": {
      "totalAmount": "1297.45",
      "totalTransactions": 65,
      "periodStart": "2025-10-01",
      "periodEnd": "2025-10-31"
    }
  }
}
```

---

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": "Error message",
  "details": "Optional additional details or validation errors",
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 422 | Unprocessable Entity | Semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting

**Limits (per IP address):**
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

**Rate Limit Exceeded Response (429):**
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## Pagination

For endpoints that return lists (expenses), use these query parameters:

- `page`: Page number (starts at 1)
- `limit`: Items per page (max 100)

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhook Events (Future Enhancement)

For future integration capabilities:

**Events:**
- `expense.created`
- `expense.updated`
- `expense.deleted`
- `receipt.uploaded`

**Webhook Payload Example:**
```json
{
  "event": "expense.created",
  "timestamp": "2025-10-23T11:00:00.000Z",
  "data": {
    "id": "exp-uuid",
    "amount": "45.99",
    "categoryId": "cat-uuid"
  }
}
```

---

## API Versioning

Current version: **v1** (implicit in base URL)

Future versions will use URL versioning:
- `/api/v1/...`
- `/api/v2/...`

---

## CORS Policy

**Development:**
- Allowed origins: `http://localhost:3000`

**Production:**
- Allowed origins: Your production domain(s)
- Credentials: Allowed (for cookies)
- Methods: GET, POST, PUT, DELETE, OPTIONS

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'

# Get expenses (with session cookie)
curl -X GET http://localhost:3000/api/expenses \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Create expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"amount":45.99,"categoryId":"cat-uuid","expenseDate":"2025-10-22"}'
```

### Using Postman/Insomnia

Import the API collection (to be created) or manually configure:
1. Set base URL variable
2. Configure authentication (automatic cookie handling)
3. Create requests for each endpoint

---

## API Client Example (TypeScript)

```typescript
// lib/api-client.ts
class ApiClient {
  private baseUrl = '/api';

  async getExpenses(filters?: ExpenseFilters) {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${this.baseUrl}/expenses?${params}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  }

  async createExpense(data: CreateExpenseDto) {
    const response = await fetch(`${this.baseUrl}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  }

  async uploadReceipt(file: File, expenseId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expenseId', expenseId);

    const response = await fetch(`${this.baseUrl}/receipts`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload receipt');
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

