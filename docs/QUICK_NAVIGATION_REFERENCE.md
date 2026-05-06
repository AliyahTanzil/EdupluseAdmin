# EduPlus Admin - Quick Navigation Reference

**Last Updated:** March 21, 2026  
**Purpose:** Quick lookup for all pages, routes, and connections

---

## 🚀 Quick Links

| Section | Page | Route | Component | Purpose |
|---------|------|-------|-----------|---------|
| **PUBLIC** | Landing | / | Landing.jsx | Entry point |
| | Login | /login | Login.jsx | User authentication |
| | Register | /register | Register.jsx | New user registration |
| | School Selection | /school-selection | SchoolSelection.jsx | Select school |
| | Role Selection | /role-selection | RoleSelection.jsx | Select user role |
| **ADMIN** | Dashboard | /admin-dashboard | AdminDashboard.jsx | Main admin hub |
| | Students | /students | Students.jsx | List all students |
| | Add Student | /add-new-student | AddNewStudent.jsx | Create new student |
| | Edit Student | /edit-student/:id | EditStudent.jsx | Update student |
| | Teachers | /teachers | Teachers.jsx | List all teachers |
| | Add Teacher | /add-new-teacher | AddNewTeacher.jsx | Create new teacher |
| | Edit Teacher | /edit-teacher/:id | EditTeacher.jsx | Update teacher |
| | Subjects | /subjects | Subjects.jsx | List all subjects |
| | Add Subject | /add-new-subject | AddNewSubject.jsx | Create new subject |
| | Edit Subject | /edit-subject/:id | EditSubject.jsx | Update subject |
| | Courses | /courses | Courses.jsx | List all courses |
| | Add Course | /add-new-course | AddCourse.jsx | Create new course |
| | Edit Course | /edit-course/:id | EditCourse.jsx | Update course |
| | Timetable | /timetable | Timetable.jsx | View timetable |
| | Edit Timetable | /edit-timetable | EditTimetable.jsx | Update timetable |
| | Attendance | /attendance | Attendance.jsx | Attendance dashboard |
| | Mark Attendance | /mark-attendance | MarkAttendance.jsx | Mark attendance |
| | Reports | /generate-report | GenerateReport.jsx | Generate reports |
| | Export | /export-reports | ExportReports.jsx | Export reports |
| | Devices | /manage-devices | ManageDevices.jsx | Manage devices |
| | Settings | /settings | Settings.jsx | System settings |
| | Profile | /profile-settings | ProfileSettings.jsx | User profile |
| **TEACHER** | Dashboard | /teacher-dashboard | TeacherDashboard.jsx | Main teacher hub |
| | Class Dashboard | /class-teacher-dashboard | ClassTeacherDashboard.jsx | Class teacher hub |
| | Subject Dashboard | /subject-head-dashboard | SubjectHeadDashboard.jsx | Subject head hub |
| | Dept Dashboard | /departmental-head-dashboard | DepartmentalHeadDashboard.jsx | Dept head hub |
| | Class Attendance | /class-attendance | ClassAttendance.jsx | Class attendance |
| | Class Timetable | /class-timetable | ClassTimetable.jsx | Class timetable |
| | Class Subjects | /class-subjects | ClassSubjects.jsx | Class subjects |
| **STUDENT** | Dashboard | /student-dashboard | StudentDashboard.jsx | Main student hub |
| **PARENT** | Dashboard | /parent-dashboard | ParentDashboard.jsx | Main parent hub |
| **OTHER** | Logout | /logout | Logout.jsx | Logout page |
| | Unauthorized | /unauthorized | Unauthorized.jsx | Access denied |

---

## 🔄 Navigation Flows

### Authentication Flow
```
/ (Landing)
  ↓ [Get Started/Login]
/login (Login)
  ↓ [Submit - Valid]
/school-selection (School Selection)
  ↓ [Select School]
/role-selection (Role Selection)
  ↓ [Select Role]
/[role]-dashboard (Dashboard)
```

### Admin CRUD Pattern
```
/students (List)
  ├─ [+Add] → /add-new-student (Form) → [Save] → /students
  ├─ [Edit] → /edit-student/:id (Form) → [Save] → /students
  └─ [Delete] → /students
```

