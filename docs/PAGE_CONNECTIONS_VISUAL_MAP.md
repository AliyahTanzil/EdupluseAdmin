# EduPlus Admin - Visual Navigation & Page Connection Map

## 📊 Complete User Journey Map

### 1. AUTHENTICATION FLOW (Public Access)
```
┌─────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION PHASE                            │
└─────────────────────────────────────────────────────────────────────┘

   START
    │
    ▼
┌──────────────┐
│   Landing    │  ← Shows features & login option
│   Page       │     "Get Started" or "Login"
└──────┬───────┘
       │ Click Login/Get Started
       ▼
┌──────────────┐
│   Login      │  ← Email & password
│   Page       │     "Submit" validates credentials
└──────┬───────┘
       │ Invalid → ❌ Show error, stay on login
       │ Valid → ✅ Proceed
       ▼
┌──────────────────────┐
│ SchoolSelection      │  ← Dropdown of available schools
│ Page                 │     Select school → Continue
└──────┬───────────────┘
       │ Select school
       ▼
┌──────────────────────┐
│ RoleSelection        │  ← Based on selected school
│ Page                 │     Choose: Admin/Teacher/Student/Parent
└──────┬───────────────┘
       │ Select role
       ▼
┌──────────────────────┐
│ Dashboard            │  ← Role-specific hub
│ (Admin/Teacher/...)  │     Main navigation point
└──────────────────────┘
```

---

## 2. ADMIN DASHBOARD COMPLETE FLOW

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD - Main Hub                          │
│  ┌─────────┬──────────┬──────────┬─────────┬──────────┬────────┬──────┐  │
│  │Students │ Teachers │ Subjects │ Courses │ Timetable│Attendance│...│  │
│  └────┬────┴────┬─────┴────┬─────┴────┬────┴────┬─────┴────┬────┴──┬─┘  │
└───────┼─────────┼──────────┼──────────┼─────────┼─────────┼────────┼────┘
        │         │          │          │         │         │        │
        ▼         ▼          ▼          ▼         ▼         ▼        ▼
    ┌────────┐ ┌────────┐ ┌───────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌───────┐
    │Students│ │Teachers│ │Subject│ │Course│ │Timetbl│ │Attend│ │Report │
    │ List   │ │ List   │ │ List  │ │ List │ │ List  │ │ Dash │ │Generate
    └────┬───┘ └────┬───┘ └───┬───┘ └──┬───┘ └────┬──┘ └──┬───┘ └───┬───┘
         │          │         │        │         │       │         │
    ┌────┴────┐     │         │        │         │       │         │
    │ [Add]   │     │         │        │         │       │         │
    └────┬────┘     │         │        │         │       │         │
         │          │         │        │         │       │         │
         ▼          ▼         ▼        ▼         ▼       ▼         ▼
    ┌─────────┐ ┌────────┐ ┌──────┐ ┌─────┐ ┌───────┐ ┌──────┐ ┌────────┐
    │Add New  │ │Edit    │ │Delete│ │...  │ │Edit   │ │Mark  │ │Export  │
    │Student  │ │Teacher │ │      │ │     │ │Timtbl │ │Attend│ │Report  │
    └─────┬───┘ └────────┘ └──────┘ └─────┘ └───────┘ └───┬──┘ └────────┘
          │                                              │
          │ [Save]                                       │ [Submit]
          ▼                                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │  Success! Redirects back to List or Dashboard           │
    └──────────────────────────────────────────────────────────┘
```

---

## 3. ATTENDANCE WORKFLOW (Complete Journey)

```
┌────────────────────────────────────────────────────────────────────────┐
│                     ATTENDANCE COMPLETE FLOW                           │
└────────────────────────────────────────────────────────────────────────┘

