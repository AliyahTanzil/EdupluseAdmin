# Teacher RBAC System - Architecture & Implementation Details

**Version**: 1.0.0  
**Date**: March 18, 2026  
**Status**: Complete and Tested

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React/Vite)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           App.jsx - Main Router                      │  │
│  │  ├─ Public Routes (Login, Register, Landing)        │  │
│  │  ├─ Protected Routes (Admin, Teachers, Students)    │  │
│  │  └─ Role-Specific Dashboards                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     ProtectedRoute Component (Role Checking)        │  │
│  │  ├─ Check requiredRoles                             │  │
│  │  ├─ Check requiredTeacherTypes                      │  │
│  │  ├─ Redirect to /unauthorized if no access         │  │
│  │  └─ Render component if authorized                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Role-Specific Dashboards                    │  │
│  │  ├─ AdminDashboard                                  │  │
│  │  ├─ TeacherDashboard (Regular)                      │  │
│  │  ├─ ClassTeacherDashboard                           │  │
│  │  ├─ SubjectHeadDashboard                            │  │
│  │  ├─ DepartmentalHeadDashboard                       │  │
│  │  ├─ StudentDashboard                                │  │
│  │  └─ ParentDashboard                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Dynamic Sidebar (Role-Specific Menu)           │  │
│  │  ├─ getMenuItems() function                         │  │
│  │  ├─ Returns items based on role + teacherType      │  │
│  │  ├─ Filters navigation options                      │  │
│  │  └─ Displays only accessible pages                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
            ↓ (API Calls with JWT Token)
