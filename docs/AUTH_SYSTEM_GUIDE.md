# Authentication & Role-Based Access Control System

## Overview
Complete authentication and authorization system with role-based dashboards for Admin, Teacher, Student, and Parent users.

## Features Implemented

### 1. Authentication System
- **Login Page** (`/login`) - Secure login with email/password
- **Registration Page** (`/register`) - Self-registration with role selection
- **JWT Tokens** - Secure session management
- **Protected Routes** - Role-based access control

### 2. Role-Based Dashboards

#### Admin Dashboard (`/admin-dashboard`)
- Full system access
- Manage students, teachers, subjects
- View all attendance records
- Generate system reports
- System settings

#### Teacher Dashboard (`/teacher-dashboard`)
- View subjects they teach
- Manage their classes
- Mark attendance
- View attendance records
- **Class Master Features** (if applicable):
  - Manage class students
  - Manage class grades
  - Full class administration

#### Student Dashboard (`/student-dashboard`)
- View personal profile
- Check grades and performance
- View enrolled subjects
- See their teachers
- Track attendance records

#### Parent Dashboard (`/parent-dashboard`)
- View children information
- Monitor children's grades
- Track children's attendance
- Receive notifications
- View learning checklist

### 3. User Roles

```
admin          - Full system access
teacher        - Teaching and class management
student        - Personal academic info
parent         - Child's academic monitoring
```

### 4. Demo Credentials

```
Admin:
  Email: admin@school.com
  Password: password

Teacher:
  Email: teacher@school.com
  Password: password

Student:
  Email: student@school.com
  Password: password

Parent:
  Email: parent@school.com
  Password: password
```

## Technical Implementation

### Frontend Files Created

1. **Context**
   - `src/contexts/AuthContext.jsx` - Authentication state management

2. **Components**
   - `src/components/ProtectedRoute.jsx` - Route protection with role checking

3. **Pages**
   - `src/pages/Login.jsx` - Login interface
   - `src/pages/Register.jsx` - Registration interface
   - `src/pages/Unauthorized.jsx` - Access denied page
   - `src/pages/AdminDashboard.jsx` - Admin role dashboard
   - `src/pages/TeacherDashboard.jsx` - Teacher role dashboard
   - `src/pages/StudentDashboard.jsx` - Student role dashboard
   - `src/pages/ParentDashboard.jsx` - Parent role dashboard

4. **App Configuration**
   - `src/App.jsx` - Updated with AuthProvider and protected routes

### Backend Files Created

1. **Authentication Route**
   - `backend/routes/auth.js` - Authentication endpoints
     - `POST /api/auth/login` - User login
     - `POST /api/auth/register` - User registration
     - `GET /api/auth/me` - Get current user

### Backend Setup Required

Install JWT dependency:
```bash
npm install jsonwebtoken bcrypt
```

## User Flow

### 1. New User Registration
1. Visit `/register`
2. Fill in details and select role
3. Account created and automatically logged in
4. Redirected to appropriate dashboard

### 2. Existing User Login
1. Visit `/login`
2. Enter email and password
3. JWT token issued
4. Redirected based on role:
   - Admin → `/admin-dashboard`
   - Teacher → `/teacher-dashboard`
   - Student → `/student-dashboard`
   - Parent → `/parent-dashboard`

### 3. Protected Routes
- All dashboards and features are protected
- Unauthorized access redirects to `/unauthorized`
- Invalid tokens redirect to `/login`

## Future Pages to Create

### Admin Features
- [ ] User management
- [ ] System analytics
- [ ] Reports generation
- [ ] Settings page

### Teacher Features
- [ ] Student performance tracking
- [ ] Grade management
- [ ] Assignment creation
- [ ] Class notifications

### Student Features
- [ ] Profile management
- [ ] Assignment submission
- [ ] Progress tracking
- [ ] Message board

### Parent Features
- [ ] Multiple children management
- [ ] Communication with teachers
- [ ] Performance reports
- [ ] Event calendar

## API Integration

All authentication endpoints are available at:
- Base URL: `http://localhost:5000/api/auth`

### Login Endpoint
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

### Register Endpoint
```
POST /api/auth/register
Body: { name, email, password, role, class, phone }
Response: { token, user }
```

## Environment Setup

1. Update `.env` file:
```
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

2. Start backend:
```bash
cd backend
npm install
npm start
```

3. Start frontend:
```bash
cd website
npm install
npm run dev
```

## Security Notes

⚠️ **Important for Production:**
1. Hash passwords using bcrypt before storing
2. Use strong JWT_SECRET
3. Implement HTTPS
4. Add rate limiting for login attempts
5. Store JWT in secure HTTP-only cookies
6. Implement refresh token mechanism
7. Add CSRF protection
8. Validate all user inputs

## Next Steps

1. Create API endpoints for each role's features
2. Build student profile page
3. Build teacher class management pages
4. Build parent monitoring pages
5. Implement notifications system
6. Add permission middleware on backend
7. Create analytics dashboards
8. Add email verification
9. Implement password reset
10. Add 2FA for admin accounts