ADMIN VIEW:
    AdminDashboard
        │
        ├─→ [Attendance Card]
        │       │
        │       ▼
        │   ┌───────────────────┐
        │   │ Attendance Dash   │  ← Overview & Quick Actions
        │   │ - Device Status   │
        │   │ - Today's Summary │
        │   │ - Quick Actions   │
        │   └────────┬──────────┘
        │            │
        │            ├─→ [Mark Attendance] → MarkAttendance Page
        │            │       │
        │            │       ▼
        │            │   ┌──────────────────────┐
        │            │   │ Mark Attendance Page │
        │            │   │ - Select Class       │
        │            │   │ - Select Date        │
        │            │   │ - Mark Students      │
        │            │   │ - Submit Button      │
        │            │   └────────┬─────────────┘
        │            │            │
        │            │            ▼
        │            │   ┌──────────────────────┐
        │            │   │ Success Message      │
        │            │   │ Redirect to Dash     │
        │            │   └──────────────────────┘
        │            │
        │            ├─→ [View Records]
        │            │       │
        │            │       ▼
        │            │   ┌──────────────────────┐
        │            │   │ Attendance Report    │
        │            │   │ - Filter by Date     │
        │            │   │ - Show Statistics    │
        │            │   │ - Export Option      │
        │            │   └──────────────────────┘
        │            │
        │            └─→ [Manage Devices]
        │                    │
        │                    ▼
        │            ┌──────────────────────┐
        │            │ Device Management    │
        │            │ - Online/Offline     │
        │            │ - Sync Status        │
        │            │ - Update Settings    │
        │            └──────────────────────┘

TEACHER VIEW:
    TeacherDashboard
        │
        ├─→ [Mark Attendance Card]
        │       │
        │       ▼
        │   ┌──────────────────────┐
        │   │ Mark Attendance Page │
        │   │ (For my classes)     │
        │   └────────┬─────────────┘
        │            │
        │            ▼
        │   ┌──────────────────────┐
        │   │ Success & Redirect   │
        │   └──────────────────────┘
        │
        └─→ [View Records]
                │
                ▼
            ┌──────────────────────┐
            │ My Class Attendance  │
            │ - Attendance View    │
            │ - Filter Options     │
            └──────────────────────┘
```

---

## 4. STUDENT MANAGEMENT WORKFLOW

```
┌──────────────────────────────────────────────────────────────────────┐
│         STUDENT MANAGEMENT - COMPLETE CRUD WORKFLOW                 │
└──────────────────────────────────────────────────────────────────────┘

AdminDashboard
    │
    ▼
┌─────────────────┐
│ Students Card   │
│ Click → List    │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Students List Page       │ ← Display all students in table
│ - Student Table          │
│ - Search/Filter          │
│ - Pagination             │
│ - [+Add New] Button      │
└───┬────────────┬──────┬──┘
    │            │      │
    │ [+Add]     │      │ [Delete]
    │            │      └────┐
    │            │           │
    │            ▼           ▼
    │      ┌──────────────────┐
    │      │ Add New Student  │  ← Form to create
    │      │ - Name           │
    │      │ - Email          │
    │      │ - Class          │
    │      │ - [Save] Button  │
    │      └────────┬─────────┘
    │              │
    │              ├─→ Validation:
    │              │   ├─ Invalid → Show errors, stay on form
    │              │   └─ Valid → Proceed
    │              │
    │              ▼
    │      ┌──────────────────┐
    │      │ Success!         │
    │      │ Redirect to List │
    │      └──────────────────┘
    │
    └──→ [Edit]
            │
            ▼
        ┌──────────────────────┐
        │ Edit Student Page    │  ← Pre-populated form
        │ - Update fields      │
        │ - [Save] Button      │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Success!         │
        │ Redirect to List │
        └──────────────────┘
                 │
                 └──────→ [Back to List]
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Students List (View) │
                 └──────────────────────┘
