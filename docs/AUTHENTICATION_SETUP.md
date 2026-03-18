# Quick Setup Guide - Authentication System

## Installation Steps

### 1. Backend Setup

```bash
cd backend

# Install JWT library
npm install jsonwebtoken

# Verify server.js includes auth routes
# Should see: app.use('/api/auth', require('./routes/auth'));

# Start backend
npm start
```

### 2. Frontend Setup

No additional packages needed! The authentication system uses existing dependencies.

```bash
cd website

# Start development server
npm run dev
```

### 3. Access the Application

1. **Landing Page**: http://localhost:5173 (or your dev port)
2. **Login**: Click "Sign In" or go to http://localhost:5173/login
3. **Register**: Click "Create Account" or go to http://localhost:5173/register

## Demo Login Credentials

### Admin Account
```
Email: admin@school.com
Password: password
```
→ Access: Full system control, all admin features

### Teacher Account
```
Email: teacher@school.com
Password: password
```
→ Access: Subjects, classes, attendance marking

### Student Account
```
Email: student@school.com
Password: password
```
→ Access: Personal grades, subjects, attendance

### Parent Account
```
Email: parent@school.com
Password: password
```
→ Access: Children info, grades, attendance, notifications

## Testing the System

### Test Login Flow
1. Go to `/login`
2. Try admin@school.com / password
3. Should redirect to `/admin-dashboard`
4. Click Logout to test logout

### Test Registration
1. Go to `/register`
2. Fill in details
3. Select role (e.g., Student)
4. Click "Create Account"
5. Should redirect to appropriate dashboard

### Test Role-Based Access
1. Login as student
2. Try accessing `/admin-dashboard`
3. Should see "Access Denied" page
4. Click "Go Home" to return

## System Architecture

```
Landing Page (/):
├── Not logged in → Show app features
├── Logged in → Redirect to dashboard

Login (/login):
├── Valid credentials → Generate JWT
└── Redirect to role-based dashboard

Register (/register):
├── New user → Create account
├── Generate JWT
└── Redirect to role-based dashboard

Role-Based Dashboards:
├── Admin → /admin-dashboard
├── Teacher → /teacher-dashboard
├── Student → /student-dashboard
└── Parent → /parent-dashboard

Protected Routes:
├── Require valid JWT
├── Check user role
└── Show/deny access
```

## File Structure

```
Frontend:
website/src/
├── contexts/
│   └── AuthContext.jsx           # Auth state & functions
├── components/
│   └── ProtectedRoute.jsx        # Route protection
├── pages/
│   ├── Login.jsx                 # Login page
│   ├── Register.jsx              # Registration page
│   ├── Unauthorized.jsx          # Access denied
│   ├── AdminDashboard.jsx        # Admin dashboard
│   ├── TeacherDashboard.jsx      # Teacher dashboard
│   ├── StudentDashboard.jsx      # Student dashboard
│   └── ParentDashboard.jsx       # Parent dashboard
└── App.jsx                       # Routes with protection

Backend:
backend/routes/
└── auth.js                       # Authentication endpoints
```

## Key Features

✅ **Authentication**
- Secure login with JWT
- Email/password registration
- Session persistence (localStorage)
- Logout with token cleanup

✅ **Authorization**
- Role-based access control
- Protected routes by role
- Unauthorized access handling
- Automatic redirects

✅ **User Experience**
- Demo credentials provided
- Clear error messages
- Show/hide password toggle
- Loading states
- Responsive design

## Environment Variables (.env)

```
# Backend
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=5000

# Frontend (if needed)
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### "Cannot POST /api/auth/login"
- Ensure backend is running on port 5000
- Check that auth.js route is properly registered in server.js
- Verify CORS is enabled

### "Invalid token"
- Check JWT_SECRET matches between frontend and backend
- Ensure token is being sent in Authorization header
- Check token expiration

### "Redirect loop"
- Clear localStorage and cookies
- Check route protection rules
- Verify user role is set correctly

### "Module not found: jsonwebtoken"
- Run: `npm install jsonwebtoken` in backend directory
- Restart backend server

## Next Development Steps

1. ✅ Create login/register pages
2. ✅ Setup role-based dashboards
3. ✅ Create authentication endpoints
4. ⏳ Create role-specific feature pages
5. ⏳ Connect real database for users
6. ⏳ Add email verification
7. ⏳ Implement password reset
8. ⏳ Add 2FA for admin
9. ⏳ Create notification system
10. ⏳ Build admin analytics

## Support

All authentication components are fully integrated. The system is ready for:
- Adding more user features
- Connecting to real database
- Implementing additional security measures
- Creating role-specific pages

Start by creating feature pages for each role's dashboard!
