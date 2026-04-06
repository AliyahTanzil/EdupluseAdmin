# 📚 EduPlus Admin System - Master Project Documentation

**Version:** 2.0.0  
**Last Updated:** March 22, 2026  
**Status:** 🚀 Development Phase - Full Stack Implementation  
**Project Owner:** AliyahTanzil/EdupluseAdmin

---

## 📋 Table of Contents

1. [Executive Overview](#executive-overview)
2. [System Architecture](#system-architecture)
3. [Project Phases](#project-phases)
4. [Frontend Design Guidelines](#frontend-design-guidelines)
5. [Backend API Documentation](#backend-api-documentation)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [Admin Hierarchy System](#admin-hierarchy-system)
9. [Mobile Responsiveness](#mobile-responsiveness)
10. [Mobile App Development (iOS/Android)](#mobile-app-development-iosandroid)
11. [Development Checklist](#development-checklist)
12. [Testing & Deployment](#testing--deployment)
13. [Quick Start Guide](#quick-start-guide)

---

## Executive Overview

### Project Vision
EduPlus Admin System is a comprehensive education management platform designed for multi-tier school administration. The system supports:

- **Multiple School Levels:** Primary, Junior Secondary, Senior Secondary
- **Admin Hierarchy:** CEO, Principal, Regular Admin, Secretary, Finance Manager
- **Multiple User Roles:** Students, Teachers, Parents, Administrators
- **Multi-Platform Support:** Web (Desktop & Mobile), Mobile App (iOS/Android)
- **Offline Capability:** Full functionality with online/offline sync

### Key Features (Phase 2 - Current)

✅ **Authentication System**
- Email/Password login with role-based access
- JWT token management with 24-hour expiration
- Session management and auto-logout
- Social login integration (Firebase)

✅ **Admin Hierarchy**
- 5 distinct admin types with different access levels
- School-level filtering based on admin type
- Cascading permissions system
- Audit logging for all admin actions

✅ **Dashboard System**
- Role-specific dashboards (7 different layouts)
- Real-time statistics and analytics
- Interactive data visualization
- Responsive design (Mobile + Web)

✅ **User Management**
- Registration with admin type selection
- School assignment per admin type
- Bulk user import/export
- User suspension and deactivation

❌ **In Development (Phase 3)**
- Full dashboard UI implementation
- Mobile app development
- Advanced reporting features

---

## System Architecture

### Technology Stack

**Frontend:**
```
├── React 18.2.0 (UI Framework)
├── Vite 4.3.2 (Build Tool)
├── Tailwind CSS 3.3.0 (Styling)
├── Lucide React (Icons)
├── Axios (HTTP Client)
└── React Router 6.8.0 (Routing)
```

**Backend:**
```
├── Node.js + Express 4.18.2 (API Server)
├── Better SQLite3 9.0.0 (Local Database)
├── Firebase Admin SDK (Cloud Services)
├── JWT (Authentication)
├── Helmet (Security)
└── CORS (Cross-Origin Support)
```

**Mobile (Planned):**
```
├── React Native
├── Expo
├── Redux (State Management)
└── Native SQLite (Offline Storage)
```

### Project Structure

```
EdupluseAdmin/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── users.js             # User management
│   │   ├── schools.js           # School management
│   │   └── dashboard.js         # Dashboard data
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── permissions.js       # RBAC enforcement
│   ├── models/
│   │   ├── User.js
│   │   ├── School.js
│   │   └── AdminHierarchy.js
│   ├── config/
│   │   └── database.js
│   └── package.json
│
├── website/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login with user type selector
│   │   │   ├── Register.jsx      # Registration with admin type
│   │   │   ├── SchoolSelection.jsx
│   │   │   ├── Dashboard.jsx     # Main dashboard router
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── ParentDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SchoolContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── config/
│   │   │   └── schoolHierarchy.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── App.jsx
│   └── package.json
│
├── mobile/
│   └── (React Native app structure - Phase 3)
│
└── docs/
    └── (API documentation, design guidelines)
```

---

## Project Phases

### Phase 1: Authentication & Admin Hierarchy ✅ COMPLETE
- [x] Login system with demo credentials
- [x] Admin type selector on login form
- [x] Auto-fill functionality
- [x] School selection post-login
- [x] Admin hierarchy configuration
- [x] CEO admin bug fix (now shows all 3 schools)

### Phase 2: Dashboard UI Implementation 🚀 IN PROGRESS
- [ ] Student Dashboard layout
- [ ] Super Admin Dashboard layout
- [ ] Teacher Dashboard layout
- [ ] Parent Dashboard layout
- [ ] Mobile responsive design
- [ ] Dashboard data visualization
- [ ] Export/Print functionality

### Phase 3: Mobile App Development ⏳ PLANNED
- [ ] React Native setup
- [ ] Native authentication module
- [ ] Offline data sync
- [ ] Push notifications
- [ ] Mobile-specific UI/UX

### Phase 4: Advanced Features ⏳ PLANNED
- [ ] Advanced reporting
- [ ] Bulk operations
- [ ] Custom fields
- [ ] API webhooks
- [ ] Third-party integrations

### Phase 5: Deployment & Scaling ⏳ PLANNED
- [ ] Docker containerization
- [ ] Cloud deployment (AWS/GCP/Azure)
- [ ] Load balancing
- [ ] CDN integration
- [ ] Performance optimization

---

## Frontend Design Guidelines

### Based on Provided Mockups

The frontend should follow the design language from:
- `Images/Edupluse.jpeg` - Main app branding
- `Images/Admin.jpeg` - Admin dashboard layout
- `Images/Dashboard.jpeg` - Dashboard overview
- `Images/Edupluse1-3.jpeg` - Additional screens

### Design System

**Color Palette:**
```css
Primary:       #3B82F6 (Blue)       /* Actions, buttons */
Secondary:     #10B981 (Green)      /* Success states */
Danger:        #EF4444 (Red)        /* Errors, warnings */
Warning:       #F59E0B (Amber)      /* Warnings */
Neutral:       #6B7280 (Gray)       /* Text, borders */
Background:    #F9FAFB (Light Gray) /* Page background */
```

**Typography:**
```
Headings:  Inter, Bold (700) - 24px, 20px, 18px, 16px
Body:      Inter, Regular (400) - 14px, 13px
Small:     Inter, Regular (400) - 12px
```

**Spacing:**
```
Padding:   4px, 8px, 12px, 16px, 24px, 32px (8px scale)
Margin:    Same as padding
Gaps:      12px, 16px, 24px
Border Radius: 4px (small), 8px (medium), 12px (large)
```

**Components:**
```
Buttons:     Primary (Blue), Secondary (Gray), Danger (Red)
Cards:       Shadow-sm, rounded-lg, p-6
Forms:       Label + Input/Select/Textarea with validation
Tables:      Striped rows, sticky header, sortable columns
Modals:      Center aligned, backdrop blur
Alerts:      Success, Warning, Error, Info states
```

### Responsive Breakpoints

```
Mobile:     0px - 640px      (xs, sm)
Tablet:     641px - 1024px   (md, lg)
Desktop:    1025px+          (xl, 2xl)
```

---

## Backend API Documentation

### Base URL
```
Development:  http://localhost:5001/api
Production:   https://api.eduplus.com/api
```

### Authentication Endpoints

#### 1. Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@school.com",
  "password": "password"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "admin@school.com",
    "fullName": "Admin Name",
    "adminType": "ceo",
    "assignedSchools": ["primary", "junior_secondary", "senior_secondary"],
    "isSuperUser": true,
    "role": "CEO Admin",
    "permissions": ["manage_users", "manage_schools", ...]
  }
}
```

#### 2. Register
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "nenadmin@school.com",
  "password": "securepass123",
  "fullName": "New Admin",
  "adminType": "principal",
  "schoolLevel": "junior_secondary"
}

Response (201 Created):
{
  "success": true,
  "message": "Account created successfully",
  "user": { ...user object }
}
```

#### 3. Logout
```
POST /auth/logout
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 4. Refresh Token
```
POST /auth/refresh
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}
```

### User Management Endpoints

#### Get Current User
```
GET /users/me
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "user": { ...user object }
}
```

#### Get All Users (Admin only)
```
GET /users?role=teacher&school=primary
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    { ...user1 },
    { ...user2 }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

#### Update User
```
PUT /users/:userId
Headers:
  Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "fullName": "Updated Name",
  "email": "newemail@school.com",
  "role": "principal"
}

Response (200 OK):
{
  "success": true,
  "user": { ...updated user }
}
```

#### Delete User
```
DELETE /users/:userId
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully"
}
```

### School Management Endpoints

#### Get Schools (Filtered by Admin Access)
```
GET /schools?level=primary
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Primary School",
      "level": "primary",
      "studentsCount": 450,
      "teachersCount": 25,
      "classesCount": 12
    }
  ]
}
```

#### Get School Details
```
GET /schools/:schoolId
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "school": { ...school object with stats }
}
```

### Dashboard Endpoints

#### Get Dashboard Data
```
GET /dashboard?school=primary&type=admin
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "statistics": {
      "totalStudents": 450,
      "totalTeachers": 25,
      "totalClasses": 12,
      "totalAttendance": 95.5
    },
    "charts": {
      "attendanceByMonth": [...],
      "classDistribution": [...]
    },
    "recentActivity": [...]
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  profile_image TEXT,
  user_type TEXT NOT NULL, -- 'student', 'teacher', 'parent', 'admin'
  admin_type TEXT,         -- 'ceo', 'principal', 'admin', 'secretary', 'finance'
  assigned_schools TEXT,   -- JSON array: ["primary", "junior_secondary"]
  is_super_user BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'inactive'
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_user_type ON users(user_type);
CREATE INDEX idx_admin_type ON users(admin_type);
```

### Schools Table
```sql
CREATE TABLE schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL, -- 'primary', 'junior_secondary', 'senior_secondary'
  address TEXT,
  phone TEXT,
  email TEXT,
  principal_id TEXT REFERENCES users(id),
  students_count INTEGER DEFAULT 0,
  teachers_count INTEGER DEFAULT 0,
  classes_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_level ON schools(level);
```

### Admin Assignments Table
```sql
CREATE TABLE admin_assignments (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES users(id),
  school_id TEXT NOT NULL REFERENCES schools(id),
  admin_type TEXT NOT NULL, -- 'ceo', 'principal', 'admin'
  assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(admin_id, school_id)
);

CREATE INDEX idx_admin_id ON admin_assignments(admin_id);
CREATE INDEX idx_school_id ON admin_assignments(school_id);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(token)
);

CREATE INDEX idx_user_sessions ON sessions(user_id);
```

---

## Authentication & Authorization

### Admin Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                     SYSTEM ADMIN                        │
│              (Super User - All Permissions)             │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │    CEO     │    │ PRINCIPAL  │    │   FINANCE  │
    │  (Level 1) │    │  (Level 2) │    │  (Level 3) │
    └────────────┘    └────────────┘    └────────────┘
        │                   │                   │
    Can access:         Can access:        Can access:
    • All schools       • 2-3 schools      • Finance only
    • All admins        • Admin, Teachers  • Reports
    • All reports       • Classes          • Budget
    • All settings      • Attendance       • Payroll
```

### Role-Based Permissions

#### CEO Admin Permissions
```javascript
const ceaAdminPermissions = [
  'manage_users',           // Create/Edit/Delete any user
  'manage_schools',         // Add/Edit schools
  'manage_admins',          // Manage all admin accounts
  'view_all_reports',       // Access all reports
  'export_data',            // Export any data
  'system_settings',        // Change system configurations
  'audit_logs',             // View all audit logs
  'bulk_operations',        // Bulk import/export
];
```

#### Principal Permissions
```javascript
const principalPermissions = [
  'manage_teachers',        // Add/Edit/Delete teachers
  'manage_students',        // Add/Edit/Delete students
  'manage_classes',         // Create/Manage classes
  'view_attendance',        // View attendance reports
  'assign_grades',          // View and assign grades
  'approve_requests',       // Approve teacher requests
  'school_reports',         // School-level reports
  'parent_communication',   // Send messages to parents
];
```

#### Regular Admin Permissions
```javascript
const regularAdminPermissions = [
  'manage_own_classes',     // Manage assigned classes only
  'view_students',          // View student list
  'record_attendance',      // Record class attendance
  'submit_grades',          // Submit grades
  'view_reports',           // View assigned reports
  'send_messages',          // Communicate with others
];
```

#### Teacher Permissions
```javascript
const teacherPermissions = [
  'view_my_classes',        // View assigned classes
  'record_attendance',      // Mark attendance
  'submit_grades',          // Submit class grades
  'send_assignments',       // Create assignments
  'communicate_students',   // Message students
  'communicate_parents',    // Message parents
  'view_my_grades',         // View submitted grades
];
```

#### Student Permissions
```javascript
const studentPermissions = [
  'view_my_classes',        // View enrolled classes
  'view_my_grades',         // View personal grades
  'view_assignments',       // View assignments
  'submit_assignments',     // Submit work
  'view_attendance',        // View attendance record
  'communicate_teacher',    // Message teachers
  'view_announcements',     // View school announcements
];
```

---

## Admin Hierarchy System

### Demo Test Credentials

```
┌────────────────────────────────────────────────────────────────┐
│                     DEMO LOGIN CREDENTIALS                     │
├────────────────────────────────────────────────────────────────┤
│ USER TYPE    │ EMAIL                    │ PASSWORD    │ ACCESS │
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ CEO Admin    │ admin@school.com         │ password    │ All 3  │
│              │                          │             │Schools │
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ Principal    │ principal@school.com     │ password    │ 2 Sch  │
│              │                          │             │Schools │
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ Reg. Admin   │ regularadmin@school.com  │ password    │ 1 Sch  │
│              │                          │             │School  │
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ Teacher      │ teacher@school.com       │ password    │ Classes│
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ Student      │ student@school.com       │ password    │ Courses│
├──────────────┼──────────────────────────┼─────────────┼────────┤
│ Parent       │ parent@school.com        │ password    │ Child  │
└────────────────────────────────────────────────────────────────┘
```

### School Access Matrix

```
                      PRIMARY    JUNIOR_SEC    SENIOR_SEC
CEO Admin               ✅           ✅             ✅
Principal               ❌           ✅             ✅
Regular Admin           ❌           ❌             ✅
Finance Manager         ✅           ✅             ✅
Secretary               ✅           ❌             ❌
```

---

## Mobile Responsiveness

### Breakpoint Strategy

#### Mobile (0-640px)
```
- Single column layout
- Bottom navigation bar
- Hamburger menu
- Stack-based forms
- Touch-friendly buttons (min 44px)
- Large fonts (16px minimum)
- Modal-based dialogs
```

#### Tablet (641-1024px)
```
- 2-column layout where applicable
- Side drawer navigation
- Optimized tables
- Side-by-side forms
- Standard buttons (40px)
- Standard fonts (14px)
```

#### Desktop (1025px+)
```
- Full sidebar navigation
- 3+ column layouts
- Compact tables
- Multi-column forms
- Standard buttons
- Fine typography
```

### Mobile-First CSS Example

```css
/* Mobile First */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet */
@media (min-width: 641px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Mobile App Development (iOS/Android)

### Overview

The EduPlus Admin System will have native mobile applications for both iOS and Android platforms, providing seamless access to the education management system on smartphones and tablets. The apps will be built using React Native for code sharing and Expo for simplified development and deployment.

### Mobile App Architecture

```
Mobile Apps (iOS & Android)
│
├── React Native Core
│   ├── Navigation (React Navigation)
│   ├── UI Components (React Native Paper)
│   ├── State Management (Redux)
│   └── HTTP Client (Axios)
│
├── Native Modules
│   ├── Biometric Authentication
│   ├── Local Storage (AsyncStorage)
│   ├── Camera/Photo Library
│   ├── Push Notifications
│   └── File System Access
│
└── Backend Connection
    ├── REST API (same as web)
    ├── WebSocket (real-time updates)
    ├── Offline Queue
    └── Data Sync Engine
```

### iOS Specifications

#### Platform Requirements
```
Minimum iOS Version:      13.0
Target iOS Version:       17.0
Supported Devices:        iPhone (all modern), iPad
Architecture:             ARM64
XCode Version:            14.0+
Swift Version:            5.0+
```

#### iOS Dependencies
```
React Native:             0.72+
Expo:                     Latest
React Navigation:         6.0+
React Native Paper:       5.0+ (UI Components)
Redux:                    4.0+ (State Management)
axios:                    1.6+ (HTTP)
AsyncStorage:             1.21+ (Local Storage)
@react-native-async-storage/async-storage: Latest
react-native-biometrics: 3.0+ (Face ID, Touch ID)
react-native-push-notification: Latest
react-native-camera: 4.0+
react-native-file-access: 3.0+
```

#### iOS Features
```
✅ Face ID & Touch ID Authentication
✅ Biometric Login Support
✅ Offline-first data storage
✅ Background sync capability
✅ Push notifications
✅ Camera integration (for document scanning)
✅ Photo gallery access
✅ Local caching
✅ App shortcuts
✅ Siri integration (future)
```

#### iOS Build Configuration
```
Team ID:                  Your Apple Team ID
Bundle ID:                com.eduplus.admin
Provisioning Profile:     Automatic management
Code Signing:             Automatic
Deployment Target:        iOS 13.0
```

#### iOS App Store Deployment
```
1. Developer Account Setup
   ├─ Apple Developer Program enrollment ($99/year)
   ├─ Team ID configuration
   └─ Certificate generation

2. App Store Connect Setup
   ├─ App information
   ├─ Screenshots (5-6 for each iPhone model)
   ├─ Preview video (15-30 seconds)
   ├─ App description
   ├─ Keywords (36 character limit)
   ├─ Support & privacy URL
   └─ Version release notes

3. Build & Submission
   ├─ Generate production build
   ├─ Archive in XCode
   ├─ Validate with App Store Connect
   ├─ Submit for review
   └─ Average approval: 24-48 hours

4. Pre-Release Checklist
   ✅ TestFlight beta testing (minimum 1 week)
   ✅ Crash reporting verification
   ✅ Privacy policy compliance
   ✅ Data handling disclosure
   ✅ COPPA compliance (if applicable)
```

### Android Specifications

#### Platform Requirements
```
Minimum Android Version:  Android 8.0 (API 26)
Target Android Version:   Android 14 (API 34)
Supported Devices:        All Android phones/tablets
Architecture:             ARM64, x86, x86_64
Android Studio Version:   2022.1+
Gradle Version:           8.0+
JDK Version:              17.0+
```

#### Android Dependencies
```
React Native:             0.72+
Expo:                     Latest
React Navigation:         6.0+
React Native Paper:       5.0+ (Material Design)
Redux:                    4.0+
axios:                    1.6+
react-native-async-storage/async-storage: Latest
react-native-biometrics: 3.0+ (Fingerprint)
react-native-push-notification: Latest
react-native-camera: 4.0+
react-native-file-access: 3.0+
@react-native-firebase/app: Latest
@react-native-firebase/messaging: Latest
```

#### Android Features
```
✅ Biometric authentication (Fingerprint, Face)
✅ Offline-first architecture
✅ Background sync service
✅ Firebase Cloud Messaging
✅ Document scanning via camera
✅ File picker integration
✅ Local SQLite database
✅ Android widgets
✅ Notification channels
✅ Android Wear support (future)
```

#### Android Build Configuration
```
applicationId:             com.eduplus.admin
compileSdk:                34
minSdk:                    26
targetSdk:                 34
versionCode:               1
versionName:               "1.0.0"
signingConfig:             Release keystore
```

#### Android App Store Deployment
```
1. Google Play Account Setup
   ├─ Google Play Developer Account ($25 one-time)
   ├─ Merchant account setup
   └─ App signing certificate generation

2. Google Play Console Setup
   ├─ App details
   ├─ Screenshots (5-8 for phones)
   ├─ Preview video (15-30 seconds)
   ├─ App description
   ├─ Short description (80 character limit)
   ├─ Promotional graphics (1024x500)
   ├─ Feature graphic (1024x500)
   ├─ Privacy policy URL
   ├─ Content rating questionnaire
   └─ Target audience

3. Build & Submission
   ├─ Generate signed APK/AAB
   ├─ Upload to Google Play Console
   ├─ Review app content
   ├─ Set pricing and distribution
   └─ Submit for review (usually approved in 2-3 hours)

4. Pre-Release Checklist
   ✅ Internal testing track (minimum 24 hours)
   ✅ Beta testing track (minimum 5 days)
   ✅ Staged rollout (5% → 50% → 100%)
   ✅ Crash reporting verification
   ✅ Privacy policy compliance
   ✅ Permissions declaration
   ✅ Google Play policies compliance
```

### React Native Project Structure

```
mobile/
├── src/
│   ├── navigation/
│   │   ├── AuthNavigator.js      # Login/Register flow
│   │   ├── AppNavigator.js       # Main app navigation
│   │   ├── AdminNavigator.js     # Admin-specific screens
│   │   ├── TeacherNavigator.js   # Teacher-specific screens
│   │   ├── StudentNavigator.js   # Student-specific screens
│   │   └── ParentNavigator.js    # Parent-specific screens
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── BiometricSetupScreen.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AdminDashboardScreen.js
│   │   │   ├── TeacherDashboardScreen.js
│   │   │   ├── StudentDashboardScreen.js
│   │   │   └── ParentDashboardScreen.js
│   │   │
│   │   ├── common/
│   │   │   ├── UserProfileScreen.js
│   │   │   ├── SettingsScreen.js
│   │   │   ├── NotificationsScreen.js
│   │   │   └── HelpScreen.js
│   │   │
│   │   └── school/
│   │       ├── SchoolDetailsScreen.js
│   │       ├── UserManagementScreen.js
│   │       └── ReportsScreen.js
│   │
│   ├── components/
│   │   ├── DashboardCard.js
│   │   ├── StatisticCard.js
│   │   ├── ClassCard.js
│   │   ├── UserCard.js
│   │   ├── ListItem.js
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── Modal.js
│   │
│   ├── redux/
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── schoolSlice.js
│   │   │   ├── dashboardSlice.js
│   │   │   └── syncSlice.js
│   │   └── middleware/
│   │       ├── syncMiddleware.js
│   │       └── offlineMiddleware.js
│   │
│   ├── services/
│   │   ├── api.js               # API client
│   │   ├── auth.js              # Auth service
│   │   ├── storage.js           # Local storage
│   │   ├── sync.js              # Offline sync
│   │   ├── notification.js      # Push notifications
│   │   ├── biometric.js         # Biometric auth
│   │   └── database.js          # Local database
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── theme.js             # App theme
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   └── App.js                   # Entry point
│
├── ios/
│   ├── Podfile
│   ├── Pods/
│   ├── EduPlusAdmin.xcodeproj/
│   └── EduPlusAdmin/
│       ├── Info.plist
│       ├── AppDelegate.swift
│       └── Resources/
│
├── android/
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── AndroidManifest.xml
│   │   │   │   ├── java/com/eduplus/admin/
│   │   │   │   └── res/
│   │   │   └── test/
│   │   └── build.gradle
│   ├── gradle/
│   ├── gradlew
│   └── build.gradle
│
├── app.json                     # Expo configuration
├── package.json
└── README.md
```

### Offline-First Architecture

#### Data Sync Strategy

```
┌─────────────────────────────────────────┐
│         Mobile App (React Native)        │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐  │
│  │   Redux State Management        │  │
│  │   ├─ Auth State                 │  │
│  │   ├─ User Data                  │  │
│  │   ├─ Dashboard Data             │  │
│  │   └─ Sync Queue                 │  │
│  └─────────────────────────────────┘  │
│                │                      │
│  ┌─────────────▼─────────────────────┐│
│  │   Local SQLite Database            ││
│  │   ├─ Users Table                   ││
│  │   ├─ Schools Table                 ││
│  │   ├─ Classes Table                 ││
│  │   └─ Sync Metadata                 ││
│  └─────────────────────────────────────┤
│                │                      │
│  ┌─────────────▼──────────────────────┐│
│  │   Sync Engine                       ││
│  │   ├─ Check internet connection      ││
│  │   ├─ Queue offline changes         ││
│  │   ├─ Sync when online              ││
│  │   └─ Handle conflicts              ││
│  └─────────────────────────────────────┤
│                │                      │
└────────────────┼──────────────────────┘
                 │
         ┌───────▼────────┐
         │   Backend API   │
         │ (Express.js)   │
         └────────────────┘
```

#### Offline Features
```
✅ View cached dashboard data
✅ Read user profiles
✅ Browse schools and classes
✅ Queue offline actions (create, update)
✅ Auto-sync when connection restored
✅ Conflict resolution (last-write-wins)
✅ Sync status indicators
✅ Offline mode badge
```

### Mobile UI/UX Specifications

#### Design System for Mobile
```
Colors:          Same as web (Primary Blue #3B82F6, etc.)
Typography:      Slightly larger than web (min 16px body)
Spacing:         8px scale (same as web)
Touch Targets:   Minimum 44x44 points (iOS), 48x48 dp (Android)
Safe Areas:      Account for notches, home indicators
```

#### Navigation Patterns
```
Tab Navigation:
├─ Home (Dashboard)
├─ Classes/Courses
├─ Assignments
├─ Grades
├─ Messages
├─ Profile

Stack Navigation:
├─ Root Navigation
│  ├─ Auth Stack (Login, Register)
│  └─ Main Stack (Dashboard, Details)
│     └─ Detail Stack (for nested navigation)
```

#### Screen Layouts

**Login Screen (Mobile)**
```
┌─────────────────────────┐
│       EduPlus Logo      │
│                         │
│  ┌──────────────────┐   │
│  │ Email Input      │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ Password Input   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ [Login Button]   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ [Biometric Login]│   │
│  └──────────────────┘   │
│                         │
│  Don't have account?    │
│  [Register]             │
└─────────────────────────┘
```

**Dashboard Screen (Mobile)**
```
┌─────────────────────────┐
│  📱 Admin Dashboard     │
│  Settings ⚙️            │
└─────────────────────────┘
│ Welcome John!           │
│ Senior Secondary School │
├─────────────────────────┤
│  [Users: 245]           │
│  [Classes: 12]          │
│  [Attendance: 95%]      │
├─────────────────────────┤
│ Recent Activity         │
│ ├─ User created...      │
│ ├─ Class updated...     │
│ └─ Grade submitted...   │
├─────────────────────────┤
│      🏠 📚 📊 💬 👤     │
└─────────────────────────┘
```

### Push Notifications

#### Implementation Strategy

**iOS (APNs - Apple Push Notification service)**
```
1. Certificate Setup
   ├─ Generate signing certificate in Apple Developer
   ├─ Create push notification certificate
   ├─ Download and install in XCode
   └─ Configure in app

2. Backend Setup
   ├─ Install apn package
   ├─ Configure certificate path
   ├─ Implement notification service
   └─ Handle responses

3. Client Setup
   ├─ Request user permissions
   ├─ Get device token
   ├─ Send to backend
   └─ Handle notifications
```

**Android (Firebase Cloud Messaging - FCM)**
```
1. Firebase Setup
   ├─ Create Firebase project
   ├─ Add Android app
   ├─ Download google-services.json
   └─ Add to project

2. Backend Setup
   ├─ Install firebase-admin SDK
   ├─ Configure service account key
   ├─ Implement messaging service
   └─ Create notification templates

3. Client Setup
   ├─ Initialize Firebase
   ├─ Request permissions
   ├─ Get FCM token
   ├─ Send to backend
   └─ Handle notifications
```

#### Notification Types
```
Authentication
├─ Login attempts
├─ Password changes
├─ New device login
└─ Session expiration

School Events
├─ New announcements
├─ Class cancellations
├─ Event reminders
└─ Important notices

Academic
├─ Grade submissions
├─ Assignment deadlines
├─ Attendance records
└─ Class schedules

System
├─ Maintenance alerts
├─ System updates
├─ Backup notifications
└─ Sync status
```

### Biometric Authentication

#### iOS Implementation
```javascript
import RNBiometrics from 'react-native-biometrics';

const setupBiometric = async () => {
  try {
    const sensorAvailable = await RNBiometrics.isSensorAvailable();
    
    if (sensorAvailable.available) {
      const result = await RNBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access EduPlus',
        fallbackPromptMessage: 'Use passcode',
      });
      
      if (result.success) {
        // Biometric auth successful
        handleBiometricLogin();
      }
    }
  } catch (error) {
    console.error('Biometric error:', error);
  }
};
```

#### Android Implementation
```javascript
import RNBiometrics from 'react-native-biometrics';

const setupBiometric = async () => {
  try {
    const biometricConfig = {
      title: 'EduPlus Authentication',
      subtitle: 'Scan fingerprint to login',
      description: 'Touch the fingerprint sensor',
      negativeButtonText: 'Cancel',
      negativeButtonTextColor: '#D32F2F',
    };
    
    const result = await RNBiometrics.createSignature({
      promptMessage: 'Sign to authenticate',
      ...biometricConfig,
    });
    
    if (result.success) {
      handleBiometricLogin();
    }
  } catch (error) {
    console.error('Biometric error:', error);
  }
};
```

### Testing on Physical Devices

#### iOS Testing
```
1. Development Device Registration
   ├─ Connect iPhone/iPad
   ├─ Trust the computer
   ├─ Register device in Apple Developer
   └─ Install provisioning profile

2. Build for Device
   ├─ Select device in XCode
   ├─ Build (Cmd+B)
   ├─ Run (Cmd+R)
   └─ View logs

3. Testing Tasks
   ├─ Login/Logout
   ├─ Biometric authentication
   ├─ Notifications
   ├─ Camera integration
   ├─ Offline functionality
   └─ Performance testing
```

#### Android Testing
```
1. Device Setup
   ├─ Enable Developer Mode (tap Build Number 7 times)
   ├─ Enable USB Debugging
   ├─ Connect via USB
   ├─ Authorize computer

2. Build for Device
   ├─ adb devices (verify connection)
   ├─ npm run android
   ├─ Watch for build output
   └─ View logs with adb logcat

3. Testing Tasks
   ├─ Login/Logout
   ├─ Biometric (if supported)
   ├─ Firebase notifications
   ├─ Camera integration
   ├─ Offline functionality
   └─ Performance testing
```

### Development Commands

```bash
# Setup
npm install
npx expo install
npx pod-install  # iOS only

# Development
npm run ios             # Launch iOS simulator
npm run android         # Launch Android emulator
npm run web             # Launch web version

# Build for Distribution
npm run ios:build       # Build iOS app
npm run android:build   # Build Android app
npm run android:aab     # Build Android App Bundle

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests

# Deployment
npm run deploy:ios      # Deploy to App Store
npm run deploy:android  # Deploy to Google Play
```

### Performance Targets for Mobile

| Metric | Target | Notes |
|--------|--------|-------|
| App Launch | < 2s | From icon to dashboard visible |
| Dashboard Load | < 1.5s | With cached data |
| API Response | < 200ms | Over WiFi |
| Login Flow | < 3s | Including biometric auth |
| Page Transition | < 300ms | Smooth 60 FPS animation |
| Bundle Size | < 50MB | iOS + Android combined |
| Memory Usage | < 100MB | Average usage |
| Battery Usage | < 5% | Per hour of use |

### Security for Mobile

```
✅ Certificate Pinning (prevent MITM attacks)
✅ Encrypted local storage
✅ Biometric authentication
✅ Session timeout
✅ API token management
✅ Secure logging
✅ Code obfuscation
✅ Jailbreak/Root detection
✅ Secure networking (TLS 1.3)
✅ App signature verification
```

---

### Phase 2: Dashboard Implementation

#### Student Dashboard
- [ ] Layout matching `Images/Dashboard.jpeg`
- [ ] Statistics cards (Enrolled Classes, Completed Assignments, etc.)
- [ ] My Classes section with course cards
- [ ] Recent Assignments list
- [ ] Grade history chart
- [ ] Attendance tracker
- [ ] Mobile responsive design
- [ ] Export options (PDF, Excel)

#### Super Admin Dashboard
- [ ] Layout matching `Images/Admin.jpeg`
- [ ] System statistics overview
- [ ] User management section
- [ ] School performance metrics
- [ ] Real-time activity log
- [ ] Quick action buttons
- [ ] Mobile responsive design

#### Common Dashboard Components
- [x] Navigation/Sidebar
- [x] User profile dropdown
- [x] Logout functionality
- [ ] Search functionality
- [ ] Filter options
- [ ] Sort options
- [ ] Date range picker
- [ ] Data export

#### Styling & UX
- [ ] Tailwind CSS implementation
- [ ] Dark mode toggle (optional)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Success notifications
- [ ] Form validation feedback
- [ ] Accessibility (WCAG 2.1 AA)

### Phase 3: Mobile App

- [ ] React Native project setup
- [ ] Navigation structure
- [ ] Authentication module
- [ ] Offline data storage
- [ ] Sync mechanism
- [ ] Push notifications
- [ ] Device permissions
- [ ] App store deployment

---

## Testing & Deployment

### Testing Strategy

#### Unit Testing
```bash
npm run test:unit
# Tests for:
- Component rendering
- State management
- Permission logic
- Data transformations
```

#### Integration Testing
```bash
npm run test:integration
# Tests for:
- API endpoints
- Database operations
- Authentication flow
- Permission enforcement
```

#### E2E Testing
```bash
npm run test:e2e
# Tests for:
- Complete user flows
- Multi-role scenarios
- Edge cases
- Performance benchmarks
```

### Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Database migration tested
- [ ] Environment variables configured
- [ ] SSL certificate ready

#### Production Deployment
- [ ] Docker image built
- [ ] Container registry push
- [ ] Load balancer configured
- [ ] CDN setup
- [ ] Monitoring enabled
- [ ] Backup strategy active
- [ ] Rollback plan ready

#### Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all endpoints
- [ ] User acceptance testing
- [ ] Document any issues
- [ ] Schedule optimization

---

## Quick Start Guide

### Development Setup

#### 1. Install Dependencies
```bash
# Install all dependencies
npm run install-all

# Or individually:
npm install --prefix backend
npm install --prefix website
```

#### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Update with your configuration:
BACKEND_PORT=5001
DATABASE_PATH=./data/database.db
JWT_SECRET=your_secret_key
FIREBASE_CONFIG=your_firebase_config
```

#### 3. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or separately:
npm run dev:backend    # Terminal 1 - Port 5001
npm run dev:website    # Terminal 2 - Port 5173
```

#### 4. Access Application
```
Frontend: http://localhost:5173
Backend:  http://localhost:5001/api
```

### Testing Credentials

Use the demo login credentials on the login form:
1. Click a user type (CEO, Principal, etc.)
2. Credentials auto-fill automatically
3. Click "Sign In"
4. Select school(s) if prompted
5. Access dashboard

### Database Management

#### Initialize Database
```bash
npm run seed:backend
```

#### Database Backup
```bash
npm run backup:database
```

#### Database Restore
```bash
npm run restore:database
```

---

## API Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `ACCOUNT_NOT_FOUND` | 404 | User doesn't exist |
| `PERMISSION_DENIED` | 403 | User lacks permission |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `INVALID_TOKEN` | 401 | Token invalid/malformed |
| `SCHOOL_NOT_FOUND` | 404 | School doesn't exist |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Performance Optimization

### Frontend Optimization
- [ ] Code splitting by route
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] CSS minification
- [ ] JavaScript minification
- [ ] Gzip compression
- [ ] Caching strategy
- [ ] Service worker for offline

### Backend Optimization
- [ ] Database indexing
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Redis caching
- [ ] Rate limiting
- [ ] Request compression
- [ ] Response streaming

### Target Performance Metrics
```
Dashboard Load:     < 1.5s
API Response:       < 200ms
Page Transitions:   < 500ms
Database Query:     < 100ms
Time to Interactive: < 2s
Lighthouse Score:   > 90
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Input validation
- [ ] Output encoding
- [ ] Password hashing (bcrypt)
- [ ] JWT token security
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Data encryption

---

## Support & Troubleshooting

### Common Issues

**Issue: 401 Unauthorized Error**
```
Solution: Check if backend server is running (npm run dev:backend)
```

**Issue: CORS Error**
```
Solution: Verify CORS configuration in backend/server.js
```

**Issue: Database Connection Failed**
```
Solution: Check database path and permissions in .env
```

**Issue: Login Auto-fill Not Working**
```
Solution: Clear browser cache and check Login.jsx state management
```

### Getting Help
- Check `QUICK_START.txt` for quick answers
- Review relevant markdown files in project root
- Check API logs: `backend/logs/`
- Check frontend console: Browser DevTools

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Mar 22, 2026 | Full Phase 2 + Dashboard Implementation Guide |
| 1.5.0 | Mar 21, 2026 | CEO Admin Bug Fix + Login Enhancements |
| 1.0.0 | Mar 15, 2026 | Initial Authentication & Admin Hierarchy |

---

## Project Status Summary

```
Phase 1: Authentication & Admin Hierarchy ✅ COMPLETE (100%)
  ├─ Login System                ✅ DONE
  ├─ Admin Hierarchy             ✅ DONE
  ├─ School Selection            ✅ DONE
  ├─ Bug Fixes                   ✅ DONE
  └─ Login UI Enhancements       ✅ DONE

Phase 2: Dashboard Implementation 🚀 IN PROGRESS
  ├─ Student Dashboard           ⏳ READY TO START
  ├─ Admin Dashboard             ⏳ READY TO START
  ├─ UI Components               ⏳ READY TO START
  ├─ Mobile Responsiveness       ⏳ READY TO START
  └─ Data Visualization          ⏳ READY TO START

Phase 3: Mobile App Development ⏳ PLANNED
Phase 4: Advanced Features       ⏳ PLANNED
Phase 5: Deployment & Scaling    ⏳ PLANNED
```

---

## Next Steps

1. **Immediate (This Session)**
   - [ ] Test login with new user type selector
   - [ ] Verify all demo credentials work
   - [ ] Start Student Dashboard implementation
   - [ ] Match layout with provided mockups

2. **Short Term (This Week)**
   - [ ] Complete Admin Dashboard
   - [ ] Implement responsive design
   - [ ] Create reusable dashboard components
   - [ ] Set up testing environment

3. **Medium Term (Next 2 Weeks)**
   - [ ] Mobile app setup
   - [ ] Advanced reporting
   - [ ] User management UI
   - [ ] Bulk operations

---

**📧 Questions?** Check the docs folder or review relevant markdown files.  
**🚀 Ready to code?** Start with Phase 2: Dashboard Implementation!