### Attendance Pattern
```
/admin-dashboard (Hub)
  ↓ [Attendance Card]
/attendance (Dashboard)
  ├─ [Mark Attendance] → /mark-attendance (Form) → [Submit] → /attendance
  ├─ [View Records] → /attendance
  └─ [Manage Devices] → /manage-devices
```

---

## 📋 Route Organization

### Public Routes (No Auth Required)
```
/                    ← Landing page
/login               ← User login
/register            ← User registration
/school-selection    ← Select school
/role-selection      ← Select role
/unauthorized        ← Access denied
/logout              ← Logout
```

### Protected Routes (Auth Required)

**Admin Only:**
```
/admin-dashboard
/students, /add-new-student, /edit-student/:id
/teachers, /add-new-teacher, /edit-teacher/:id
/subjects, /add-new-subject, /edit-subject/:id
/courses, /add-new-course, /edit-course/:id
/timetable, /edit-timetable
/attendance, /mark-attendance
/generate-report, /export-reports
/manage-devices
/settings, /profile-settings
```

**Teacher:**
```
/teacher-dashboard
/class-teacher-dashboard
/subject-head-dashboard
/departmental-head-dashboard
/class-attendance
/class-timetable
/class-subjects
/subjects (view)
/mark-attendance
```

**Student:**
```
/student-dashboard
```

**Parent:**
```
/parent-dashboard
```

**All Authenticated:**
```
/profile-settings
/logout
```

---

## 🎯 Role-Based Access Map

| Route | Admin | Teacher | Student | Parent |
|-------|-------|---------|---------|--------|
| /admin-dashboard | ✅ | ❌ | ❌ | ❌ |
| /students | ✅ | ❌ | ❌ | ❌ |
| /teachers | ✅ | ❌ | ❌ | ❌ |
| /teacher-dashboard | ❌ | ✅ | ❌ | ❌ |
| /student-dashboard | ❌ | ❌ | ✅ | ❌ |
| /parent-dashboard | ❌ | ❌ | ❌ | ✅ |
| /profile-settings | ✅ | ✅ | ✅ | ✅ |
| /logout | ✅ | ✅ | ✅ | ✅ |

---

## 📝 URL Naming Conventions

### Pattern: List/View
```
/resource
Examples: /students, /teachers, /subjects, /courses, /attendance
```

### Pattern: Create
```
/add-new-resource
Examples: /add-new-student, /add-new-teacher, /add-new-subject
```

### Pattern: Update
```
/edit-resource/:id
Examples: /edit-student/123, /edit-teacher/456
```

### Pattern: Actions
```
/resource-action
Examples: /mark-attendance, /export-reports, /manage-devices
```

### Pattern: Dashboards
```
/[role]-dashboard
Examples: /admin-dashboard, /teacher-dashboard, /student-dashboard
```

---

## 🔐 Authentication & Authorization

### ProtectedRoute Requirements
```javascript
// Admin only
<ProtectedRoute requiredRoles={['admin']}>

// Teacher only
<ProtectedRoute requiredRoles={['teacher']}>

// Teacher with type
<ProtectedRoute 
  requiredRoles={['teacher']} 
  requiredTeacherTypes={['class_teacher']}
>

// Student only
<ProtectedRoute requiredRoles={['student']}>

// Parent only
<ProtectedRoute requiredRoles={['parent']}>
```

---

## 🧭 Sidebar Navigation

### Admin Menu
```
Dashboard
├─ Students
├─ Teachers
├─ Subjects
├─ Timetable
├─ Attendance
├─ Reports
├─ Settings
└─ Profile Settings
```

### Teacher Menu
```
Dashboard
├─ My Subjects
├─ My Classes
├─ Mark Attendance
├─ Attendance Records
└─ Profile Settings
```

### Class Teacher Menu
```
Class Dashboard
├─ Class Attendance
├─ Class Timetable
├─ Class Subjects
├─ Students
└─ Profile Settings
```

### Student Menu
```
Dashboard
├─ My Marks
├─ Attendance
├─ My Timetable
└─ Profile Settings
```

### Parent Menu
```
Dashboard
├─ My Children
├─ Child Marks
├─ Child Attendance
├─ Messages
└─ Profile Settings
```

---

## 🔗 Common Navigation Patterns

