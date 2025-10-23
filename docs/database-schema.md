# Database Schema Documentation

## Overview
This document provides detailed schema definitions for all database tables in the AI-Powered Expense Tracker application using PostgreSQL with Prisma ORM.

---

## Table: users

**Purpose:** Stores user account information and authentication credentials.

### Schema Definition

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique user identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | - | User's email address (login credential) |
| password_hash | VARCHAR(255) | NOT NULL | - | Bcrypt hashed password |
| name | VARCHAR(100) | NULL | - | User's full name |
| profile_picture_url | VARCHAR(500) | NULL | - | URL to profile picture (S3/storage) |
| email_verified | BOOLEAN | NOT NULL | FALSE | Whether email has been verified |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last profile update timestamp |
| last_login | TIMESTAMP | NULL | - | Last successful login timestamp |

### Indexes

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login) WHERE last_login IS NOT NULL;
```

### Constraints

```sql
ALTER TABLE users ADD CONSTRAINT chk_users_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT chk_users_name_length 
  CHECK (name IS NULL OR LENGTH(TRIM(name)) >= 1);
```

### Prisma Schema

```prisma
model User {
  id                 String    @id @default(uuid()) @db.Uuid
  email              String    @unique @db.VarChar(255)
  passwordHash       String    @map("password_hash") @db.VarChar(255)
  name               String?   @db.VarChar(100)
  profilePictureUrl  String?   @map("profile_picture_url") @db.VarChar(500)
  emailVerified      Boolean   @default(false) @map("email_verified")
  createdAt          DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt          DateTime  @updatedAt @map("updated_at") @db.Timestamp(6)
  lastLogin          DateTime? @map("last_login") @db.Timestamp(6)
  
  expenses           Expense[]
  sessions           UserSession[]
  
  @@index([createdAt])
  @@index([lastLogin])
  @@map("users")
}
```

---

## Table: user_sessions

**Purpose:** Manages user authentication sessions for login/logout functionality.

### Schema Definition

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique session identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY | - | References users.id |
| session_token | VARCHAR(255) | NOT NULL, UNIQUE | - | Unique session token |
| expires_at | TIMESTAMP | NOT NULL | - | Session expiration timestamp |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Session creation timestamp |
| ip_address | VARCHAR(45) | NULL | - | IP address of session (IPv4/IPv6) |
| user_agent | VARCHAR(500) | NULL | - | Browser user agent string |

### Indexes

```sql
CREATE UNIQUE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(user_id, expires_at) 
  WHERE expires_at > CURRENT_TIMESTAMP;
```

### Foreign Keys

```sql
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

### Prisma Schema

```prisma
model UserSession {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  sessionToken String   @unique @map("session_token") @db.VarChar(255)
  expiresAt    DateTime @map("expires_at") @db.Timestamp(6)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  ipAddress    String?  @map("ip_address") @db.VarChar(45)
  userAgent    String?  @map("user_agent") @db.VarChar(500)
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([expiresAt])
  @@index([userId, expiresAt])
  @@map("user_sessions")
}
```

---

## Table: categories

**Purpose:** Stores predefined and custom expense categories.

### Schema Definition

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique category identifier |
| name | VARCHAR(50) | NOT NULL, UNIQUE | - | Category name (e.g., "Food", "Travel") |
| color | VARCHAR(7) | NOT NULL | '#6366F1' | Hex color code for UI display |
| icon | VARCHAR(50) | NULL | - | Icon identifier (Lucide icon name) |
| is_default | BOOLEAN | NOT NULL | TRUE | Whether category is system-default |
| display_order | INTEGER | NOT NULL | 0 | Sort order for display |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Category creation timestamp |

### Indexes

```sql
CREATE UNIQUE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_is_default ON categories(is_default);
```

### Constraints

```sql
ALTER TABLE categories ADD CONSTRAINT chk_categories_color_format 
  CHECK (color ~* '^#[0-9A-Fa-f]{6}$');

ALTER TABLE categories ADD CONSTRAINT chk_categories_name_length 
  CHECK (LENGTH(TRIM(name)) >= 2);
```

### Seed Data

```sql
INSERT INTO categories (id, name, color, icon, is_default, display_order) VALUES
  (uuid_generate_v4(), 'Food & Dining', '#EF4444', 'Utensils', TRUE, 1),
  (uuid_generate_v4(), 'Transportation', '#3B82F6', 'Car', TRUE, 2),
  (uuid_generate_v4(), 'Utilities', '#10B981', 'Zap', TRUE, 3),
  (uuid_generate_v4(), 'Entertainment', '#8B5CF6', 'Music', TRUE, 4),
  (uuid_generate_v4(), 'Healthcare', '#EC4899', 'Heart', TRUE, 5),
  (uuid_generate_v4(), 'Shopping', '#F59E0B', 'ShoppingBag', TRUE, 6),
  (uuid_generate_v4(), 'Travel', '#06B6D4', 'Plane', TRUE, 7),
  (uuid_generate_v4(), 'Education', '#6366F1', 'BookOpen', TRUE, 8),
  (uuid_generate_v4(), 'Other', '#6B7280', 'MoreHorizontal', TRUE, 9);
```

