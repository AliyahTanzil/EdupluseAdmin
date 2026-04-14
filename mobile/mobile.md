# 📱 EduPlus Admin – Mobile App Development Guide

> Complete step-by-step commands and architecture to build the mobile app  
> from the existing EduPlus Admin website using **Expo / React Native**.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Install All Dependencies](#2-install-all-dependencies)
3. [Project Structure](#3-project-structure)
4. [Configuration Files](#4-configuration-files)
5. [Navigation Setup](#5-navigation-setup)
6. [Authentication & Biometric Login](#6-authentication--biometric-login)
7. [Role-Based Dashboards](#7-role-based-dashboards)
8. [Attendance with Fingerprint Scanner](#8-attendance-with-fingerprint-scanner)
9. [Core Feature Screens](#9-core-feature-screens)
10. [State Management (Redux)](#10-state-management-redux)
11. [API Services](#11-api-services)
12. [Running the App](#12-running-the-app)
13. [Building for Production](#13-building-for-production)
14. [Full Command Reference](#14-full-command-reference)

---

## 1. Project Setup

```bash
# Navigate to the project root
cd ~/EdupluseAdmin

# Create the mobile directory and initialize Expo
npx create-expo-app mobile --template blank
cd mobile

# Verify Expo is working
npx expo --version
```

---

## 2. Install All Dependencies

### Core Navigation
```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

### State Management
```bash
npm install @reduxjs/toolkit react-redux
```

### Networking & Storage
```bash
npm install axios
npx expo install @react-native-async-storage/async-storage
```

### Biometric Authentication (Fingerprint / Face ID)
```bash
npx expo install expo-local-authentication
```

### UI & Media
```bash
npx expo install @expo/vector-icons
npx expo install expo-font
npx expo install expo-image-picker
npx expo install expo-splash-screen
npx expo install expo-status-bar
```

### Utilities
```bash
npm install date-fns
```

### Dev Dependencies
```bash
npm install --save-dev @babel/core jest jest-expo
```

### Single-Command Install (all at once)
```bash
npx expo install \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated \
  @react-native-async-storage/async-storage \
  expo-local-authentication \
  @expo/vector-icons expo-font expo-image-picker expo-splash-screen expo-status-bar

npm install @reduxjs/toolkit react-redux axios date-fns
npm install --save-dev @babel/core jest jest-expo
```

---

## 3. Project Structure

```
mobile/
├── App.js                          # App entry point
├── index.js                        # Expo entry
├── app.json                        # Expo config (permissions, splash, icons)
├── package.json                    # Dependencies
├── assets/                         # Icons, splash, fonts
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/
    ├── App.js                      # Root component with providers
    ├── navigation/
    │   └── RootNavigator.js        # All navigation stacks & tabs
    ├── screens/
    │   ├── auth/                   # Authentication screens
    │   │   ├── LoginScreen.js          # Email/password + biometric login
    │   │   ├── ForgotPasswordScreen.js
    │   │   ├── ResetPasswordScreen.js
    │   │   └── OtherScreens.js         # Register, role selection
    │   ├── dashboard/
    │   │   └── DashboardScreen.js      # Role-based dashboard router
    │   ├── attendance/
    │   │   ├── AttendanceScreen.js     # View attendance records
    │   │   └── MarkAttendance.js       # Mark attendance with fingerprint
    │   ├── students/
    │   │   ├── StudentsScreen.js       # Student list
    │   │   └── StudentDetailsScreen.js # Individual student view
    │   ├── grades/
    │   │   ├── GradesScreen.js         # View grades
    │   │   └── GradeManagement.js      # Add/edit grades
    │   ├── reports/
    │   │   ├── ReportsScreen.js        # Report list
    │   │   ├── ReportCardScreen.js     # Individual report card
    │   │   └── reportCardData.js       # Report card helpers
    │   ├── schools/
    │   │   ├── SchoolsScreen.js        # School list
    │   │   └── SchoolDetailsScreen.js  # School details
    │   ├── sections/
    │   │   ├── SchoolSectionScreen.js  # School sections
    │   │   ├── SectionDashboardScreen.js
    │   │   └── CreateClassScreen.js    # Create new class
    │   ├── profile/
    │   │   └── ProfileScreen.js        # User profile & photo
    │   └── settings/
    │       └── SettingsScreen.js       # App settings & biometric toggle
    ├── services/
    │   ├── api.js                  # Axios instance & interceptors
    │   ├── authService.js          # Login, logout, register API calls
    │   └── dashboardService.js     # Dashboard data fetching
    ├── redux/
    │   ├── store.js                # Redux store configuration
    │   └── slices/
    │       ├── authSlice.js        # Auth state (user, token, role)
    │       ├── dashboardSlice.js   # Dashboard data state
    │       └── syncSlice.js        # Offline sync state
    ├── components/                 # Reusable UI components
    ├── hooks/                      # Custom React hooks
    ├── types/                      # Type definitions
    └── utils/                      # Utility functions
```

---

## 4. Configuration Files

### app.json – Expo Config (permissions for biometrics, camera)
```jsonc
{
  "expo": {
    "name": "EduPlus Admin",
    "slug": "eduplus-admin",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#3B82F6"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.eduplus.admin",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID for quick login",
        "NSCameraUsageDescription": "Take profile photos for students and staff",
        "NSPhotoLibraryUsageDescription": "Upload profile photos"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3B82F6"
      },
      "package": "com.eduplus.admin",
      "permissions": [
        "USE_BIOMETRIC",
        "USE_FINGERPRINT",
        "CAMERA"
      ]
    },
    "plugins": [
      "expo-local-authentication",
      ["expo-image-picker", {
        "photosPermission": "The app needs access to your photos for profile pictures.",
        "cameraPermission": "The app needs access to your camera to take profile photos."
      }]
    ]
  }
}
```

### babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

---

## 5. Navigation Setup

### src/navigation/RootNavigator.js
```
Auth Stack (unauthenticated)
├── LoginScreen          ← email/password + fingerprint button
├── ForgotPasswordScreen
└── ResetPasswordScreen

Main Tab Navigator (authenticated)
├── Dashboard Tab   → DashboardScreen (role-based content)
├── Attendance Tab  → AttendanceScreen → MarkAttendance (with fingerprint)
├── Students Tab    → StudentsScreen → StudentDetailsScreen
├── Grades Tab      → GradesScreen → GradeManagement
└── More Tab
    ├── Schools     → SchoolsScreen → SchoolDetailsScreen
    ├── Sections    → SchoolSectionScreen → SectionDashboard → CreateClass
    ├── Reports     → ReportsScreen → ReportCardScreen
    ├── Profile     → ProfileScreen
    └── Settings    → SettingsScreen
```

**Navigation commands used:**
```bash
# These were installed in step 2
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
```

---

## 6. Authentication & Biometric Login

### Feature: Multi-Role Login (Admin, Teacher, Student, Parent)

The login system supports **4 user roles**, each routing to a different dashboard:

| Role | Dashboard | Features |
|------|-----------|----------|
| **Admin** (CEO, Principal, VP, etc.) | AdminDashboard | Full school management, user management |
| **Teacher** (Class Teacher, Subject Head, Dept Head) | TeacherDashboard | Attendance, grades, class management |
| **Student** | StudentDashboard | View grades, attendance, timetable |
| **Parent** | ParentDashboard | View child's grades, attendance, reports |

### Feature: Fingerprint / Face ID Login

```javascript
// Key biometric functions using expo-local-authentication

import * as LocalAuthentication from 'expo-local-authentication';

// 1. Check if device supports biometrics
const compatible = await LocalAuthentication.hasHardwareAsync();

// 2. Check if biometrics are enrolled (fingerprint/face saved)
const enrolled = await LocalAuthentication.isEnrolledAsync();

// 3. Get available biometric types
const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
// Returns: [1] = Fingerprint, [2] = Facial Recognition, [3] = Iris

// 4. Authenticate the user
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Login with Fingerprint',
  cancelLabel: 'Use Password',
  disableDeviceFallback: false,       // allow PIN/pattern fallback
  fallbackLabel: 'Use Passcode',
});

if (result.success) {
  // Retrieve saved credentials from AsyncStorage
  // Auto-login the user
}
```

### Login Flow:
```
App Launch
  │
  ├── Check AsyncStorage for saved session token
  │     ├── Token found → Validate with backend → Dashboard
  │     └── Token expired/missing → Login Screen
  │
  └── Login Screen
        ├── Email + Password (all roles)
        ├── 🔐 Fingerprint Button (if biometrics enrolled)
        │     └── Authenticate → Retrieve saved credentials → API login → Dashboard
        └── Forgot Password → Reset flow
```

---

## 7. Role-Based Dashboards

Each role sees a customized dashboard after login:

### Admin Dashboard
- Total students, teachers, schools overview
- User management (add/edit/delete)
- School hierarchy management
- Financial overview
- System settings

### Teacher Dashboard
- Class attendance (mark with fingerprint)
- Grade management
- Class timetable
- Student list
- Report generation

### Student Dashboard
- View attendance record
- View grades & report cards
- View timetable
- Profile settings

### Parent Dashboard
- View child's attendance
- View child's grades & report cards
- Communication with teachers
- School announcements

---

## 8. Attendance with Fingerprint Scanner

### Feature: Biometric Attendance Marking

Teachers can use fingerprint/face ID to verify their identity before marking student attendance. Students can also verify attendance with biometrics.

```javascript
// MarkAttendance.js – Biometric verification flow

import * as LocalAuthentication from 'expo-local-authentication';

// Step 1: Teacher taps "Mark Attendance"
// Step 2: Biometric prompt appears
const verifyTeacher = async () => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Verify identity to mark attendance',
    cancelLabel: 'Cancel',
  });
  
  if (result.success) {
    // Teacher verified – show student list to mark attendance
    // Each student can also optionally scan fingerprint
  }
};

// Step 3: Mark individual students present/absent/late
// Step 4: Submit attendance to backend API
// POST /api/attendance
```

### Attendance Flow:
```
Teacher opens Attendance Tab
  │
  ├── Select Class & Date
  ├── 🔐 Verify with Fingerprint (teacher identity)
  │
  ├── Student List appears
  │   ├── Mark Present  ✅
  │   ├── Mark Absent   ❌
  │   ├── Mark Late     ⏰
  │   └── (Optional) Student fingerprint verification
  │
  └── Submit → POST /api/attendance → Confirmation
```

---

## 9. Core Feature Screens

### Mapped from Website to Mobile

| Website Page | Mobile Screen | Location |
|---|---|---|
| `Login.jsx` | `LoginScreen.js` | `screens/auth/` |
| `Register.jsx` | `OtherScreens.js` | `screens/auth/` |
| `AdminDashboard.jsx` | `DashboardScreen.js` | `screens/dashboard/` |
| `TeacherDashboard.jsx` | `DashboardScreen.js` | `screens/dashboard/` |
| `StudentDashboard.jsx` | `DashboardScreen.js` | `screens/dashboard/` |
| `ParentDashboard.jsx` | `DashboardScreen.js` | `screens/dashboard/` |
| `Attendance.jsx` | `AttendanceScreen.js` | `screens/attendance/` |
| `MarkAttendance.jsx` | `MarkAttendance.js` | `screens/attendance/` |
| `Students.jsx` | `StudentsScreen.js` | `screens/students/` |
| `Grades.jsx` | `GradesScreen.js` | `screens/grades/` |
| `ReportCard.jsx` | `ReportCardScreen.js` | `screens/reports/` |
| `SchoolSelection.jsx` | `SchoolsScreen.js` | `screens/schools/` |
| `ProfileSettings.jsx` | `ProfileScreen.js` | `screens/profile/` |
| `Settings.jsx` | `SettingsScreen.js` | `screens/settings/` |
| `Timetable.jsx` | `PlaceholderScreens.js` | `screens/` |
| `Courses.jsx` | `PlaceholderScreens.js` | `screens/` |
| `Subjects.jsx` | `PlaceholderScreens.js` | `screens/` |
| `Teachers.jsx` | `PlaceholderScreens.js` | `screens/` |

---

## 10. State Management (Redux)

### Setup Commands
```bash
npm install @reduxjs/toolkit react-redux
```

### Store Structure
```
redux/
├── store.js              # configureStore with all slices
└── slices/
    ├── authSlice.js      # user, token, role, isAuthenticated, biometricEnabled
    ├── dashboardSlice.js # dashboard stats per role
    └── syncSlice.js      # offline queue, sync status
```

### Auth Slice State Shape
```javascript
{
  auth: {
    user: null,            // { id, name, email, role, accountType }
    token: null,           // JWT token
    isAuthenticated: false,
    biometricEnabled: false,
    loading: false,
    error: null
  }
}
```

---

## 11. API Services

### Backend Endpoints Used by Mobile App

The mobile app connects to the same backend (`http://localhost:5001`) as the website:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | Login (all roles) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/profile` | Get current user profile |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/students` | List students |
| GET | `/api/students/:id` | Student details |
| GET | `/api/attendance` | Get attendance records |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/grades` | Get grades |
| POST | `/api/grades` | Submit grades |
| GET | `/api/reports` | Get reports |
| GET | `/api/schools` | List schools |
| GET | `/api/teachers` | List teachers |
| GET | `/api/courses` | List courses |
| GET | `/api/subjects` | List subjects |
| GET | `/api/timetable` | Get timetable |
| GET | `/api/classes` | List classes |

### API Service Setup
```javascript
// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',  // Change for production
  timeout: 10000,
});

// Attach token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 12. Running the App

### Development
```bash
# Start Expo dev server
cd ~/EdupluseAdmin/mobile
npx expo start

# Start with specific platform
npx expo start --android      # Android emulator/device
npx expo start --ios          # iOS simulator (macOS only)
npx expo start --web          # Web browser

# Start with tunnel (for physical devices on different network)
npx expo start --tunnel

# Start offline (no Expo account needed)
EXPO_NO_CAPABILITY_SYNC=1 EXPO_OFFLINE=1 npx expo start --offline
```

### Run Together with Backend & Website
```bash
# From project root – starts backend + website + mobile
cd ~/EdupluseAdmin
npm run dev

# Or just backend + website (no mobile)
npm run dev:web
```

### Start Backend Separately (needed for mobile API calls)
```bash
cd ~/EdupluseAdmin/backend
npm run dev
# Backend runs on http://localhost:5001
```

---

## 13. Building for Production

### Using EAS Build (Expo Application Services)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
npx eas login

# Configure build
npx eas build:configure

# Build for Android (APK or AAB)
npx eas build --platform android
npx eas build --platform android --profile preview   # APK for testing

# Build for iOS
npx eas build --platform ios

# Build for both
npx eas build --platform all
```

### Local Build (without EAS)
```bash
# Android APK (requires Android SDK)
npx expo run:android

# iOS (requires Xcode on macOS)
npx expo run:ios
```

### Submit to Stores
```bash
# Submit to Google Play Store
npx eas submit --platform android

# Submit to Apple App Store
npx eas submit --platform ios
```

---

## 14. Full Command Reference

### Quick Setup (from scratch)
```bash
# 1. Create project
cd ~/EdupluseAdmin
npx create-expo-app mobile --template blank
cd mobile

# 2. Install all dependencies
npx expo install \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context react-native-gesture-handler \
  react-native-reanimated @react-native-async-storage/async-storage \
  expo-local-authentication expo-font expo-image-picker expo-splash-screen expo-status-bar \
  @expo/vector-icons

npm install @reduxjs/toolkit react-redux axios date-fns
npm install --save-dev @babel/core jest jest-expo

# 3. Create folder structure
mkdir -p src/{navigation,screens/{auth,dashboard,attendance,students,grades,reports,schools,sections,profile,settings},services,redux/slices,components,hooks,types,utils}

# 4. Start development
npx expo start
```

### Common Development Commands
```bash
# Start dev server
npx expo start

# Clear cache and restart
npx expo start --clear

# Install a new Expo-compatible package
npx expo install <package-name>

# Install a regular npm package
npm install <package-name>

# Check for dependency issues
npx expo doctor

# Update Expo SDK
npx expo install expo@latest

# Run tests
npm test

# Lint code
npm run lint

# Check what's installed
npm list --depth=0
```

### Expo Account Commands
```bash
npx expo login          # Login to Expo
npx expo logout         # Logout from Expo
npx expo whoami         # Check current user
npx expo register       # Create new account
```

---

## Feature Summary

| Feature | Library | Status |
|---------|---------|--------|
| ✅ Multi-role login (Admin, Teacher, Student, Parent) | React Navigation + Redux | Built |
| ✅ Fingerprint / Face ID login | `expo-local-authentication` | Built |
| ✅ Biometric attendance marking | `expo-local-authentication` | Built |
| ✅ Role-based dashboards | React Navigation + Redux | Built |
| ✅ Student management | Axios + Redux | Built |
| ✅ Grade management | Axios + Redux | Built |
| ✅ Report cards | Axios + Redux | Built |
| ✅ School & section management | Axios + Redux | Built |
| ✅ Profile with photo upload | `expo-image-picker` | Built |
| ✅ Offline data persistence | `AsyncStorage` | Built |
| ✅ Session management | Axios interceptors + AsyncStorage | Built |
| ✅ Smooth animations | `react-native-reanimated` | Built |
