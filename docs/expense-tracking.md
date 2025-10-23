# Expense Tracking - User Stories & Test Cases

## User Story 1: Add Expense

**As a** user  
**I want to** add a new expense entry  
**So that** I can track my spending and maintain accurate financial records

### Acceptance Criteria
- User can create a new expense with amount, date, category, and description
- Amount must be a positive number
- Date can be selected from date picker or entered manually
- Category must be selected from predefined list
- Optional receipt upload functionality is available
- User receives confirmation after successful expense creation

### Detailed Test Cases

#### TC-ET-001: Add Expense with Valid Data
**Description:** Verify that a user can successfully add an expense with all required fields  
**Pre-conditions:** User is logged in and on the expense tracking page  
**Test Steps:**
1. Click "Add Expense" button
2. Enter amount: "50.00"
3. Select date: "2025-10-15"
4. Select category: "Food"
5. Enter description: "Lunch at restaurant"
6. Click "Save" button

**Expected Results:**
- Expense is created successfully
- Success message displayed: "Expense added successfully"
- New expense appears in the expense list
- Expense is saved in the database with correct values
- User is redirected to expense list or dashboard
- Total expenses are updated

#### TC-ET-002: Add Expense with Minimum Required Fields
**Description:** Verify that an expense can be added with only required fields  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Click "Add Expense" button
2. Enter amount: "25.99"
3. Select category: "Transportation"
4. Leave optional fields (description, receipt) empty
5. Click "Save" button

**Expected Results:**
- Expense is created successfully
- Default date (today) is used if not specified
- Success message is displayed
- Expense appears in list with provided data
- Optional fields show as empty/null

#### TC-ET-003: Add Expense with Invalid Amount
**Description:** Verify validation for invalid expense amounts  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Try to enter negative amount: "-50.00"
2. Try to enter zero: "0"
3. Try to enter non-numeric value: "abc"
4. Try to enter excessively large amount: "9999999999"
5. Leave amount field empty
6. Click "Save" for each scenario

**Expected Results:**
- Expense creation fails for each invalid input
- Appropriate error messages displayed:
  - "Amount must be positive"
  - "Amount must be greater than zero"
  - "Please enter a valid number"
  - "Amount exceeds maximum limit"
  - "Amount is required"
- No expense is created in database
- User remains on add expense page

#### TC-ET-004: Add Expense with Invalid Date
**Description:** Verify validation for invalid dates  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Try to enter future date beyond allowed range
2. Try to enter date in invalid format
3. Try to enter date too far in the past (e.g., > 10 years)
4. Enter valid amount and category

**Expected Results:**
- Appropriate validation errors displayed
- "Future dates are not allowed" (if business rule)
- "Invalid date format"
- "Date is too far in the past"
- Expense is not created
- Date picker prevents invalid date selection

#### TC-ET-005: Add Expense without Category Selection
**Description:** Verify that category is a required field  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Enter valid amount: "35.00"
2. Select valid date
3. Enter description
4. Leave category unselected
5. Click "Save"

**Expected Results:**
- Expense creation fails
- Error message: "Please select a category"
- Category field is highlighted
- No expense is created
- User remains on add expense page

#### TC-ET-006: Add Expense with Very Long Description
**Description:** Verify character limit for description field  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Enter valid amount and date
2. Select category
3. Enter description exceeding character limit (e.g., 1000+ characters)
4. Click "Save"

**Expected Results:**
- Character counter shows limit (if implemented)
- Either description is truncated to max length
- Or error message: "Description exceeds maximum length of X characters"
- If truncated, expense is created with truncated description
- If rejected, user must shorten description

#### TC-ET-007: Add Expense with Decimal Precision
**Description:** Verify that amounts are handled with correct decimal precision  
**Pre-conditions:** User is logged in and on add expense page  
**Test Steps:**
1. Enter amount with 2 decimals: "45.67"
2. Enter amount with 3 decimals: "45.678"
3. Enter amount with 1 decimal: "45.6"
4. Enter whole number: "45"
5. Save each and verify stored value

**Expected Results:**
- 2 decimals: Stored as "45.67"
- 3 decimals: Rounded to "45.68" or "45.67" (based on rounding rule)
- 1 decimal: Stored as "45.60" or "45.6"
- Whole number: Stored as "45.00" or "45"
- No data loss in precision
- Display format is consistent

