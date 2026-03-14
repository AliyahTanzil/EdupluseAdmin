# Students Module - Testing Guide

**Test Date:** March 8, 2026  
**Module:** Students CRUD (Create, Read, Update, Delete)  
**Status:** Ready for QA

---

## 🎯 Pre-Testing Checklist

Before running tests, ensure:

- [ ] Backend server running on `localhost:5000`
- [ ] Frontend dev server running (`npm run dev`)
- [ ] No console errors
- [ ] Browser DevTools open for inspection
- [ ] Network tab available for API monitoring

**Start backend:**
```bash
cd backend
npm start
```

**Start frontend:**
```bash
npm run dev
```

---

## 🧪 Test Cases

### TEST 1: View Students List
**Route:** `/students`

**Steps:**
1. Navigate to `/students`
2. Wait for page to load

**Expected Results:**
- [ ] Loading spinner appears briefly
- [ ] Students list loads from API
- [ ] Table shows columns: Roll No, Name, Class, Email, Phone
- [ ] Edit and Delete buttons visible
- [ ] "Add New Student" button in header
- [ ] No errors in console

**Network:**
- [ ] GET request to `/api/students?limit=50&offset=0`
- [ ] Response: 200 OK with student data

---

### TEST 2: Add New Student
**Route:** `/add-new-student`

**Steps:**
1. Click "Add New Student" button
2. Fill required fields:
   - Name: "Test Student"
   - Roll: "999"
   - Class: "10-A"
   - Email: "test@school.com"
   - Phone: "9999999999"
3. Click "Create Student"

**Expected Results:**
- [ ] Form validates required fields
- [ ] Submit button shows "Creating..." state
- [ ] Success message appears
- [ ] Auto-redirect to `/students` after 1.5 seconds
- [ ] New student visible in list

**Network:**
- [ ] POST request to `/api/students`
- [ ] Request body contains all form data
- [ ] Response: 201 Created with new student

---

### TEST 3: Edit Student
**Route:** `/edit-student/:id`

**Steps:**
1. Go to `/students`
2. Click Edit button on any student
3. Modify a field (e.g., email)
4. Click "Save Changes"

**Expected Results:**
- [ ] Page loads with LoadingSpinner
- [ ] Form pre-populated with student data
- [ ] Edit form shows all fields filled
- [ ] Save button shows "Saving..." state
- [ ] Success message appears
- [ ] Auto-redirect to `/students`
- [ ] Updated data visible in list

**Network:**
- [ ] GET request to `/api/students/:id` (on load)
- [ ] PUT request to `/api/students/:id` (on save)
- [ ] Response: 200 OK with updated student

---

### TEST 4: Delete Student
**Route:** `/students`

**Steps:**
1. Go to `/students`
2. Click Delete button on any student
3. Confirm in dialog

**Expected Results:**
- [ ] Confirmation dialog appears
- [ ] After confirmation, student removed from list
- [ ] No page reload required
- [ ] List updates immediately

**Network:**
- [ ] DELETE request to `/api/students/:id`
- [ ] Response: 200 OK with success message

---

### TEST 5: Form Validation
**Route:** `/add-new-student`

**Steps:**
1. Navigate to `/add-new-student`
2. Try submitting with empty fields

**Expected Results:**
- [ ] Form shows validation error
- [ ] Submit is prevented
- [ ] Error message: "Please fill all required fields"
- [ ] No API request sent

---

### TEST 6: Error Handling
**Route:** `/students`

**Steps:**
1. Stop backend server
2. Navigate to `/students`
3. Observe error handling

**Expected Results:**
- [ ] Error alert appears
- [ ] User-friendly error message shown
- [ ] No page crash
- [ ] Alert is dismissible

---

### TEST 7: Empty State
**Route:** `/students` (when no students exist)

**Steps:**
1. Delete all students
2. Navigate to `/students`

**Expected Results:**
- [ ] Empty state message appears
- [ ] "Add the first student" link visible
- [ ] Clicking link navigates to `/add-new-student`

