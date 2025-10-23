# User Management - User Stories & Test Cases

## User Story 1: User Registration

**As a** new user  
**I want to** create an account with my email and password  
**So that** I can access the expense tracker application

### Acceptance Criteria
- User can sign up with a valid email address and password
- System validates email format and password strength
- User receives confirmation after successful registration
- Duplicate email addresses are not allowed
- All required fields must be filled

### Detailed Test Cases

#### TC-UM-001: Successful User Registration
**Description:** Verify that a user can successfully register with valid credentials  
**Pre-conditions:** User is on the registration page and does not have an existing account  
**Test Steps:**
1. Navigate to the signup page
2. Enter a valid email address (e.g., user@example.com)
3. Enter a strong password (min 8 characters, uppercase, lowercase, number, special character)
4. Confirm the password by entering it again
5. Click the "Sign Up" button

**Expected Results:**
- Registration is successful
- User is redirected to the dashboard or login page
- Success message is displayed
- User account is created in the database
- User can log in with the registered credentials

#### TC-UM-002: Registration with Duplicate Email
**Description:** Verify that the system prevents registration with an already registered email  
**Pre-conditions:** An account with email "existing@example.com" already exists  
**Test Steps:**
1. Navigate to the signup page
2. Enter email address "existing@example.com"
3. Enter a valid password
4. Confirm the password
5. Click the "Sign Up" button

**Expected Results:**
- Registration fails
- Error message displayed: "This email is already registered"
- User remains on the registration page
- No new account is created

#### TC-UM-003: Registration with Invalid Email Format
**Description:** Verify that the system validates email format during registration  
**Pre-conditions:** User is on the registration page  
**Test Steps:**
1. Navigate to the signup page
2. Enter invalid email formats:
   - "notanemail"
   - "missing@domain"
   - "@nodomain.com"
   - "spaces in@email.com"
3. Enter a valid password
4. Click the "Sign Up" button

**Expected Results:**
- Registration fails for each invalid email
- Error message displayed: "Please enter a valid email address"
- Sign Up button may be disabled until valid email is entered
- No account is created

#### TC-UM-004: Registration with Weak Password
**Description:** Verify password strength requirements  
**Pre-conditions:** User is on the registration page  
**Test Steps:**
1. Navigate to the signup page
2. Enter a valid email address
3. Try passwords that don't meet requirements:
   - Less than 8 characters: "Pass1!"
   - No uppercase: "password123!"
   - No lowercase: "PASSWORD123!"
   - No numbers: "Password!"
   - No special characters: "Password123"
4. Click the "Sign Up" button

**Expected Results:**
- Registration fails
- Error message displays password requirements
- Visual indicator shows password strength
- No account is created

#### TC-UM-005: Registration with Mismatched Passwords
**Description:** Verify that password confirmation field must match password  
**Pre-conditions:** User is on the registration page  
**Test Steps:**
1. Navigate to the signup page
2. Enter a valid email address
3. Enter a strong password in the password field
4. Enter a different password in the confirm password field
5. Click the "Sign Up" button

**Expected Results:**
- Registration fails
- Error message displayed: "Passwords do not match"
- User remains on registration page
- No account is created

#### TC-UM-006: Registration with Empty Required Fields
**Description:** Verify that all required fields must be filled  
**Pre-conditions:** User is on the registration page  
**Test Steps:**
1. Navigate to the signup page
2. Leave email field empty, fill password fields
3. Click the "Sign Up" button
4. Fill email, leave password fields empty
5. Click the "Sign Up" button
6. Leave all fields empty
7. Click the "Sign Up" button

**Expected Results:**
- Registration fails in all scenarios
- Error messages indicate which fields are required
- Form highlights empty required fields
- No account is created

---

## User Story 2: User Login

**As a** registered user  
**I want to** log in with my credentials  
**So that** I can access my expense tracking dashboard

### Acceptance Criteria
- User can log in with valid email and password
- Invalid credentials display appropriate error message
- User is redirected to dashboard upon successful login
- Session is maintained across page refreshes
- Login attempts are rate-limited for security

### Detailed Test Cases

#### TC-UM-007: Successful Login
**Description:** Verify that a user can successfully log in with valid credentials  
**Pre-conditions:** User has a registered account with email "user@example.com" and password "Password123!"  
**Test Steps:**
1. Navigate to the login page
2. Enter email: "user@example.com"
3. Enter password: "Password123!"
4. Click the "Login" button

**Expected Results:**
- Login is successful
- User is redirected to the dashboard
- Welcome message or user profile is displayed
- Session token/cookie is created
- User can access protected routes

#### TC-UM-008: Login with Incorrect Password
**Description:** Verify that login fails with incorrect password  
**Pre-conditions:** User has a registered account  
**Test Steps:**
1. Navigate to the login page
2. Enter a valid registered email
3. Enter an incorrect password
4. Click the "Login" button