#### TC-ET-008: Add Multiple Expenses in Sequence
**Description:** Verify that multiple expenses can be added one after another  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Add first expense with valid data
2. Immediately add second expense with different data
3. Add third expense
4. Navigate to expense list

**Expected Results:**
- All three expenses are created successfully
- Each expense has unique ID
- All expenses appear in the list
- Expenses are sorted correctly (by date or creation time)
- Total count and amount reflect all expenses

---

## User Story 2: Edit Expense

**As a** user  
**I want to** edit an existing expense  
**So that** I can correct mistakes or update information

### Acceptance Criteria
- User can select an expense to edit
- All expense fields can be modified
- Changes are validated before saving
- User can cancel editing without saving changes
- Edit history or timestamp is maintained
- User receives confirmation after successful update

### Detailed Test Cases

#### TC-ET-009: Edit Expense Successfully
**Description:** Verify that a user can edit an existing expense  
**Pre-conditions:** An expense exists with amount "50.00", category "Food", date "2025-10-15"  
**Test Steps:**
1. Navigate to expense list
2. Click "Edit" button for the expense
3. Change amount to "55.00"
4. Change category to "Dining"
5. Update description
6. Click "Save Changes"

**Expected Results:**
- Expense is updated successfully
- Success message: "Expense updated successfully"
- Updated values are displayed in the list
- Database reflects the changes
- Last modified timestamp is updated
- Previous values are replaced

#### TC-ET-010: Edit Expense and Cancel
**Description:** Verify that changes can be discarded  
**Pre-conditions:** An expense exists in the system  
**Test Steps:**
1. Click "Edit" on an expense
2. Modify amount, category, and description
3. Click "Cancel" button

**Expected Results:**
- Changes are not saved
- Expense retains original values
- User is returned to expense list
- No database update occurs
- No success message is shown

#### TC-ET-011: Edit Expense with Invalid Data
**Description:** Verify validation when editing with invalid data  
**Pre-conditions:** An expense exists and is being edited  
**Test Steps:**
1. Change amount to "-25.00"
2. Click "Save"
3. Change amount back to valid, but leave category unselected
4. Click "Save"

**Expected Results:**
- First save fails with error: "Amount must be positive"
- Second save fails with error: "Category is required"
- Original expense data remains unchanged
- User stays on edit page
- Can correct and save again

#### TC-ET-012: Edit Multiple Fields Simultaneously
**Description:** Verify that multiple fields can be updated at once  
**Pre-conditions:** An expense exists with all fields populated  
**Test Steps:**
1. Click "Edit" on an expense
2. Change amount, date, category, and description
3. Click "Save Changes"

**Expected Results:**
- All changes are saved successfully
- All fields reflect new values
- Success message is displayed
- Database is updated with all changes
- No partial updates occur

#### TC-ET-013: Edit Expense Amount Format
**Description:** Verify amount formatting when editing  
**Pre-conditions:** Expense exists with amount "50.00"  
**Test Steps:**
1. Edit the expense
2. Change amount to "75.5"
3. Save changes
4. View the expense

**Expected Results:**
- Amount is saved correctly
- Display shows proper formatting (e.g., "75.50")
- No precision loss occurs
- Calculations use accurate value

#### TC-ET-014: Edit Expense Date to Current Date
**Description:** Verify that expense date can be updated to today  
**Pre-conditions:** Expense exists with past date  
**Test Steps:**
1. Edit an expense with date "2025-10-01"
2. Change date to current date
3. Save changes

**Expected Results:**
- Date is updated successfully
- Expense appears in correct chronological order
- Dashboard/reports reflect new date
- Sorting is updated if date-based

#### TC-ET-015: Concurrent Editing Prevention
**Description:** Verify handling of concurrent edit attempts (if applicable)  
**Pre-conditions:** Same expense opened in two browser tabs by same or different users  
**Test Steps:**
1. Open expense in Tab 1 for editing
2. Open same expense in Tab 2 for editing
3. Make changes in Tab 1 and save
4. Make different changes in Tab 2 and save

**Expected Results:**
- Either last save wins with warning
- Or second save fails with error: "This expense has been modified. Please refresh and try again"
- Data integrity is maintained
- No changes are lost silently
- User is notified of conflict

---

## User Story 3: Delete Expense

**As a** user  
**I want to** delete an expense  
**So that** I can remove incorrect or duplicate entries

### Acceptance Criteria
- User can delete individual expenses
- Confirmation is required before deletion
- Deleted expenses are permanently removed (or soft-deleted)
- User receives confirmation after successful deletion
- Deletion updates totals and statistics
- Cannot delete non-existent or unauthorized expenses