### Add → List
```
Click [+Add] on list → Goes to /add-new-X page
Fill form → Click [Save]
Success message → Redirect to /X list
```

### Edit → List
```
Click [Edit] on list row → Goes to /edit-X/:id page
Form pre-populated → Modify → Click [Save]
Success message → Redirect to /X list
```

### Delete → List
```
Click [Delete] on list row → Confirm dialog
Item deleted → Stay on list
List refreshes
```

### Dashboard → Module
```
Click card/button on dashboard → Goes to module page
Perform action → Click back/done
Return to dashboard
```

---

## 🎨 Page Component Structure

### Standard List Page
```
Header [Search/Filter]
┌─────────────────────┐
│  [+Add New] Button  │
├─────────────────────┤
│   Table/Grid Data   │
│   [Edit] [Delete]   │
├─────────────────────┤
│  Pagination         │
└─────────────────────┘
```

### Standard Form Page
```
Page Title
┌─────────────────────┐
│   Form Fields       │
├─────────────────────┤
│ [Save] [Cancel]     │
└─────────────────────┘
```

### Standard Dashboard
```
Header with Stats Cards
┌────────┬────────┬────────┐
│ Stat 1 │ Stat 2 │ Stat 3 │
└────────┴────────┴────────┘

Menu Items Grid
┌──────┬──────┬──────┐
│ Item │ Item │ Item │
├──────┼──────┼──────┤
│ Item │ Item │ Item │
└──────┴──────┴──────┘
```

---

## 🔄 Data Flow

### Create Flow
```
Form Page → [Save] → Validate
  ✓ Valid → API POST → Success → Redirect to List
  ✗ Invalid → Show Errors → Stay on Form
```

### Update Flow
```
List Page → [Edit] → Form Page (Pre-populated)
  ↓ [Save] → Validate
  ✓ Valid → API PUT → Success → Redirect to List
  ✗ Invalid → Show Errors → Stay on Form
```

### Delete Flow
```
List Page → [Delete] → Confirm Dialog
  ✓ Confirmed → API DELETE → Item Removed → Stay on List
  ✗ Cancelled → No Action → Stay on List
```

### Report Flow
```
Generate Report Page → [Generate] → Select Filters
  ↓ [Generate] → API Request → Show Report
  ↓ [Export] → Download File
```

---

## 📞 Troubleshooting Quick Fixes

| Issue | Check | Solution |
|-------|-------|----------|
| Page blank | Console errors? | Check route in App.jsx, verify component exists |
| Menu button doesn't work | Route exists? | Check Sidebar.jsx path matches App.jsx |
| Form doesn't submit | Console errors? | Check form validation, check API endpoint |
| Redirect loop | Redirect path? | Verify destination route exists, check auth |
| Access denied | User role? | Check ProtectedRoute requirements, verify user role |
| 404 on valid URL | URL spelling? | Check exact path in App.jsx, verify exports |

---

## 🚀 Common Tasks

### Add New Admin Feature
1. Create page component in `/pages`
2. Add route to `/admin-dashboard` section in App.jsx
3. Add menu item to admin sidebar in Sidebar.jsx
4. Test access control with ProtectedRoute

### Add New Teacher Feature
1. Create page component in `/pages`
2. Add route to `/teacher-dashboard` section in App.jsx
3. Add menu item to teacher sidebar in Sidebar.jsx
4. Test with teacher role

### Fix Navigation
1. Check route in App.jsx
2. Check menu path in Sidebar.jsx
3. Check form redirect path
4. Test in browser

### Test New Route
```bash
1. npm run dev
2. Open http://localhost:5173/new-route
3. Check console for errors
4. Verify page loads correctly
```

---

## 📚 Related Documents

- `APPLICATION_ARCHITECTURE_REORGANIZATION.md` - Detailed architecture guide
- `PAGE_CONNECTIONS_VISUAL_MAP.md` - Visual flow diagrams
- `REORGANIZATION_IMPLEMENTATION_CHECKLIST.md` - Step-by-step implementation
- `DEVELOPER_NAVIGATION_GUIDE.md` - Developer reference
- `DEVELOPER_API_REFERENCE.md` - API documentation

---

**Document Status:** Quick Reference Ready  
**Last Updated:** March 21, 2026  
**Print-Friendly:** Yes