```

---

## 5. COMPLETE PAGE HIERARCHY

```
ROOT LEVEL (/)
│
├─ Authentication Routes (Public)
│  ├─ "/" → Landing Page
│  ├─ "/login" → Login
│  ├─ "/register" → Register
│  ├─ "/school-selection" → Select School
│  ├─ "/role-selection" → Select Role
│  ├─ "/unauthorized" → Unauthorized Access
│  └─ "/logout" → Logout Confirmation
│
├─ Admin Module (/admin-*)
│  ├─ "/admin-dashboard" → Main Hub
│  │
│  └─ Layout-based Routes (with Sidebar):
│     ├─ Students Section
│     │  ├─ "/students" → List
│     │  ├─ "/add-new-student" → Create
│     │  └─ "/edit-student/:id" → Update
│     │
│     ├─ Teachers Section
│     │  ├─ "/teachers" → List
│     │  ├─ "/add-new-teacher" → Create
│     │  └─ "/edit-teacher/:id" → Update
│     │
│     ├─ Subjects Section
│     │  ├─ "/subjects" → List
│     │  ├─ "/add-new-subject" → Create
│     │  └─ "/edit-subject/:id" → Update
│     │
│     ├─ Courses Section
│     │  ├─ "/courses" → List
│     │  ├─ "/add-new-course" → Create
│     │  └─ "/edit-course/:id" → Update
│     │
│     ├─ Timetable Section
│     │  ├─ "/timetable" → List
│     │  └─ "/edit-timetable" → Update
│     │
│     ├─ Attendance Section
│     │  ├─ "/attendance" → Dashboard
│     │  └─ "/mark-attendance" → Mark Attendance
│     │
│     ├─ Reports Section
│     │  ├─ "/generate-report" → Generate
│     │  └─ "/export-reports" → Export
│     │
│     ├─ Devices Section
│     │  └─ "/manage-devices" → Manage
│     │
│     └─ Settings Section
│        ├─ "/settings" → System Settings
│        └─ "/profile-settings" → Profile
│
├─ Teacher Module (/teacher-*)
│  ├─ "/teacher-dashboard" → Main Hub (Regular)
│  ├─ "/class-teacher-dashboard" → Class Teacher Hub
│  ├─ "/subject-head-dashboard" → Subject Head Hub
│  ├─ "/departmental-head-dashboard" → Dept Head Hub
│  │
│  └─ Layout-based Routes:
│     ├─ "/class-attendance" → Attendance
│     ├─ "/class-timetable" → Timetable
│     └─ "/class-subjects" → Subjects
│
├─ Student Module (/student-*)
│  └─ "/student-dashboard" → Main Hub
│
├─ Parent Module (/parent-*)
│  └─ "/parent-dashboard" → Main Hub
│
└─ Error Handling
   └─ "*" → Redirect to "/"
```

---

## 6. NAVIGATION BREADCRUMB TRAILS

```
ADMIN ROUTES:
├─ Dashboard → Admin Dashboard
├─ Students → Dashboard → Students List
├─ Add New Student → Dashboard → Students List → Add New Student
├─ Edit Student → Dashboard → Students List → Edit Student
├─ Teachers → Dashboard → Teachers List
├─ Add New Teacher → Dashboard → Teachers List → Add New Teacher
├─ Edit Teacher → Dashboard → Teachers List → Edit Teacher
├─ Subjects → Dashboard → Subjects List
├─ Add New Subject → Dashboard → Subjects List → Add New Subject
├─ Edit Subject → Dashboard → Subjects List → Edit Subject
├─ Courses → Dashboard → Courses List
├─ Add New Course → Dashboard → Courses List → Add New Course
├─ Edit Course → Dashboard → Courses List → Edit Course
├─ Timetable → Dashboard → Timetable List
├─ Edit Timetable → Dashboard → Timetable List → Edit Timetable
├─ Attendance → Dashboard → Attendance Dashboard
├─ Mark Attendance → Dashboard → Attendance → Mark Attendance
├─ Reports → Dashboard → Reports
├─ Generate Report → Dashboard → Reports → Generate Report
├─ Export Reports → Dashboard → Reports → Export Reports
├─ Devices → Dashboard → Device Management
└─ Settings → Dashboard → Settings

TEACHER ROUTES:
├─ Dashboard → Teacher Dashboard
├─ Mark Attendance → Teacher Dashboard → Mark Attendance
├─ Attendance Records → Teacher Dashboard → Attendance Records
├─ Class Timetable → Teacher Dashboard → Class Timetable
├─ Class Subjects → Teacher Dashboard → Class Subjects
└─ Profile → Teacher Dashboard → Profile Settings