### Detailed Test Cases

#### TC-ET-016: Delete Expense Successfully
**Description:** Verify that a user can delete an expense  
**Pre-conditions:** User has at least one expense in the system  
**Test Steps:**
1. Navigate to expense list
2. Click "Delete" button for a specific expense
3. Confirm deletion in the confirmation dialog
4. Click "Yes" or "Confirm"

**Expected Results:**
- Expense is deleted successfully
- Confirmation message: "Expense deleted successfully"
- Expense is removed from the list
- Database record is deleted or marked as deleted
- Total expense count decreases
- Total amount is recalculated

#### TC-ET-017: Cancel Expense Deletion
**Description:** Verify that deletion can be cancelled  
**Pre-conditions:** User has at least one expense  
**Test Steps:**
1. Click "Delete" on an expense
2. Confirmation dialog appears
3. Click "Cancel" or "No"

**Expected Results:**
- Deletion is cancelled
- Expense remains in the list
- No database changes occur
- No confirmation message shown
- User can still interact with the expense

#### TC-ET-018: Delete Expense with Receipt Attached
**Description:** Verify that deleting expense also removes associated receipt  
**Pre-conditions:** Expense exists with an uploaded receipt  
**Test Steps:**
1. Identify expense with receipt
2. Click "Delete"
3. Confirm deletion
4. Verify receipt file storage

**Expected Results:**
- Expense is deleted
- Associated receipt file is also deleted from storage
- No orphaned files remain
- Storage space is freed
- No broken links or references

#### TC-ET-019: Delete Last Remaining Expense
**Description:** Verify system behavior when deleting the only expense  
**Pre-conditions:** User has exactly one expense  
**Test Steps:**
1. Delete the only expense
2. Confirm deletion
3. View expense list

**Expected Results:**
- Expense is deleted successfully
- Empty state is displayed in expense list
- Total shows 0 or appropriate empty message
- No errors occur
- User can add new expense

#### TC-ET-020: Attempt to Delete Already Deleted Expense
**Description:** Verify handling of double-deletion attempts  
**Pre-conditions:** User has an expense  
**Test Steps:**
1. Delete an expense
2. Immediately try to delete the same expense again (via cached page or direct ID)

**Expected Results:**
- Second deletion attempt fails gracefully
- Error message: "Expense not found or already deleted"
- No server error occurs
- User is redirected or page is refreshed

#### TC-ET-021: Delete Multiple Expenses Sequentially
**Description:** Verify that multiple expenses can be deleted one after another  
**Pre-conditions:** User has multiple expenses  
**Test Steps:**
1. Delete first expense and confirm
2. Immediately delete second expense and confirm
3. Delete third expense and confirm

**Expected Results:**
- All deletions succeed
- Each deletion shows confirmation
- Expense list updates after each deletion
- Total count and amount update correctly
- No performance degradation

#### TC-ET-022: Bulk Delete Expenses (if implemented)
**Description:** Verify bulk deletion functionality  
**Pre-conditions:** User has multiple expenses  
**Test Steps:**
1. Select multiple expenses using checkboxes
2. Click "Delete Selected" button
3. Confirm bulk deletion

**Expected Results:**
- All selected expenses are deleted
- Confirmation shows count: "X expenses deleted"
- All selected items removed from list
- Totals updated correctly
- Unselected expenses remain

---

## User Story 4: Categorize Expenses

**As a** user  
**I want to** assign categories to my expenses  
**So that** I can organize and analyze my spending by type

### Acceptance Criteria
- Predefined categories are available (Food, Travel, Utilities, Entertainment, etc.)
- User can select a category when adding or editing expenses
- Each expense must have exactly one category
- Categories are displayed consistently across the application
- Category selection is user-friendly (dropdown, buttons, or autocomplete)

### Detailed Test Cases

#### TC-ET-023: View Available Categories
**Description:** Verify that all predefined categories are available for selection  
**Pre-conditions:** User is on add/edit expense page  
**Test Steps:**
1. Click on category dropdown/selector
2. View all available categories

**Expected Results:**
- All predefined categories are displayed:
  - Food
  - Travel
  - Utilities
  - Entertainment
  - Healthcare
  - Shopping
  - Other
- Categories are sorted alphabetically or logically
- All categories are selectable
- Clear visual presentation

