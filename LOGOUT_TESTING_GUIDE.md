# Quick Logout Testing Guide

## Locations Where You Can Now Logout

### 1. **Generic Dashboard** (`/dashboard`)
- **Navbar Logout**: Click "Admin" dropdown → Select "Logout"
- **Sidebar Logout**: Click Menu icon → Scroll down → Click "Logout"

### 2. **Admin Dashboard** (`/admin-dashboard`)
- **Profile Dropdown**: Click "Admin" name with dropdown arrow → Select "Logout"
- **Direct Button**: Click the red "Logout" button on the right

### 3. **Teacher Dashboard** (`/teacher-dashboard`)
- Click red "Logout" button in the top-right header

### 4. **Student Dashboard** (`/student-dashboard`)
- Click red "Logout" button in the top-right header

### 5. **Parent Dashboard** (`/parent-dashboard`)
- Click red "Logout" button in the top-right header

## Quick Test Steps

### Test 1: Basic Logout (5 minutes)
```
1. Open http://localhost:5174/dashboard
2. If not logged in, use: admin@school.com / password
3. Click logout button (any location above)
4. Verify: Redirected to login page
5. Verify: Can see "Logging Out" animation
6. Result: ✅ PASS if on login page after animation
```

### Test 2: Session Doesn't Restore (3 minutes)
```
1. Logout successfully (as above)
2. Refresh the page (Ctrl+R or Cmd+R)
3. Refresh again
4. Verify: Still on login page (not dashboard)
5. Try to manually visit /admin-dashboard
6. Verify: Redirected back to login
7. Result: ✅ PASS if you can't access dashboard
```

### Test 3: Can Login Again (2 minutes)
```
1. After logout test, verify on login page
2. Enter credentials: admin@school.com / password
3. Click "Login"
4. Verify: Logged in successfully
5. Verify: Can see dashboard data
6. Result: ✅ PASS if logged in and dashboard visible
```

### Test 4: All Dashboards Work (5 minutes)
```
Test logout from each dashboard:

Admin:    admin@school.com / password → Admin Dashboard
Teacher:  teacher@school.com / password → Teacher Dashboard
Student:  student@school.com / password → Student Dashboard
Parent:   parent@school.com / password → Parent Dashboard

For each:
- Click logout
- Verify redirect to login
- Verify refresh keeps you on login
```

## Expected Behavior

### ✅ When Logout Works
- Logout button becomes clickable
- Short delay (1 second) with "Logging Out" message
- Smooth redirect to login page
- Page refresh stays on login page
- Accessing protected routes redirects to login
- localStorage is cleared in browser DevTools

### ❌ If Logout Fails
- Logout button doesn't respond
- Still see dashboard after click
- Page refresh shows dashboard again
- Can access dashboard without login
- localStorage still has auth data

## Browser DevTools Check

### Check Logout Was Successful
1. Open DevTools (F12 or Right-click → Inspect)
2. Go to "Application" or "Storage" tab
3. Click "Local Storage"
4. Look for `http://localhost:5174`
5. **✅ PASS**: No `authToken` or `user` entries
6. **❌ FAIL**: Still has `authToken` and `user` data

### Check SessionStorage Flag
1. In DevTools → Application → Session Storage
2. Look for `http://localhost:5174`
3. **✅ PASS** (right after logout): `userLoggedOut: true`
4. **✅ PASS** (after refresh): `userLoggedOut: true`
5. **❌ FAIL**: `userLoggedOut` is missing or false

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh Page | Ctrl+R (Windows) / Cmd+R (Mac) |
| Hard Refresh | Ctrl+Shift+R / Cmd+Shift+R |
| Open DevTools | F12 |
| Clear Storage | DevTools → Application → Clear All |

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Logout button not visible | Refresh page, make sure you're logged in |
| Logout doesn't work | Check DevTools console for errors, restart server |
| Still logged in after logout | Manually clear browser cache |
| Can't find logout button | Try different dashboard locations above |
| Keeps redirecting after logout | Check ProtectedRoute is working in browser console |

## Console Logs to Watch For

### On Logout Click, you should see:
```
✅ "Logout completed successfully"
✅ "Starting logout process..."
```

### If Errors Appear:
```
❌ "Error during logout:"
❌ "Backend logout failed"
```

Check console (F12 → Console tab) for details.

## Test Results Summary

| Test | Expected | Actual | Pass/Fail |
|------|----------|--------|-----------|
| Logout button works | Redirects to login | ☐ | ☐ |
| Session cleared | No localStorage data | ☐ | ☐ |
| Can't access dashboard | Redirect to login | ☐ | ☐ |
| Can login again | Login succeeds | ☐ | ☐ |
| All roles logout | All work | ☐ | ☐ |

---

**Need Help?** 
- Check server logs: Terminal running `npm run dev`
- Check browser console: F12 → Console tab
- Try hard refresh: Ctrl+Shift+R (clears cache)