STUDENT ROUTES:
├─ Dashboard → Student Dashboard
├─ My Marks → Student Dashboard → My Marks
├─ Attendance → Student Dashboard → Attendance
├─ My Timetable → Student Dashboard → My Timetable
└─ Profile → Student Dashboard → Profile Settings

PARENT ROUTES:
├─ Dashboard → Parent Dashboard
├─ My Children → Parent Dashboard → My Children
├─ Child Marks → Parent Dashboard → Child Marks
├─ Child Attendance → Parent Dashboard → Child Attendance
├─ Messages → Parent Dashboard → Messages
└─ Profile → Parent Dashboard → Profile Settings
```

---

## 7. ROUTE PARAMETERS & DYNAMIC PAGES

```
Dynamic Routes with URL Parameters:

Admin:
├─ /edit-student/:id
│  ├─ GET /api/students/:id (Fetch student data)
│  └─ PUT /api/students/:id (Update student)
│
├─ /edit-teacher/:id
│  ├─ GET /api/teachers/:id (Fetch teacher data)
│  └─ PUT /api/teachers/:id (Update teacher)
│
├─ /edit-subject/:id
│  ├─ GET /api/subjects/:id (Fetch subject data)
│  └─ PUT /api/subjects/:id (Update subject)
│
├─ /edit-course/:id
│  ├─ GET /api/courses/:id (Fetch course data)
│  └─ PUT /api/courses/:id (Update course)

Example URL Pattern:
- /edit-student/12345
- /edit-teacher/abc-xyz-789
- /edit-subject/math-101
- /edit-course/comp-201
```

---

## 8. PAGE CONNECTION DEPENDENCY MAP

```
Landing Page
└─ Connect to: Login Page

Login Page
├─ Invalid credentials → Stay on Login
├─ Valid credentials → SchoolSelection
└─ Forgot Password → Password Reset (Future)

SchoolSelection
├─ No school available → Show message
├─ School selected → RoleSelection
└─ Back → Landing

RoleSelection
├─ Role selected → Appropriate Dashboard
└─ Back → SchoolSelection

Dashboard (Role-Specific)
├─ Admin → AdminDashboard
│  └─ All management pages via Sidebar
├─ Teacher → TeacherDashboard
│  └─ Teacher-specific pages via Sidebar
├─ Student → StudentDashboard
│  └─ Limited pages
└─ Parent → ParentDashboard
   └─ Limited pages

Management List Pages (Students, Teachers, etc.)
├─ [+Add] → Add New Page
├─ [Edit] → Edit Page
├─ [Delete] → Delete & Stay on List
└─ [Back] → Dashboard

Add/Edit Pages
├─ [Save] → Validation
│  ├─ Invalid → Show errors, stay on form
│  └─ Valid → Save & Redirect to List
├─ [Cancel] → Back to List
└─ [Back] → List

All Pages
└─ [Logout] → Logout → Login
```

---

## 9. ROLE-BASED ACCESS CONTROL MAP

```
PUBLIC ACCESS (No Auth Required):
├─ /                    → Landing
├─ /login               → Login
├─ /register            → Register
└─ /unauthorized        → Error

ADMIN ONLY:
├─ /admin-dashboard
├─ /students & CRUD
├─ /teachers & CRUD
├─ /subjects & CRUD
├─ /courses & CRUD
├─ /timetable & CRUD
├─ /attendance (full)
├─ /mark-attendance
├─ /generate-report
├─ /export-reports
├─ /manage-devices
├─ /settings
└─ /profile-settings

TEACHER (All):
├─ /teacher-dashboard
├─ /subjects (view only)
├─ /attendance (mark/view)
├─ /mark-attendance
├─ /class-attendance
├─ /class-timetable
├─ /class-subjects
└─ /profile-settings

TEACHER - CLASS TEACHER (Special):
└─ /class-teacher-dashboard (additional)

TEACHER - SUBJECT HEAD (Special):
└─ /subject-head-dashboard (additional)

TEACHER - DEPT HEAD (Special):
└─ /departmental-head-dashboard (additional)

STUDENT:
├─ /student-dashboard
├─ /student-marks
├─ /student-attendance
├─ /student-timetable
└─ /profile-settings

