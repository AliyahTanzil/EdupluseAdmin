# Authentication System Architecture

## Component Hierarchy

```
App.jsx
├── AuthProvider (Wraps entire app)
│   ├── Auth Context
│   │   ├── user state
│   │   ├── login()
│   │   ├── register()
│   │   ├── logout()
│   │   └── isAuthenticated
│   │
│   └── Routes
│       ├── Public Routes
│       │   ├── / (Landing)
│       │   ├── /login
│       │   ├── /register
│       │   └── /unauthorized
│       │
│       ├── Protected Routes (Admin)
│       │   ├── /admin-dashboard
│       │   ├── /students (+ child routes)
│       │   ├── /teachers (+ child routes)
│       │   ├── /subjects (+ child routes)
│       │   ├── /attendance
│       │   ├── /timetable
│       │   ├── /courses
│       │   └── /reports
│       │
│       ├── Protected Routes (Teacher)
│       │   ├── /teacher-dashboard
│       │   ├── /subjects
│       │   ├── /mark-attendance
│       │   └── /attendance
│       │
│       ├── Protected Routes (Student)
│       │   ├── /student-dashboard
│       │   ├── /student-profile
│       │   ├── /student-grades
│       │   ├── /student-subjects
│       │   ├── /student-teachers
│       │   └── /student-attendance
│       │
│       └── Protected Routes (Parent)
│           ├── /parent-dashboard
│           ├── /parent-children
│           ├── /parent-grades
│           ├── /parent-attendance
│           ├── /parent-notifications
│           └── /parent-learning-checklist
```

## Data Flow

```
LOGIN FLOW:
┌─────────────┐
│   User      │
└──────┬──────┘
       │ enters credentials
       ↓
┌──────────────────────┐
│  Login Page          │
│  - email field       │
│  - password field    │
└──────┬───────────────┘
       │ submits form
       ↓
┌──────────────────────────┐
│  AuthContext.login()     │
│  - validates input       │
│  - calls API             │
└──────┬───────────────────┘
       │ POST /api/auth/login
       ↓
┌──────────────────────────┐
│  Backend Auth Route      │
│  - finds user            │
│  - validates password    │
│  - generates JWT         │
└──────┬───────────────────┘
       │ returns token + user
       ↓
┌──────────────────────────┐
│  AuthContext             │
│  - stores token          │
│  - stores user           │
│  - sets isAuthenticated  │
└──────┬───────────────────┘
       │ state updated
       ↓
┌──────────────────────────┐
│  useEffect detects       │
│  authenticated user      │
└──────┬───────────────────┘
       │ redirects
       ↓
┌──────────────────────────┐
│  Role-Based Dashboard    │
│  - Admin → /admin-dash   │
│  - Teacher → /teacher    │
│  - Student → /student    │
│  - Parent → /parent      │
└──────────────────────────┘
```

## Protected Route Flow

```
User accesses /admin-dashboard
    │
    ↓
┌────────────────────────────┐
│  ProtectedRoute Component  │
└────┬───────────────────────┘
     │
     ├─→ Check: Is authenticated?
     │   ├─ No → Redirect to /login
     │   └─ Yes ↓
     │
     ├─→ Check: Has required role?
     │   ├─ No → Show /unauthorized
     │   └─ Yes ↓
     │
     ↓
┌────────────────────────────┐
│  Render Dashboard          │
│  - Page-specific content   │
│  - User information        │
│  - Logout button           │
└────────────────────────────┘
```

## Authentication State Management

```
AuthContext
├── State Variables
│   ├── user: { id, email, name, role, class, ... }
│   ├── loading: boolean
│   ├── error: string
│   └── isAuthenticated: boolean
│
├── Functions
│   ├── login(email, password)
│   │   ├── POST /api/auth/login
│   │   ├── Store token
│   │   ├── Store user
│   │   └── return user
│   │
│   ├── register(formData)
│   │   ├── POST /api/auth/register
│   │   ├── return response
│   │   └── redirect to login
│   │
│   └── logout()
│       ├── Remove token
│       ├── Remove user
│       ├── Clear state
│       └── return null
│
└── useEffect on Mount
    ├── Check localStorage
    ├── Restore session if valid
    └── Update loading state
```

