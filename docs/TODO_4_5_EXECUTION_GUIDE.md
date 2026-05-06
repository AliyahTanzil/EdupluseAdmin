# TODOS 4 & 5 - QA Testing Execution Guide

**Date:** March 21, 2026  
**Status:** Ready to Execute

---

## TODO 4: Create Test Admin Account via Registration

### Step 1: Open Registration Page
1. Start your application (ensure backend running at localhost:5001)
2. Navigate to: `http://localhost:5174/register`
3. You should see the registration form

### Step 2: Fill Registration Form

**Create Test Account 1 - Head Master**
```
Name:            John Head Master
Email:           john.headmaster@school.com
Account Type:    Admin ← SELECT THIS
Department:      Administration
Phone:           +1-800-111-1111
Password:        password123
Confirm Password: password123
```

Click **Register**

**Create Test Account 2 - Principal**
```
Name:            Sarah Principal
Email:           sarah.principal@school.com
Account Type:    Admin ← SELECT THIS
Department:      Academic Affairs
Phone:           +1-800-222-2222
Password:        password123
Confirm Password: password123
```

Click **Register**

**Create Test Account 3 - CEO**
```
Name:            Michael CEO
Email:           michael.ceo@school.com
Account Type:    Admin ← SELECT THIS
Department:      Executive Management
Phone:           +1-800-333-3333
Password:        password123
Confirm Password: password123
```

Click **Register**

### Step 3: Verify Registration Works
- ✅ Each registration succeeds (no error messages)
- ✅ Redirected to login page after each registration
- ✅ Can login with each new account

### Step 4: Record Results

| Account | Email | Registration | Login | Status |
|---------|-------|--------------|-------|--------|
| Head Master | john.headmaster@school.com | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ |
| Principal | sarah.principal@school.com | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ |
| CEO | michael.ceo@school.com | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ |

---

## TODO 5: Run QA Testing Suite 1 - School Filtering

### Part A: Test Head Master Account

**Setup:**
1. Login: `john.headmaster@school.com` / `password123`
2. You should reach **School Selection Page**

**Verify:**
- [ ] Page loaded successfully
- [ ] Header shows: "Logged in as: Head Master"
- [ ] Header shows: "Viewing 2 available school types"
- [ ] Only 2 schools appear:
  - [ ] Nursery / Day Care
  - [ ] Primary School
- [ ] Junior Secondary is NOT visible
- [ ] Senior Secondary is NOT visible

**Action:**
1. Click on **Nursery / Day Care** school
2. Should go to **Role Selection** page
3. Verify role selection shows available admin roles

**Result:** ☐ PASS ☐ FAIL

---

### Part B: Test Principal Account

**Setup:**
1. Logout from Head Master account (click red Logout button)
2. Login: `sarah.principal@school.com` / `password123`
3. You should reach **School Selection Page**

**Verify:**
- [ ] Page loaded successfully
- [ ] Header shows: "Logged in as: Principal"
- [ ] Header shows: "Viewing 2 available school types"
- [ ] Only 2 schools appear:
  - [ ] Junior Secondary
  - [ ] Senior Secondary
- [ ] Nursery / Day Care is NOT visible
- [ ] Primary School is NOT visible

**Action:**
1. Click on **Junior Secondary** school
2. Should go to **Role Selection** page
3. Verify role selection shows available admin roles

**Result:** ☐ PASS ☐ FAIL

---

### Part C: Test CEO Account

**Setup:**
1. Logout from Principal account (click red Logout button)
2. Login: `michael.ceo@school.com` / `password123`
3. You should reach **School Selection Page**

**Verify:**
- [ ] Page loaded successfully
- [ ] Header shows: "Logged in as: CEO"
- [ ] No restriction message (CEO can see all schools)
- [ ] All 4 schools appear:
  - [ ] Nursery / Day Care
  - [ ] Primary School
  - [ ] Junior Secondary
  - [ ] Senior Secondary

**Action:**
1. Click on **Senior Secondary** school
2. Should go to **Role Selection** page
3. Verify role selection shows CEO role

**Result:** ☐ PASS ☐ FAIL

---

### Part D: Test Existing Admin Account

**Setup:**
1. Logout from CEO account (click red Logout button)
2. Login: `admin@school.com` / `password` (demo account)
3. You should reach **School Selection Page**

**Verify:**
- [ ] Page loaded successfully
- [ ] Admin account can see all 4 schools
- [ ] No filtering messages appear