PARENT:
├─ /parent-dashboard
├─ /parent-children
├─ /parent-grades
├─ /parent-attendance
├─ /parent-messages
└─ /profile-settings

ALL AUTHENTICATED:
├─ /logout
├─ /school-selection (on demand)
├─ /role-selection (on demand)
└─ /profile-settings
```

---

## 10. QUICK REFERENCE: PAGE STATUS & LINKS

| Page | Route | Component | Status | Links To | Receives From |
|------|-------|-----------|--------|----------|---------------|
| Landing | / | Landing.jsx | ✅ Ready | /login | - |
| Login | /login | Login.jsx | ✅ Ready | /school-selection | / |
| School Selection | /school-selection | SchoolSelection.jsx | ✅ Ready | /role-selection | /login |
| Role Selection | /role-selection | RoleSelection.jsx | ✅ Ready | /[role]-dashboard | /school-selection |
| Admin Dashboard | /admin-dashboard | AdminDashboard.jsx | ✅ Ready | /students, /teachers, etc | /role-selection |
| Students List | /students | Students.jsx | ✅ Ready | /add-new-student, /edit-student/:id | /admin-dashboard |
| Add Student | /add-new-student | AddNewStudent.jsx | ✅ Ready | /students | /students |
| Edit Student | /edit-student/:id | EditStudent.jsx | ✅ Ready | /students | /students |
| Teachers List | /teachers | Teachers.jsx | ✅ Ready | /add-new-teacher, /edit-teacher/:id | /admin-dashboard |
| Add Teacher | /add-new-teacher | AddNewTeacher.jsx | ✅ Ready | /teachers | /teachers |
| Edit Teacher | /edit-teacher/:id | EditTeacher.jsx | ✅ Ready | /teachers | /teachers |
| Subjects List | /subjects | Subjects.jsx | ✅ Ready | /add-new-subject, /edit-subject/:id | /admin-dashboard |
| Add Subject | /add-new-subject | AddNewSubject.jsx | ✅ Ready | /subjects | /subjects |
| Edit Subject | /edit-subject/:id | EditSubject.jsx | ✅ Ready | /subjects | /subjects |
| Attendance | /attendance | Attendance.jsx | ✅ Ready | /mark-attendance | /admin-dashboard |
| Mark Attendance | /mark-attendance | MarkAttendance.jsx | ✅ Ready | /attendance | /attendance |
| Reports | /generate-report | GenerateReport.jsx | ✅ Ready | /export-reports | /admin-dashboard |
| Export Reports | /export-reports | ExportReports.jsx | ✅ Ready | /generate-report | /generate-report |
| Teacher Dashboard | /teacher-dashboard | TeacherDashboard.jsx | ✅ Ready | /mark-attendance, /attendance | /role-selection |
| Student Dashboard | /student-dashboard | StudentDashboard.jsx | ✅ Ready | - | /role-selection |
| Parent Dashboard | /parent-dashboard | ParentDashboard.jsx | ✅ Ready | - | /role-selection |
| Profile Settings | /profile-settings | ProfileSettings.jsx | ✅ Ready | /[role]-dashboard | Any dashboard |
| Logout | /logout | Logout.jsx | ✅ Ready | /login | Any page |

---

## Key Takeaways

### Standard Patterns:
1. **List Pages**: Display data, provide CRUD buttons
2. **Add Pages**: Form to create new record, redirect to list on success
3. **Edit Pages**: Pre-filled form, update record, redirect to list on success
4. **Action Pages**: Perform operations (mark, export, generate)
5. **Dashboard Pages**: Hub for role-specific navigation

### Navigation Rules:
1. All forms redirect to list/dashboard on success
2. All pages have back button or breadcrumb
3. Logout always available in navbar
4. Role-based sidebar shows only accessible pages
5. Protected routes verify authentication & authorization

### URL Consistency:
- `/resource` → List view
- `/add-new-resource` → Create new
- `/edit-resource/:id` → Update existing
- `/[action]` → Special actions
- `/[role]-dashboard` → Role home

---

**Created:** March 21, 2026  
**Last Updated:** March 21, 2026  
**Status:** Complete Architecture Map Ready for Implementation