## Database/Storage

```
Frontend Storage:
localStorage
├── authToken: JWT (7-day expiration)
└── user: { id, email, name, role, class, ... }

Backend (Mock - Replace with Real DB):
users = [
  {
    id: "1",
    email: "admin@school.com",
    password: "hashed_password",
    name: "Principal Admin",
    role: "admin",
    class: null,
    isClassMaster: false,
    subjects: []
  },
  ... (more users)
]
```

## API Integration

```
Authentication Endpoints:

1. LOGIN
   POST /api/auth/login
   Request:  { email, password }
   Response: { token, user: {...} }
   
2. REGISTER
   POST /api/auth/register
   Request:  { name, email, password, role, class, phone }
   Response: { token, user: {...} }
   
3. GET CURRENT USER
   GET /api/auth/me
   Header:   Authorization: Bearer <token>
   Response: { user: {...} }
```

## Security Flow

```
Request to Protected Route:
    │
    ├─→ Read token from localStorage
    │
    ├─→ Verify token not expired
    │   └─ Expired? → Redirect to login
    │
    ├─→ Send token in Authorization header
    │   └─ ALL_REQUESTS
    │
    ├─→ Backend validates token
    │   └─ Invalid? → 401 Unauthorized
    │
    ├─→ Check user role
    │   └─ Not allowed? → 403 Forbidden
    │
    └─→ Process request
```

## Role Hierarchy

```
ADMIN (Super User)
├── All permissions
├── Can create users
├── Can delete users
├── Can modify system settings
└── Can access all reports

TEACHER (Instructor)
├── Manage subjects
├── Manage classes
├── Mark attendance
├── View grades (own classes)
└── [+ If Class Master]
    ├── Manage students
    ├── Manage grades
    └── Class administration

STUDENT (Learner)
├── View profile
├── View grades
├── View subjects
├── View teachers
└── View attendance

PARENT (Guardian)
├── View children info
├── View children grades
├── View children attendance
├── View notifications
└── View learning progress
```

## Error Handling

```
Login Errors:
├── 400 → Invalid input (missing fields)
├── 401 → Invalid credentials
├── 409 → Email already registered (register)
└── 500 → Server error

Authorization Errors:
├── 401 → Missing or invalid token
├── 403 → User doesn't have required role
└── 404 → User not found
```

## File Dependencies

```
App.jsx
├── AuthContext.jsx (imports)
├── ProtectedRoute.jsx (imports)
├── Login.jsx (imports AuthContext)
├── Register.jsx (imports AuthContext)
├── AdminDashboard.jsx (imports AuthContext)
├── TeacherDashboard.jsx (imports AuthContext)
├── StudentDashboard.jsx (imports AuthContext)
└── ParentDashboard.jsx (imports AuthContext)

AuthContext.jsx (independent)

ProtectedRoute.jsx
├── AuthContext.jsx (uses useAuth hook)
└── Navigation (uses useNavigate)

Backend/server.js
└── routes/auth.js

Backend/routes/auth.js (independent)
```

## Session Lifecycle

```
NEW USER:
Registration → Token Generated → Dashboard Loaded
                    ↓
              localStorage.setItem('token')
              localStorage.setItem('user')

RETURNING USER:
Landing Page → Check localStorage
                    ├─ Valid token? → Redirect to Dashboard
                    └─ Invalid/Expired? → Redirect to Login

ACTIVE SESSION:
Request Made → Read token from localStorage
                    ├─ Include in header
                    └─ Send to API

LOGOUT:
Logout Button → Clear localStorage
                    ├─ removeItem('token')
                    ├─ removeItem('user')
                    └─ Redirect to Login
```

## Deployment Considerations

```
Frontend Deployment:
├── Build: npm run build
├── Output: dist/
├── Host on: Vercel, Netlify, etc.
└── Set API_URL for backend

Backend Deployment:
├── Environment: Node.js
├── Install deps: npm install
├── Set JWT_SECRET in .env
├── Database: Replace mock data
└── Host on: Heroku, AWS, etc.

Environment Variables:
- JWT_SECRET (backend)
- NODE_ENV (backend)
- VITE_API_URL (frontend - optional)
```

This architecture provides a scalable, secure foundation for the authentication system!