#### TC-ET-024: Select Category When Adding Expense
**Description:** Verify category selection during expense creation  
**Pre-conditions:** User is adding a new expense  
**Test Steps:**
1. Click "Add Expense"
2. Enter amount and date
3. Click category dropdown
4. Select "Food"
5. Save expense

**Expected Results:**
- Category "Food" is selected
- Selection is visually confirmed
- Expense is saved with correct category
- Category appears in expense list
- Category can be used for filtering

#### TC-ET-025: Change Category When Editing Expense
**Description:** Verify that category can be changed during edit  
**Pre-conditions:** Expense exists with category "Food"  
**Test Steps:**
1. Edit the expense
2. Change category from "Food" to "Entertainment"
3. Save changes

**Expected Results:**
- Category is updated to "Entertainment"
- Success message displayed
- Updated category shown in list
- Database reflects new category
- Statistics/charts update accordingly

#### TC-ET-026: Category Display Consistency
**Description:** Verify that category names are consistent across application  
**Pre-conditions:** Expenses exist with various categories  
**Test Steps:**
1. View expense list and note category names
2. View dashboard/charts and note category labels
3. Edit an expense and view category options
4. View any reports or exports

**Expected Results:**
- Category names are identical everywhere
- Capitalization is consistent
- Icons (if used) are consistent
- No duplicate or similar categories
- Spelling is correct throughout

#### TC-ET-027: Default Category Selection
**Description:** Verify default category behavior (if applicable)  
**Pre-conditions:** User is adding a new expense  
**Test Steps:**
1. Open add expense form
2. Check if any category is pre-selected
3. If no default, verify validation requires selection

**Expected Results:**
- Either a default category is selected (e.g., "Other")
- Or no category is selected and selection is required
- Validation prevents saving without category
- Default choice is sensible and documented

#### TC-ET-028: Filter Expenses by Category
**Description:** Verify that expenses can be filtered by category  
**Pre-conditions:** Multiple expenses exist across different categories  
**Test Steps:**
1. Navigate to expense list
2. Apply category filter for "Food"
3. Apply filter for "Travel"
4. Apply "All Categories"

**Expected Results:**
- "Food" filter shows only food expenses
- "Travel" filter shows only travel expenses
- "All Categories" shows all expenses
- Count reflects filtered results
- Totals reflect filtered amounts

---

## User Story 5: Upload Receipts

**As a** user  
**I want to** upload receipt images for my expenses  
**So that** I can maintain proof of purchase and reference details later

### Acceptance Criteria
- User can upload image files (JPEG, PNG, PDF)
- Both manual file selection and drag-and-drop are supported
- File size is validated (e.g., max 5MB)
- Receipt can be viewed after upload
- Receipt can be uploaded during expense creation or added later
- Receipt can be replaced or deleted
- Multiple receipts per expense (optional feature)

### Detailed Test Cases

#### TC-ET-029: Upload Receipt via File Selection
**Description:** Verify receipt upload using file picker  
**Pre-conditions:** User is adding or editing an expense  
**Test Steps:**
1. Click "Upload Receipt" or "Attach File" button
2. File picker dialog opens
3. Select a valid image file (JPEG, 2MB)
4. Click "Open"

**Expected Results:**
- File uploads successfully
- Upload progress indicator shown (if applicable)
- Success message: "Receipt uploaded"
- Receipt preview/thumbnail is displayed
- File is stored on server or cloud storage
- Receipt is associated with expense

#### TC-ET-030: Upload Receipt via Drag and Drop
**Description:** Verify drag and drop functionality  
**Pre-conditions:** User is on add/edit expense page  
**Test Steps:**
1. Open file explorer and locate receipt image
2. Drag the image file over the upload area
3. Drop zone highlights during drag
4. Drop the file

**Expected Results:**
- Drop zone provides visual feedback (highlight, border change)
- File uploads automatically after drop
- Upload progress shown
- Success message displayed
- Receipt preview appears
- File is saved and linked to expense

#### TC-ET-031: Upload Invalid File Type
**Description:** Verify validation for unsupported file formats  
**Pre-conditions:** User is uploading a receipt  
**Test Steps:**
1. Try to upload .txt file
2. Try to upload .docx file
3. Try to upload .exe file
4. Try to upload .mp4 file

**Expected Results:**
- Upload fails for each invalid type
- Error message: "Unsupported file format. Please upload JPEG, PNG, or PDF"
- No file is stored
- User can try again with valid file
- Accepted formats are clearly indicated