**Expected Results:**
- Login fails
- Error message displayed: "Invalid email or password"
- User remains on login page
- No session is created
- Account is not locked (unless multiple attempts)

#### TC-UM-009: Login with Non-existent Email
**Description:** Verify that login fails with unregistered email  
**Pre-conditions:** Email "nonexistent@example.com" is not registered  
**Test Steps:**
1. Navigate to the login page
2. Enter email: "nonexistent@example.com"
3. Enter any password
4. Click the "Login" button

**Expected Results:**
- Login fails
- Error message displayed: "Invalid email or password"
- User remains on login page
- No session is created

#### TC-UM-010: Login with Empty Fields
**Description:** Verify that login requires both email and password  
**Pre-conditions:** User is on the login page  
**Test Steps:**
1. Leave both fields empty and click "Login"
2. Enter email only and click "Login"
3. Enter password only and click "Login"

**Expected Results:**
- Login fails in all scenarios
- Error messages indicate required fields
- Form validation highlights empty fields
- No session is created

#### TC-UM-011: Session Persistence
**Description:** Verify that user session persists across page refreshes  
**Pre-conditions:** User is logged in successfully  
**Test Steps:**
1. Log in with valid credentials
2. Navigate to the dashboard
3. Refresh the page
4. Navigate to different pages within the app
5. Open a new tab with the same domain

**Expected Results:**
- User remains logged in after page refresh
- Session persists across different pages
- User doesn't need to log in again in new tab (same session)
- Protected routes remain accessible

#### TC-UM-012: Rate Limiting for Login Attempts
**Description:** Verify that multiple failed login attempts trigger rate limiting  
**Pre-conditions:** User is on the login page  
**Test Steps:**
1. Attempt to log in with incorrect credentials 5 times consecutively
2. Attempt a 6th login

**Expected Results:**
- After 5 failed attempts, account is temporarily locked or CAPTCHA is required
- Error message displayed: "Too many failed attempts. Please try again in X minutes"
- Legitimate login attempts are blocked temporarily
- After cooldown period, login attempts are allowed again

---

## User Story 3: User Logout

**As a** logged-in user  
**I want to** log out of my account  
**So that** I can secure my account when I'm done using the application

### Acceptance Criteria
- User can log out from any page within the application
- Session is completely terminated upon logout
- User is redirected to login page after logout
- Logout button is visible and accessible when logged in
- After logout, protected routes are not accessible without logging in again

### Detailed Test Cases

#### TC-UM-013: Successful Logout
**Description:** Verify that a user can successfully log out  
**Pre-conditions:** User is logged in and on the dashboard  
**Test Steps:**
1. Locate the logout button/link in the navigation or profile menu
2. Click the "Logout" button
3. Confirm logout if confirmation dialog appears

**Expected Results:**
- User is logged out successfully
- User is redirected to the login page
- Success message displayed: "You have been logged out"
- Session token/cookie is cleared
- User profile information is no longer displayed

#### TC-UM-014: Session Cleanup After Logout
**Description:** Verify that session is completely terminated after logout  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Log in to the application
2. Navigate to the dashboard
3. Click the "Logout" button
4. Try to access protected routes by entering URL directly
5. Use browser back button
6. Check browser storage (localStorage, sessionStorage, cookies)

**Expected Results:**
- All protected routes redirect to login page
- Back button doesn't allow access to previous authenticated pages
- Session tokens are cleared from browser storage
- User must log in again to access the application

#### TC-UM-015: Logout from Multiple Pages
**Description:** Verify that logout works from different pages within the app  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Log in to the application
2. From the dashboard, click "Logout" and verify successful logout
3. Log in again
4. Navigate to expenses page, click "Logout" and verify
5. Log in again
6. Navigate to profile page, click "Logout" and verify

**Expected Results:**
- Logout is successful from all pages
- User is redirected to login page in each case
- Session is cleared in all scenarios

#### TC-UM-016: Logout Accessibility
**Description:** Verify that logout option is always accessible when logged in  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Check for logout button in main navigation
2. Navigate to different pages and verify logout is accessible
3. Check profile dropdown/menu for logout option
4. Test on mobile viewport (if responsive)

**Expected Results:**
- Logout button/link is visible on all pages
- Logout is accessible via navigation or profile menu
- Logout option is appropriately styled and labeled
- Works on all device sizes

---

## User Story 4: Profile Setup and Management

**As a** registered user  
**I want to** view and update my profile information  
**So that** I can keep my account details current and personalized

### Acceptance Criteria
- User can view their profile information
- User can update profile details (name, email, profile picture)
- User can change their password
- Profile changes are validated before saving
- User receives confirmation after successful updates
- Email changes require verification

### Detailed Test Cases

#### TC-UM-017: View Profile Information
**Description:** Verify that a user can view their profile information  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Navigate to the profile page
2. Verify all profile fields are displayed

**Expected Results:**
- Profile page loads successfully
- User's email is displayed
- User's name (if set) is displayed
- Profile picture (if uploaded) is displayed
- Account creation date is shown
- All information matches the database records