┌─────────────────────────────────────────────────────────────┐
│                Backend (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Authentication (routes/auth.js)               │  │
│  │  ├─ Login endpoint                                  │  │
│  │  ├─ Register endpoint                               │  │
│  │  ├─ JWT token generation                            │  │
│  │  └─ User role & teacherType included in token      │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    RBAC Middleware (middleware/rbac.js)             │  │
│  │  ├─ authenticateToken() - Verify JWT               │  │
│  │  ├─ requirePermission() - Check permissions         │  │
│  │  ├─ requireTeacherType() - Validate teacher type   │  │
│  │  ├─ hasPermission() - Permission logic              │  │
│  │  ├─ filterDataByRole() - Data filtering             │  │
│  │  └─ getAllowedPages() - Get accessible pages       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Permissions Config (config/permissions.js)         │  │
│  │  ├─ ROLE_PERMISSIONS object                         │  │
│  │  │   ├─ admin                                       │  │
│  │  │   ├─ teacher (regular)                           │  │
│  │  │   ├─ teacher (class_teacher)                     │  │
│  │  │   ├─ teacher (subject_head)                      │  │
│  │  │   ├─ teacher (departmental_head)                 │  │
│  │  │   ├─ student                                     │  │
│  │  │   └─ parent                                      │  │
│  │  ├─ API_PERMISSIONS matrix                          │  │
│  │  └─ DATA_ACCESS_LEVELS                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Protected API Routes (routes/*.js)             │  │
│  │  ├─ /api/students                                   │  │
│  │  ├─ /api/teachers                                   │  │
│  │  ├─ /api/attendance                                 │  │
│  │  ├─ /api/marks                                      │  │
│  │  └─ [All routes apply RBAC]                         │  │
│  │     ├─ Verify token                                 │  │
│  │     ├─ Check permissions                            │  │
│  │     ├─ Filter data by role                          │  │
│  │     └─ Return filtered results                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Database (Mock/Real)                        │  │
│  │  ├─ Users collection with role/teacherType         │  │
│  │  ├─ Students collection                             │  │
│  │  ├─ Classes collection                              │  │
│  │  ├─ Subjects collection                             │  │
│  │  ├─ Attendance records                              │  │
│  │  └─ Marks records                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication & Authorization Flow

### 1. Login Flow
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend verifies email/password
    ↓
Backend creates JWT token containing:
  - user id
  - user email
  - user role
  - user teacherType
    ↓
Returns token + user data to frontend
    ↓
Frontend stores in localStorage:
  - authToken
  - user (including teacherType)
    ↓
User redirected to role-specific dashboard
```

### 2. Route Protection Flow
```
User navigates to protected route
    ↓
React Router checks ProtectedRoute component
    ↓
ProtectedRoute checks:
  1. Is user logged in?
  2. Does user have required role?
  3. Does user have required teacherType?
    ↓
If any check fails → Redirect to /unauthorized
If all checks pass → Render component
```

### 3. API Request Flow
```
Frontend makes API request with JWT token
    ↓
POST /api/students
Headers: { Authorization: "Bearer {token}" }
    ↓
Backend middleware: authenticateToken()
  - Extracts token from header
  - Verifies JWT signature
  - Extracts user role & teacherType
    ↓
Backend middleware: requirePermission('view_students')
  - Checks if role has permission
  - Returns 403 if denied
    ↓
Backend filters data: filterDataByRole(user, data, 'students')
  - If regular teacher: filters to own class only
  - If class teacher: filters to own class only
  - If subject head: filters by subject
  - If department head: filters by department
  - If admin: no filtering
    ↓
Returns filtered data to frontend
```

---

## 👥 Role Hierarchy & Inheritance

```
┌─────────────────────────────────────────┐
│          User Roles Hierarchy            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │          ADMIN (5)                 │  │
│  │  • Full system access              │  │
│  │  • Manages all data                │  │
│  │  • Can access all dashboards       │  │
│  └───────────────────────────────────┘  │
│              ↑                            │
│   ┌─────────┼──────────┐                │
│   ↓         ↓          ↓                │
│  ┌──┐     ┌──┐       ┌──┐             │
│  │TS│     │SH│       │DH│             │
│  │ET│     │ET│       │ET│             │
│  └──┘     └──┘       └──┘             │
│   │  ↓    │  ↓       │  ↓              │
│   │       │          │                 │
│   └───────┴──────────┘                │
│           ↓                            │
│  ┌────────────────────┐               │
│  │  REGULAR TEACHER   │               │
│  │  • Subject level   │               │
│  │  • Class access    │               │
│  └────────────────────┘               │
│                                         │
│ Legend:                                 │
│ TSET = Teacher / Subject / Emp / Team  │
│ DH = Department Head (4)               │
│ SH = Subject Head (3)                  │
│ CT = Class Teacher (2)                 │
│ RT = Regular Teacher (1)               │
│                                         │
└─────────────────────────────────────────┘
```

### Permission Levels
```
Level 5: Admin              → Full Access (All)
Level 4: Department Head    → Department-Wide Access
Level 3: Subject Head       → Subject-Wide Access  
Level 2: Class Teacher      → Class-Wide Access
Level 1: Regular Teacher    → Subject+Class Limited
Level 0: Student/Parent     → Own Data Only
```

---

## 📊 Data Access Matrix

### What Each Role Can See

```
                       Regular  Class   Subject  Dept    Admin
                       Teacher  Teacher Head     Head    
─────────────────────────────────────────────────────────────────
Own Profile               ✓       ✓       ✓       ✓       ✓
Class Students            ✓       ✓       ✗       ✗       ✓
Class Attendance          ✓       ✓       ✗       ✗       ✓
Subject Curriculum        ✗       ✗       ✓       ✓       ✓
Subject Teachers          ✗       ✗       ✓       ✓       ✓
Department Budget         ✗       ✗       ✗       ✓       ✓
All Teachers              ✗       ✗       ✗       ✗       ✓
All Students              ✗       ✗       ✗       ✗       ✓
System Settings           ✗       ✗       ✗       ✗       ✓
```

---

## 🔐 Permission Types

### 1. Page-Level Permissions
```javascript
// Only these pages accessible for role
requiredRoles={['teacher']}
requiredTeacherTypes={['class_teacher']}

// Redirects to /unauthorized if not allowed
```

### 2. Data-Level Permissions
```javascript
// Data filtered on backend based on role
filterDataByRole(user, data, resourceType)

// Examples:
- Regular Teacher → sees only assigned class students
- Class Teacher → sees all class students
- Subject Head → sees students taking their subject
- Department Head → sees all department students
```

### 3. Feature-Level Permissions
```javascript
// Buttons/features shown only if allowed
{hasFeature('canVerifyMarks') && <VerifyButton />}

// Examples:
- Mark Attendance button only for teachers
- Verify Marks only for subject heads
- Budget management only for department heads
```

### 4. API-Level Permissions
```javascript
// Backend enforces access on every request
POST /api/attendance/mark
  ↓
requirePermission('mark_attendance')
  ↓
Allows: teacher, class_teacher
Denies: student, parent, subject_head
```

---

## 📝 User Data Structure

### In Database
```javascript
{
  id: '2a',
  email: 'classteacher@school.com',
  password: 'hashed_password',
  name: 'Sarah ClassTeacher',
  role: 'teacher',
  
  // Teacher-specific fields
  teacherType: 'class_teacher',
  
  // Class Teacher specific
  class: '10A',
  classHead: true,
  students: ['3', '5', '6', '7'],
  
  // General
  subjects: ['English', 'Social Studies'],
  phone: '+1-800-111-2222',
  department: 'Languages',
  joinDate: '2024-01-15'
}
```

### In JWT Token
```javascript
{
  id: '2a',
  email: 'classteacher@school.com',
  role: 'teacher',
  teacherType: 'class_teacher',
  iat: 1710767445,
  exp: 1711372245
}
```

### In Frontend localStorage
```javascript
{
  user: {
    id: '2a',
    email: 'classteacher@school.com',
    name: 'Sarah ClassTeacher',
    role: 'teacher',
    teacherType: 'class_teacher',
    class: '10A',
    subjects: ['English', 'Social Studies'],
    department: 'Languages'
  },
  authToken: 'eyJhbGciOiJIUzI1NiIsInR...'
}
```

---

## 🎯 Permission Configuration Structure

```javascript
// From config/permissions.js

ROLE_PERMISSIONS = {
  admin: {
    name: 'Administrator',
    canAccess: { routes: ['all'], data: ['all'] },
    pages: { dashboard: '/admin-dashboard', allowedPages: [...] },
    features: { 
      canCreateUsers: true,
      canDeleteUsers: true,
      // ... all features enabled
    }
  },
  
  teacher: {
    regular: {
      name: 'Regular Teacher',
      canAccess: { 
        routes: ['mark_attendance', 'view_class_data'],
        data: { students: 'only own class' }
      },
      pages: { 
        dashboard: '/teacher-dashboard',
        allowedPages: ['mark-attendance', 'subjects', ...]
      },
      features: {
        canMarkAttendance: true,
        canEnterMarks: true,
        canViewStudentProgress: true,
        canViewClassPerformance: false
      }
    },
    
    class_teacher: {
      name: 'Class Teacher',
      canAccess: { 
        routes: ['view_class', 'mark_attendance', ...]
      },
      pages: {
        dashboard: '/teacher-dashboard',
        allowedPages: ['class-attendance', 'class-timetable', ...]
      },
      features: {
        canMarkAttendance: true,
        canViewClassPerformance: true,
        canCoordinateWithTeachers: true,
        // ... class-specific features
      }
    },
    
    // subject_head and departmental_head similarly defined
  }
}
```

---

## 🔄 Component Communication

### AuthContext
```javascript
// Provides user data and auth functions to entire app
{
  user: { id, email, role, teacherType, ... },
  loading: boolean,
  isAuthenticated: boolean,
  error: string,
  login: (email, password) => Promise,
  logout: () => void
}
```

### usePermission Hook
```javascript
const {
  user,
  hasRole: (role) => boolean,
  hasTeacherType: (type) => boolean,
  hasAnyRole: (roles) => boolean,
  hasAnyTeacherType: (types) => boolean,
  canAccess: (roles, teacherTypes) => boolean
} = usePermission()
```

### ProtectedRoute Component
```javascript
<ProtectedRoute 
  requiredRoles={['teacher', 'admin']}
  requiredTeacherTypes={['class_teacher', 'subject_head']}
  requireAdmin={false}
>
  <Component />
</ProtectedRoute>
```

---

## 🧪 Testing Flow

```
1. Login Tests
   → Test each role can login
   → Verify JWT token created
   → Check user data in localStorage

2. Route Protection Tests
   → Try accessing protected routes
   → Verify authorization checks
   → Test unauthorized redirect

3. Data Filtering Tests
   → Query data as each role
   → Verify data filtered correctly
   → Check role-specific filters applied

4. Navigation Tests
   → Check sidebar shows role-specific items
   → Verify navigation links work
   → Test menu items match permissions

5. Feature Tests
   → Test buttons visible only for roles
   → Verify role-specific features work
   → Check disabled features for other roles
```

---

## 📈 Scalability Considerations

### Adding New Teacher Type
```javascript
// 1. Add to auth.js users
{
  teacherType: 'new_type',
  // ...
}

// 2. Add to permissions.js
ROLE_PERMISSIONS.teacher.new_type = {
  name: 'New Type',
  canAccess: { ... },
  pages: { ... },
  features: { ... }
}

// 3. Create new Dashboard component
// DashboardName.jsx

// 4. Add routes in App.jsx
<Route path="/new-type-dashboard" ... />

// 5. Update Sidebar.jsx
// Add menu items to getMenuItems() function
```

### Adding New Permission
```javascript
// 1. Add to permissions.js features
features: {
  canNewFeature: true // or false by role
}

// 2. Add permission check in middleware
requirePermission('new_feature')

// 3. Add conditional rendering in components
{hasFeature('canNewFeature') && <FeatureComponent />}
```

---

## 🚀 Performance Optimization

### Current Optimizations
- JWT tokens avoid database lookups
- Role-based filtering at API level
- No need for frontend permission checks (trusted backend)
- Sidebar menu items generated once per login

### Future Optimizations
- Cache permission matrix in frontend
- Role-based API response caching
- Optimize data filtering queries
- Add database indexes on role fields

---

## 🔍 Debugging Tips

### Check User Role
```javascript
console.log(user.role, user.teacherType)
// Should show: 'teacher', 'class_teacher'
```

### Check Token
```javascript
const token = localStorage.getItem('authToken')
// Copy to jwt.io to decode and verify
```

### Check API Authorization
```javascript
// Browser DevTools → Network
// Check request headers: Authorization: Bearer {token}
// Check response status: 200 (ok) or 403 (forbidden)
```

### Check Sidebar Menu
```javascript
// React DevTools → Components
// Find Sidebar component
// Check getMenuItems() return value
```

---

## 📞 Support

### Common Issues & Solutions

**Issue**: Cannot login
- Solution: Verify backend running on port 5001, check credentials

**Issue**: Dashboard not showing
- Solution: Check user role/teacherType in localStorage, verify routes in App.jsx

**Issue**: Data not filtered
- Solution: Check backend middleware applied, verify filterDataByRole function

**Issue**: Cannot see role-specific pages
- Solution: Check ProtectedRoute has correct requiredTeacherTypes

---

## 🎉 Implementation Complete!

The complete role-based access control system is implemented with:
- ✅ 4 distinct teacher roles
- ✅ Role-specific dashboards
- ✅ Permission-based access control
- ✅ Data filtering by role
- ✅ Dynamic navigation
- ✅ Comprehensive testing support

**System Status**: READY FOR PRODUCTION

---

**Created**: March 18, 2026  
**Last Updated**: March 18, 2026  
**Version**: 1.0.0  
**Architecture Complexity**: High  
**Implementation Time**: ~4 hours  
**Testing Time**: ~1 hour