### Prisma Schema

```prisma
model Category {
  id           String    @id @default(uuid()) @db.Uuid
  name         String    @unique @db.VarChar(50)
  color        String    @default("#6366F1") @db.VarChar(7)
  icon         String?   @db.VarChar(50)
  isDefault    Boolean   @default(true) @map("is_default")
  displayOrder Int       @default(0) @map("display_order")
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  
  expenses     Expense[]
  
  @@index([displayOrder])
  @@index([isDefault])
  @@map("categories")
}
```

---

## Table: expenses

**Purpose:** Stores individual expense transactions.

### Schema Definition

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique expense identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY | - | References users.id |
| category_id | UUID | NOT NULL, FOREIGN KEY | - | References categories.id |
| amount | DECIMAL(12, 2) | NOT NULL | - | Expense amount (supports up to 9,999,999,999.99) |
| expense_date | DATE | NOT NULL | CURRENT_DATE | Date when expense occurred |
| description | VARCHAR(500) | NULL | - | Optional expense description/notes |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last update timestamp |

### Indexes

```sql
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
```

### Foreign Keys

```sql
ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE expenses ADD CONSTRAINT fk_expenses_category
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;
```

### Constraints

```sql
ALTER TABLE expenses ADD CONSTRAINT chk_expenses_amount_positive 
  CHECK (amount > 0);

ALTER TABLE expenses ADD CONSTRAINT chk_expenses_amount_range 
  CHECK (amount <= 9999999999.99);

ALTER TABLE expenses ADD CONSTRAINT chk_expenses_date_not_future 
  CHECK (expense_date <= CURRENT_DATE);
```

### Prisma Schema

```prisma
model Expense {
  id           String    @id @default(uuid()) @db.Uuid
  userId       String    @map("user_id") @db.Uuid
  categoryId   String    @map("category_id") @db.Uuid
  amount       Decimal   @db.Decimal(12, 2)
  expenseDate  DateTime  @default(now()) @map("expense_date") @db.Date
  description  String?   @db.VarChar(500)
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt    DateTime  @updatedAt @map("updated_at") @db.Timestamp(6)
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category     Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  receipts     Receipt[]
  
  @@index([userId])
  @@index([categoryId])
  @@index([expenseDate])
  @@index([userId, expenseDate(sort: Desc)])
  @@index([userId, categoryId])
  @@index([createdAt(sort: Desc)])
  @@map("expenses")
}
```

---

## Table: receipts

**Purpose:** Stores metadata for uploaded receipt files.

### Schema Definition

| Column Name | Data Type | Constraints | Default | Description |
|------------|-----------|-------------|---------|-------------|
| id | UUID | PRIMARY KEY | uuid_generate_v4() | Unique receipt identifier |
| expense_id | UUID | NOT NULL, FOREIGN KEY | - | References expenses.id |
| file_url | VARCHAR(1000) | NOT NULL | - | Full URL to file (S3, storage) |
| file_name | VARCHAR(255) | NOT NULL | - | Original filename |
| file_type | VARCHAR(50) | NOT NULL | - | MIME type (image/jpeg, application/pdf) |
| file_size | BIGINT | NOT NULL | - | File size in bytes |
| uploaded_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Upload timestamp |

### Indexes

```sql
CREATE INDEX idx_receipts_expense_id ON receipts(expense_id);
CREATE INDEX idx_receipts_uploaded_at ON receipts(uploaded_at DESC);
```

### Foreign Keys

```sql
ALTER TABLE receipts ADD CONSTRAINT fk_receipts_expense
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE;
```

### Constraints

```sql
ALTER TABLE receipts ADD CONSTRAINT chk_receipts_file_size 
  CHECK (file_size > 0 AND file_size <= 5242880); -- 5MB in bytes

ALTER TABLE receipts ADD CONSTRAINT chk_receipts_file_type 
  CHECK (file_type IN ('image/jpeg', 'image/png', 'image/jpg', 'application/pdf'));
```

### Prisma Schema

```prisma
model Receipt {
  id         String   @id @default(uuid()) @db.Uuid
  expenseId  String   @map("expense_id") @db.Uuid
  fileUrl    String   @map("file_url") @db.VarChar(1000)
  fileName   String   @map("file_name") @db.VarChar(255)
  fileType   String   @map("file_type") @db.VarChar(50)
  fileSize   BigInt   @map("file_size")
  uploadedAt DateTime @default(now()) @map("uploaded_at") @db.Timestamp(6)
  
  expense    Expense  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  
  @@index([expenseId])
  @@index([uploadedAt(sort: Desc)])
  @@map("receipts")
}
```

