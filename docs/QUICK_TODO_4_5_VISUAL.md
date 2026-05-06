# Quick Visual Guide - TODOs 4 & 5

## TODO 4: Create Admin Test Accounts (10-15 min)

### Step 1: Go to Registration
```
http://localhost:5174/register
```

### Step 2: Fill Form - Account 1
```
┌─────────────────────────────────┐
│   Register Form                 │
├─────────────────────────────────┤
│ Name: John Head Master          │
│ Email: john.headmaster@...      │
│ Account Type: [Admin] ← SELECT  │
│ Department: Administration      │
│ Phone: +1-800-111-1111         │
│ Password: password123           │
│ Confirm: password123            │
│ [Register Button]               │
└─────────────────────────────────┘
```

### Step 3: Repeat for 2 More Accounts
- sarah.principal@school.com (Principal)
- michael.ceo@school.com (CEO)

### Result: ✅ Three admin test accounts created

---

## TODO 5: Test School Filtering (15-20 min)

### Test 1: Login as Head Master
```
Login Page:
┌─────────────────────────┐
│ Email: john.headmaster@ │
│ Password: password123   │
│ [Sign In]               │
└─────────────────────────┘
         ↓
School Selection Page:
┌──────────────────────────────────┐
│ Logged in as: Head Master        │
│ Viewing 2 available schools      │
├──────────────────────────────────┤
│ [Nursery / Day Care]   ← SHOW    │
│ [Primary School]       ← SHOW    │
│                                  │
│ Junior Secondary       ← HIDE    │
│ Senior Secondary       ← HIDE    │
└──────────────────────────────────┘
         ✅ PASS
```

### Test 2: Login as Principal
```
Logout (Click red Logout button)
         ↓
Login with: sarah.principal@school.com
         ↓
School Selection Page:
┌──────────────────────────────────┐
│ Logged in as: Principal          │
│ Viewing 2 available schools      │
├──────────────────────────────────┤
│ Nursery / Day Care     ← HIDE    │
│ Primary School         ← HIDE    │
│                                  │
│ [Junior Secondary]     ← SHOW    │
│ [Senior Secondary]     ← SHOW    │
└──────────────────────────────────┘
         ✅ PASS
```

### Test 3: Login as CEO
```
Logout (Click red Logout button)
         ↓
Login with: michael.ceo@school.com
         ↓
School Selection Page:
┌──────────────────────────────────┐
│ Logged in as: CEO                │
│                                  │
│ [Nursery / Day Care]   ← SHOW    │
│ [Primary School]       ← SHOW    │
│ [Junior Secondary]     ← SHOW    │
│ [Senior Secondary]     ← SHOW    │
└──────────────────────────────────┘
         ✅ PASS
```

---

## Key Checkpoints

### After TODO 4 (Account Creation)
- [x] Can access registration page
- [x] Admin option appears in dropdown
- [x] Can create 3 new admin accounts
- [x] Can login with each new account

### After TODO 5 (School Filtering)
- [x] Head Master sees only 2 schools (Nursery + Primary)
- [x] Principal sees only 2 schools (Junior + Senior)
- [x] CEO sees all 4 schools
- [x] Logout button works on all pages
- [x] Can switch between accounts

---

## What You'll See

### If Everything Works ✅
```
Todo 4: Creates 3 test accounts
Todo 5: Each account sees correct schools
Result: Feature is working perfectly!
```

### If Something Fails ❌
```
Issue: Admin option not in dropdown
Check: website/src/pages/Register.jsx (line 138-141)
Fix: Ensure Admin option was added to select dropdown

Issue: Can't see Head Master with 2 schools
Check: website/src/pages/SchoolSelection.jsx
Fix: School filtering logic may need review
```

---

## Files You'll Use

📄 [Register Page](website/src/pages/Register.jsx) - Create accounts  
📄 [School Selection](website/src/pages/SchoolSelection.jsx) - Filter schools  
📄 [Role Selection](website/src/pages/RoleSelection.jsx) - Choose role  
📄 [RBAC Config](website/src/config/rbac.js) - Role definitions  

---

## Quick Commands

### Check Backend Running
```bash
# Should see in terminal:
Backend running on port 5001
Database connected
API listening...
```

### Check Frontend Running
```bash
# Should see in browser:
http://localhost:5174/
EduPlus Admin - Student Management System
```

### Check Console (F12)
```javascript
// After login:
localStorage.getItem('authToken')  // Should exist

// After logout:
localStorage.getItem('authToken')  // Should be null
```

---

## Success Criteria

### TODO 4: ✅ PASS
- [x] Registered 3 admin accounts
- [x] Each account has unique email
- [x] Can login with each account

### TODO 5: ✅ PASS
- [x] Head Master sees 2 schools
- [x] Principal sees 2 schools
- [x] CEO sees 4 schools
- [x] Logout works from all pages
- [x] No console errors

---

## Time Breakdown

```
TODO 4: Create Accounts
├─ Go to register page        1 min
├─ Create Head Master         2 min
├─ Create Principal           2 min
├─ Create CEO                 2 min
├─ Verify all can login       3 min
└─ Total                    ~10 min

TODO 5: Test Filtering
├─ Test Head Master           3 min
├─ Test Principal             3 min
├─ Test CEO                   3 min
├─ Test logout               2 min
├─ Verify results            2 min
└─ Total                    ~15 min

GRAND TOTAL: ~25 min ⏱️
```

---

## Ready? 🚀

**Start with TODO 4:**
1. Open http://localhost:5174/register
2. Create first admin account
3. Report back when all 3 accounts are created

**Then do TODO 5:**
1. Login to each account
2. Verify school filtering works
3. Report results

---

📍 See [TODO_4_5_EXECUTION_GUIDE.md](TODO_4_5_EXECUTION_GUIDE.md) for detailed steps!