---

### TEST 8: Pagination
**Route:** `/students`

**Steps:**
1. Go to `/students`
2. Observe pagination controls
3. Click "Next" button

**Expected Results:**
- [ ] Previous button disabled on first page
- [ ] Next button disabled when fewer than 50 students
- [ ] Page indicator shows current page
- [ ] New data loads on page change

---

### TEST 9: Loading States
**Route:** `/edit-student/:id`

**Steps:**
1. Navigate to edit page
2. Observe loading

**Expected Results:**
- [ ] LoadingSpinner shown while fetching
- [ ] Spinner has message "Loading student..."
- [ ] Form appears after data loads
- [ ] Submit button shows loading state when saving

---

### TEST 10: Navigation
**Routes:** `/students` → `/add-new-student` → `/edit-student/:id`

**Steps:**
1. Test Back buttons
2. Test navigation links
3. Test browser back button

**Expected Results:**
- [ ] All navigation works smoothly
- [ ] No broken links
- [ ] Proper page transitions
- [ ] Browser history functional

---

## 📊 Test Results Template

```
TEST 1 - View Students List:        ✅ / ❌ / 🔄
TEST 2 - Add New Student:           ✅ / ❌ / 🔄
TEST 3 - Edit Student:              ✅ / ❌ / 🔄
TEST 4 - Delete Student:            ✅ / ❌ / 🔄
TEST 5 - Form Validation:           ✅ / ❌ / 🔄
TEST 6 - Error Handling:            ✅ / ❌ / 🔄
TEST 7 - Empty State:               ✅ / ❌ / 🔄
TEST 8 - Pagination:                ✅ / ❌ / 🔄
TEST 9 - Loading States:            ✅ / ❌ / 🔄
TEST 10 - Navigation:               ✅ / ❌ / 🔄

Overall Status:  ✅ All Pass / 🔄 Partial / ❌ Failures
```

---

## 🐛 Common Issues & Solutions

### Issue: No students displayed
**Solutions:**
1. Check backend is running: `curl http://localhost:5000/api/students`
2. Check console for errors
3. Check Network tab for failed requests
4. Verify database has students

### Issue: Form submission fails
**Solutions:**
1. Verify all required fields are filled
2. Check Network tab for API error
3. Verify backend is running
4. Check console for validation errors

### Issue: Page doesn't load
**Solutions:**
1. Check for JavaScript errors in console
2. Verify React Router route is correct
3. Check page component imports
4. Verify API service exists

### Issue: Slow loading
**Solutions:**
1. Check Network tab for slow API calls
2. Verify database performance
3. Check for N+1 query problems
4. Profile backend performance

---

## 🔍 Debugging Tools

### Browser DevTools
```javascript
// Check students state
console.log(students);

// Check API response
fetch('http://localhost:5000/api/students')
  .then(r => r.json())
  .then(d => console.log(d));

// Test API functions
import { studentsAPI } from './src/services/api';
await studentsAPI.getAll();
```

### Network Monitoring
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Check request/response headers
4. Verify status codes (200, 201, 400, 500)

### React DevTools
1. Install React DevTools extension
2. Inspect component props
3. Check component state
4. Trace re-renders

---

## ✅ Sign-off Checklist

After all tests pass:

- [ ] All 10 test cases passed
- [ ] No console errors
- [ ] No broken links
- [ ] Responsive on mobile
- [ ] Error messages are user-friendly
- [ ] Loading states are visible
- [ ] API calls are correct
- [ ] Navigation works
- [ ] Performance acceptable
- [ ] Documentation complete

---

## 📈 Performance Baselines

Target metrics:
- Page load: < 2 seconds
- Student list: < 500ms API response
- Form submit: < 1 second
- Navigation: < 300ms

---

## 🚀 Ready to Test!

All systems are go. Start with TEST 1 and proceed sequentially.

**Report any issues to the development team.**