#### TC-ET-032: Upload File Exceeding Size Limit
**Description:** Verify file size validation  
**Pre-conditions:** User is uploading a receipt  
**Test Steps:**
1. Try to upload an image file larger than 5MB
2. Try to upload PDF larger than 5MB

**Expected Results:**
- Upload fails
- Error message: "File size exceeds 5MB limit"
- No file is uploaded
- Current file size is shown (if possible)
- User can compress or choose different file

#### TC-ET-033: Upload Multiple Valid Files
**Description:** Verify multiple receipt uploads (if supported)  
**Pre-conditions:** User is adding/editing an expense  
**Test Steps:**
1. Upload first receipt (front of receipt)
2. Upload second receipt (back or additional document)
3. Upload third receipt
4. Save expense

**Expected Results:**
- All receipts upload successfully
- Each receipt is displayed separately
- All receipts are stored
- Clear indication of multiple attachments (e.g., "3 receipts")
- Each can be viewed individually

#### TC-ET-034: View Uploaded Receipt
**Description:** Verify that uploaded receipts can be viewed  
**Pre-conditions:** Expense has an uploaded receipt  
**Test Steps:**
1. Navigate to expense list
2. Click on expense with receipt
3. Click on receipt thumbnail or "View Receipt" link

**Expected Results:**
- Receipt opens in viewer (modal, new tab, or lightbox)
- Image is displayed in full quality
- Zoom functionality available (if image viewer)
- Close/back option is available
- PDF opens in appropriate viewer

#### TC-ET-035: Replace Existing Receipt
**Description:** Verify that a receipt can be replaced  
**Pre-conditions:** Expense already has a receipt attached  
**Test Steps:**
1. Edit the expense
2. Click "Change Receipt" or upload new file
3. Select new receipt image
4. Save changes

**Expected Results:**
- New receipt replaces old one
- Old receipt is removed from storage
- New receipt is displayed
- Success message shown
- Only one receipt remains (if single receipt mode)

#### TC-ET-036: Delete Receipt
**Description:** Verify that a receipt can be removed  
**Pre-conditions:** Expense has an uploaded receipt  
**Test Steps:**
1. Edit expense with receipt
2. Click "Remove Receipt" or delete icon
3. Confirm deletion if prompted
4. Save expense

**Expected Results:**
- Receipt is removed from expense
- File is deleted from storage
- Expense remains but shows no receipt
- Upload area becomes available again
- User can upload new receipt

#### TC-ET-037: Upload Receipt with Special Characters in Filename
**Description:** Verify handling of filenames with special characters  
**Pre-conditions:** User is uploading a receipt  
**Test Steps:**
1. Upload file named: "Receipt #123 @Store (2025).jpg"
2. Upload file with unicode characters: "квитанция.png"
3. Upload file with spaces: "My Receipt.jpg"

**Expected Results:**
- Files upload successfully
- Filenames are sanitized if necessary
- No errors due to special characters
- Files are retrievable and viewable
- Original filename preserved or safely modified

#### TC-ET-038: Upload Receipt Without Expense Data
**Description:** Verify upload behavior when expense is not yet saved  
**Pre-conditions:** User is creating new expense  
**Test Steps:**
1. Click "Add Expense"
2. Upload receipt before entering amount/category
3. Then enter expense details
4. Save expense

**Expected Results:**
- Receipt upload succeeds even before other fields filled
- Receipt remains attached after entering data
- Expense saves with receipt
- Or system prompts to save expense first (implementation dependent)

#### TC-ET-039: Download Uploaded Receipt
**Description:** Verify that receipts can be downloaded  
**Pre-conditions:** Expense has uploaded receipt  
**Test Steps:**
1. View expense with receipt
2. Click "Download" button or right-click and save
3. Check downloaded file

**Expected Results:**
- Receipt downloads to user's device
- Downloaded file matches original upload
- File opens correctly in image viewer/PDF reader
- Filename is meaningful
- Download doesn't remove receipt from expense

#### TC-ET-040: Upload Receipt on Mobile/Touch Device
**Description:** Verify receipt upload on mobile devices  
**Pre-conditions:** User accessing app on mobile device  
**Test Steps:**
1. Open expense form on mobile
2. Click upload receipt
3. Select from gallery or take photo with camera
4. Upload selected image

**Expected Results:**
- Camera option is available (if device supports)
- Gallery selection works
- Upload completes successfully
- Preview renders correctly on mobile
- Touch interactions work smoothly