#### TC-UM-018: Update Profile Name
**Description:** Verify that a user can update their name  
**Pre-conditions:** User is logged in and on the profile page  
**Test Steps:**
1. Click the "Edit Profile" button
2. Update the name field with a new name
3. Click "Save Changes"

**Expected Results:**
- Name is updated successfully
- Success message displayed: "Profile updated successfully"
- New name is reflected immediately on the page
- Database is updated with new name
- New name appears across the application

#### TC-UM-019: Update Profile with Invalid Data
**Description:** Verify validation when updating profile with invalid data  
**Pre-conditions:** User is logged in and editing profile  
**Test Steps:**
1. Try to save name with only spaces
2. Try to save name with special characters only
3. Try to save name exceeding maximum length (e.g., 100 characters)
4. Try to save with an invalid email format

**Expected Results:**
- Updates fail for invalid data
- Appropriate error messages are displayed for each validation
- No changes are saved to the database
- User remains on the edit profile page

#### TC-UM-020: Change Password
**Description:** Verify that a user can change their password  
**Pre-conditions:** User is logged in with password "OldPass123!"  
**Test Steps:**
1. Navigate to profile or security settings
2. Click "Change Password"
3. Enter current password: "OldPass123!"
4. Enter new password: "NewPass123!"
5. Confirm new password: "NewPass123!"
6. Click "Update Password"

**Expected Results:**
- Password is updated successfully
- Success message displayed
- User can log in with new password
- User cannot log in with old password
- User remains logged in (session not terminated)

#### TC-UM-021: Change Password with Incorrect Current Password
**Description:** Verify that password change requires correct current password  
**Pre-conditions:** User is logged in  
**Test Steps:**
1. Navigate to change password section
2. Enter incorrect current password
3. Enter valid new password
4. Confirm new password
5. Click "Update Password"

**Expected Results:**
- Password change fails
- Error message: "Current password is incorrect"
- Password remains unchanged in database
- User can still log in with original password

#### TC-UM-022: Change Password with Weak New Password
**Description:** Verify that new password must meet strength requirements  
**Pre-conditions:** User is logged in and changing password  
**Test Steps:**
1. Enter correct current password
2. Enter weak new password (e.g., "weak")
3. Click "Update Password"

**Expected Results:**
- Password change fails
- Error message displays password requirements
- Original password remains unchanged
- Password strength indicator shows weakness

#### TC-UM-023: Update Email Address
**Description:** Verify that a user can update their email address  
**Pre-conditions:** User is logged in with email "old@example.com"  
**Test Steps:**
1. Navigate to profile edit page
2. Change email to "new@example.com"
3. Click "Save Changes"
4. Verify email if verification is required

**Expected Results:**
- Email update is initiated
- Verification email sent to new address (if verification required)
- Success message indicates verification needed
- Email is updated after verification
- User can log in with new email

#### TC-UM-024: Update Email to Already Registered Address
**Description:** Verify that email cannot be changed to one already in use  
**Pre-conditions:** Email "existing@example.com" is already registered to another account  
**Test Steps:**
1. Navigate to profile edit page
2. Change email to "existing@example.com"
3. Click "Save Changes"

**Expected Results:**
- Update fails
- Error message: "This email is already in use"
- Email remains unchanged
- User stays on edit profile page

#### TC-UM-025: Upload Profile Picture
**Description:** Verify that a user can upload a profile picture  
**Pre-conditions:** User is logged in and on profile page  
**Test Steps:**
1. Click on profile picture or "Upload Photo" button
2. Select a valid image file (JPEG/PNG, under 5MB)
3. Crop or adjust if crop tool is provided
4. Click "Save" or "Upload"

**Expected Results:**
- Image uploads successfully
- Profile picture is displayed immediately
- Image is stored on server or cloud storage
- Image appears across the application where profile is shown
- Previous profile picture is replaced

#### TC-UM-026: Upload Invalid Profile Picture
**Description:** Verify validation for profile picture uploads  
**Pre-conditions:** User is logged in and uploading profile picture  
**Test Steps:**
1. Try to upload a file larger than 5MB
2. Try to upload unsupported file format (PDF, EXE, etc.)
3. Try to upload corrupted image file

**Expected Results:**
- Upload fails for each invalid case
- Appropriate error messages:
  - "File size exceeds 5MB limit"
  - "Unsupported file format. Please use JPEG or PNG"
  - "Invalid or corrupted image file"
- No changes to existing profile picture
- User can try uploading again

#### TC-UM-027: Cancel Profile Edit
**Description:** Verify that changes can be discarded without saving  
**Pre-conditions:** User is logged in and editing profile  
**Test Steps:**
1. Navigate to edit profile page
2. Make changes to name, email, or other fields
3. Click "Cancel" or navigate away
4. Return to profile page

**Expected Results:**
- Changes are not saved
- Profile displays original information
- No database updates occur
- User is returned to profile view or previous page