**Action:**
1. Click any school
2. Proceed to role selection
3. Can select a role and access dashboard

**Result:** ☐ PASS ☐ FAIL

---

## Test Suite 1: School Filtering - Summary

### Test Results Table

| Test Case | Account | Expected Schools | Visible | Result |
|-----------|---------|------------------|---------|--------|
| 1.1 | Head Master | Nursery, Primary | ☐ | ☐ PASS ☐ FAIL |
| 1.2 | Principal | Junior, Senior | ☐ | ☐ PASS ☐ FAIL |
| 1.3 | CEO | All 4 | ☐ | ☐ PASS ☐ FAIL |
| 1.4 | Demo Admin | All 4 | ☐ | ☐ PASS ☐ FAIL |
| 1.5 | Teacher | All 4 | ☐ | ☐ PASS ☐ FAIL |

### Overall Test Results

**Total Tests:** 5  
**Passed:** _____  
**Failed:** _____  
**Pass Rate:** _____% (Should be 100%)

---

## Key Points to Verify

### ✅ Admin Account Creation
- Admin option appears in registration dropdown
- Department field appears when Admin selected
- Can create accounts with different departments
- Can login with created accounts

### ✅ School Filtering
- Head Master only sees 2 schools (**Nursery + Primary**)
- Principal only sees 2 schools (**Junior + Senior Secondary**)
- CEO sees all 4 schools
- No other accounts are filtered

### ✅ Logout Functionality
- Logout button visible on SchoolSelection page
- Logout button visible on RoleSelection page
- Clicking logout redirects to login
- Cannot access dashboard after logout
- Can login again with different account

---

## Troubleshooting

### Problem: Admin option not in dropdown
- **Solution:** Check if Register.jsx changes were saved
- **Check:** Look at lines 138-141 of website/src/pages/Register.jsx

### Problem: Can't login with new account
- **Solution:** Verify backend is running on localhost:5001
- **Check:** Terminal should show "Backend running on port 5001"

### Problem: School filtering not working
- **Solution:** Check if RoleSelection.jsx and SchoolSelection.jsx were updated
- **Verify:** Schools should be filtered based on role.applicableTo property

### Problem: Logout not working
- **Solution:** Check browser console (F12) for errors
- **Check:** localStorage should be empty after logout

### Problem: Only seeing demo accounts
- **Solution:** Check if backend recognizes new admin roles
- **Verify:** backend/routes/auth.js should have admin support

---

## Console Checks

Open Developer Tools (F12) and check:

### After Login
```javascript
// Should have authToken
localStorage.getItem('authToken')  // Should NOT be null

// Should have user data
localStorage.getItem('user')  // Should have user object
```

### After Logout
```javascript
// Should be empty
localStorage.getItem('authToken')  // Should be null
localStorage.getItem('user')  // Should be null

// Should have logout flag
sessionStorage.getItem('userLoggedOut')  // Should be 'true'
```

---

## Browser DevTools Steps

1. **Open DevTools:** Press F12
2. **Go to Application Tab**
3. **Check LocalStorage:**
   - After login: Should have `authToken` and `user` keys
   - After logout: Should be empty
4. **Check Console Tab:**
   - Should see no RED errors
   - Should see "Logout completed successfully" on logout

---

## Files to Reference

- [IMPLEMENTATION_TESTING_GUIDE.md](IMPLEMENTATION_TESTING_GUIDE.md) - Full testing guide
- [ADMIN_ACCOUNT_TYPE_FIX.md](ADMIN_ACCOUNT_TYPE_FIX.md) - Admin registration fix
- [LOGOUT_SELECTION_PAGES_UPDATE.md](LOGOUT_SELECTION_PAGES_UPDATE.md) - Logout buttons

---

## Next Steps After Testing

1. **If All Tests Pass (✅ Expected):**
   - Move to Test Suite 2 (Two-Step Role Selection)
   - Move to Test Suite 3 (End-to-End Flow)
   - Continue with remaining test suites

2. **If Any Test Fails (❌ Unlikely):**
   - Document which test failed
   - Check console for errors (F12)
   - Report specific issue
   - May need to review code changes

---

## Time Estimates

- **TODO 4 (Create Admin Accounts):** 10-15 minutes
- **TODO 5 (Run QA Tests):** 15-20 minutes
- **Total:** ~30-35 minutes for both todos

---

**Status:** READY TO EXECUTE ✅

Please proceed with TODO 4 first, then move to TODO 5 once admin accounts are created.

Report back with results when complete!
