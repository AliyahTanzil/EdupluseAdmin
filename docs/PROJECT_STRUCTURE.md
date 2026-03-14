# Eduplus Admin System - Project Structure

## Overview

The project is organized into three main folders:

```
EdupluseAdmin/
├── backend/          # Node.js + Express API Server
├── website/          # React + Vite Web Application
└── mobile/           # Mobile Application (placeholder)
```

## Folder Descriptions

### 1. Backend (`/backend`)

The backend API server for the Eduplus Admin System.

**Contents:**
- `server.js` - Main Express server entry point
- `routes/` - API route handlers
  - `attendance.js` - Attendance endpoints
  - `students.js` - Student management endpoints
  - `teachers.js` - Teacher management endpoints
  - `subjects.js` - Subject management endpoints
  - `timetable.js` - Timetable endpoints
  - `classes.js` - Class management endpoints
  - `reports.js` - Report generation endpoints
  - `health.js` - Health check endpoints
  - `devices.js` - Device management endpoints
  - `sync.js` - Data synchronization endpoints

- `services/` - Business logic and services
  - `syncService.js` - Data synchronization service
  
- `database/` - Database configurations
  - `firebase.js` - Firebase configuration
  - `local.js` - Local database setup

- `data/` - Data files and fixtures

- `package.json` - Backend dependencies

**Setup:**
```bash
cd backend
npm install
npm run dev
```

### 2. Website (`/website`)

The React + Vite web application for admin users.

**Contents:**
- `src/` - React source code
  - `components/` - React components
    - `Shared/` - Reusable components
    - `Attendance/` - Attendance-related components
    - `Card.jsx`, `Modal.jsx`, `Navbar.jsx`, `Sidebar.jsx`, `Table.jsx` - Layout components
  
  - `pages/` - Page components
    - `Dashboard.jsx` - Main dashboard
    - `Students.jsx` - Student management
    - `Teachers.jsx` - Teacher management
    - `Subjects.jsx` - Subject management
    - `Attendance.jsx` - Attendance tracking
    - `Timetable.jsx` - Timetable management
    - `Reports.jsx` - Report generation
    - And more...
  
  - `services/` - API client
    - `api.js` - Axios API client
  
  - `App.jsx` - Root component
  - `main.jsx` - Entry point
  - `App.css`, `index.css` - Styling

- `public/` - Static assets
- `index.html` - HTML template
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Frontend dependencies

**Setup:**
```bash
cd website
npm install
npm run dev
```

**Build:**
```bash
npm run build
```

### 3. Mobile (`/mobile`)

Placeholder for mobile application development.

**Setup Instructions:**
To be added as mobile development progresses (React Native/Flutter/etc.)

## Running the Application

### Option 1: Individual Setup

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Website
cd website
npm install
npm run dev
```

### Option 2: Using Root Package.json (if using npm workspaces)

```bash
# Install all dependencies
npm run install-all

# Run both in parallel
npm run dev

# Or run individually
npm run dev:backend
npm run dev:website
```

## Documentation Files

Root-level documentation files provide project-wide information:
- `README.md` - Quick start guide
- `IMPLEMENTATION_ARCHITECTURE.md` - System architecture
- `BACKEND_API_GUIDE.md` - API documentation
- `QUICK_REFERENCE.md` - Quick reference guide
- And more specific guides for different features

## Key Technologies

### Backend
- Node.js
- Express
- Firebase (or local database)

### Website
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios

### Package Manager
- npm workspaces for coordinated dependency management

## Development Workflow

1. Start backend API server (`backend/`)
2. Start website development server (`website/`)
3. Access web app at `http://localhost:5173` (default Vite port)
4. API accessible at `http://localhost:5000` (or configured port)

## Build & Deployment

### Website Build
```bash
cd website
npm run build
# Output in website/dist/
```

### Backend Deployment
Deploy `backend/` folder to your server with:
```bash
npm install --production
npm start
```

---

**Last Updated:** March 14, 2026