---

## Database Functions and Triggers

### Auto-update updated_at Timestamp

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for expenses table
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### Clean Expired Sessions

```sql
-- Function to clean up expired sessions (run periodically via cron)
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Complete Prisma Schema File

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String        @id @default(uuid()) @db.Uuid
  email             String        @unique @db.VarChar(255)
  passwordHash      String        @map("password_hash") @db.VarChar(255)
  name              String?       @db.VarChar(100)
  profilePictureUrl String?       @map("profile_picture_url") @db.VarChar(500)
  emailVerified     Boolean       @default(false) @map("email_verified")
  createdAt         DateTime      @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt         DateTime      @updatedAt @map("updated_at") @db.Timestamp(6)
  lastLogin         DateTime?     @map("last_login") @db.Timestamp(6)
  
  expenses          Expense[]
  sessions          UserSession[]
  
  @@index([createdAt])
  @@index([lastLogin])
  @@map("users")
}

model UserSession {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  sessionToken String   @unique @map("session_token") @db.VarChar(255)
  expiresAt    DateTime @map("expires_at") @db.Timestamp(6)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamp(6)
  ipAddress    String?  @map("ip_address") @db.VarChar(45)
  userAgent    String?  @map("user_agent") @db.VarChar(500)
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([expiresAt])
  @@index([userId, expiresAt])
  @@map("user_sessions")
}

model Category {
  id           String    @id @default(uuid()) @db.Uuid
  name         String    @unique @db.VarChar(50)
  color        String    @default("#6366F1") @db.VarChar(7)
  icon         String?   @db.VarChar(50)
  isDefault    Boolean   @default(true) @map("is_default")
  displayOrder Int       @default(0) @map("display_order")
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  
  expenses     Expense[]
  
  @@index([displayOrder])
  @@index([isDefault])
  @@map("categories")
}

model Expense {
  id          String    @id @default(uuid()) @db.Uuid
  userId      String    @map("user_id") @db.Uuid
  categoryId  String    @map("category_id") @db.Uuid
  amount      Decimal   @db.Decimal(12, 2)
  expenseDate DateTime  @default(now()) @map("expense_date") @db.Date
  description String?   @db.VarChar(500)
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamp(6)
  updatedAt   DateTime  @updatedAt @map("updated_at") @db.Timestamp(6)
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  receipts    Receipt[]
  
  @@index([userId])
  @@index([categoryId])
  @@index([expenseDate])
  @@index([userId, expenseDate(sort: Desc)])
  @@index([userId, categoryId])
  @@index([createdAt(sort: Desc)])
  @@map("expenses")
}

model Receipt {
  id         String   @id @default(uuid()) @db.Uuid
  expenseId  String   @map("expense_id") @db.Uuid
  fileUrl    String   @map("file_url") @db.VarChar(1000)
  fileName   String   @map("file_name") @db.VarChar(255)
  fileType   String   @map("file_type") @db.VarChar(50)
  fileSize   BigInt   @map("file_size")
  uploadedAt DateTime @default(now()) @map("uploaded_at") @db.Timestamp(6)
  
  expense    Expense  @relation(fields: [expenseId], references: [id], onDelete: Cascade)
  
  @@index([expenseId])
  @@index([uploadedAt(sort: Desc)])
  @@map("receipts")
}
```

---

## Migration Commands

### Initial Setup
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database with categories
npx prisma db seed
```

### Ongoing Development
```bash
# Create new migration after schema changes
npx prisma migrate dev --name [migration_name]

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## Performance Optimization Notes

### Index Strategy
1. **Primary Keys:** Automatically indexed (UUID)
2. **Foreign Keys:** All foreign keys indexed for JOIN performance
3. **Query Patterns:** Indexes on common WHERE clause columns (user_id, expense_date)
4. **Composite Indexes:** For multi-column queries (user_id + expense_date)
5. **Partial Indexes:** For filtered queries (active sessions only)

### Query Optimization
- Use `SELECT` with specific columns instead of `SELECT *`
- Leverage Prisma's `select` and `include` for efficient queries
- Use `take` and `skip` for pagination
- Implement cursor-based pagination for large datasets
- Use database-level aggregations for analytics queries

### Data Types Rationale
- **UUID:** Better security, no sequential ID guessing
- **DECIMAL(12,2):** Precise currency calculations (no floating-point errors)
- **VARCHAR vs TEXT:** VARCHAR with limits for better performance and validation
- **TIMESTAMP:** UTC timezone for consistent date handling
- **BIGINT:** Large file sizes (up to 9 exabytes)

### Future Scalability
- **Partitioning:** Partition `expenses` by date range (monthly/yearly)
- **Archiving:** Move old data to archive tables
- **Read Replicas:** Separate read/write databases
- **Caching:** Redis for frequently accessed data (categories, user sessions)
- **Connection Pooling:** PgBouncer for production environments

