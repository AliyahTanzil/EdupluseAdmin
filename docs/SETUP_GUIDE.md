# Eduplus Admin System - Quick Start Guide

## Project Structure

The project is now organized into three main folders:

```
EdupluseAdmin/
├── backend/     → Node.js + Express API Server
├── website/     → React + Vite Web Application  
└── mobile/      → Mobile App (placeholder for future)
```

## Prerequisites

- Node.js 16+ and npm/yarn installed
- Git for version control

## Installation & Setup

### Option A: Set Everything Up at Once

```bash
# From root directory
npm run install-all
```

### Option B: Manual Setup (Recommended for first-time setup)

#### Step 1: Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start at `http://localhost:5000` (or configured port)

#### Step 2: Website Setup (in a new terminal)

```bash
cd website
npm install
npm run dev
```

The website will be available at `http://localhost:5173`

### Option C: Run Both in Parallel

```bash
# From root directory
npm run dev
```

This runs both backend and website simultaneously.

## Directory Overview

### `/backend`
- Express.js REST API server
- Routes for students, teachers, attendance, reports, etc.
- Database configuration (Firebase or local)
- Services for business logic

**Key files:**
- `server.js` - Entry point
- `routes/` - API endpoints
- `services/` - Business logic

**Commands:**
```bash
cd backend
npm run dev     # Start development server
npm start       # Start production server
```

### `/website`
- React + Vite web application
- Components for UI (students, teachers, attendance, etc.)
- Pages for different views (Dashboard, Attendance, Reports, etc.)
- API client for communicating with backend

**Key files:**
- `src/main.jsx` - React entry point
- `src/App.jsx` - Root component
- `src/pages/` - Page components
- `src/components/` - Reusable components

**Commands:**
```bash
cd website
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

### `/mobile`
- Placeholder for mobile app development
- To be filled with React Native or Flutter app

## API Integration

The website automatically connects to the backend API. Make sure both servers are running:

- **Backend API:** `http://localhost:5000` (configurable)
- **Website:** `http://localhost:5173`

The API endpoints are called via the `api.js` service in the website.

## File Structure Details

### Website - `/website/src`

```
src/
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Students.jsx
│   ├── Attendance.jsx
│   └── ...
├── components/         # Reusable components
│   ├── Shared/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── ...
│   └── Attendance/
│       └── ...
├── services/           # API client
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

### Backend - `/backend`

```
backend/
├── routes/             # API routes
│   ├── students.js
│   ├── attendance.js
│   ├── teachers.js
│   └── ...
├── services/           # Business logic
│   └── syncService.js
├── database/           # DB config
│   └── firebase.js
├── server.js           # Entry point
└── package.json
```

## Environment Configuration

### Backend

Create `.env` in `/backend`:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
FIREBASE_CONFIG=your_firebase_config
```

### Website

The website typically doesn't need env vars for development, but you can add `.env` in `/website` if needed:
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Website compilation errors
```bash
cd website
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
- Backend: Change port in `backend/server.js` or `.env`
- Website: Vite will auto-increment port (5174, 5175, etc.)

### API calls failing
1. Ensure backend server is running on correct port
2. Check CORS configuration in `backend/server.js`
3. Verify API endpoints match in `website/src/services/api.js`

## Git Workflow

Each folder has its own node_modules and dependencies. When committing:

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add new attendance feature"

# Push to main
git push origin main
```

## Build & Deployment

### Build Website
```bash
cd website
npm run build
# Creates optimized build in website/dist/
```

### Deploy Website
Deploy the `website/dist/` folder to your hosting (Vercel, Netlify, etc.)

### Deploy Backend
Deploy the `backend/` folder to your server with:
```bash
npm install --production
npm start
```

## Additional Commands

```bash
# Root level
npm run install-all    # Install all dependencies
npm run dev            # Run both backend and website
npm run build          # Build website

# Backend
cd backend && npm run dev

# Website
cd website && npm run dev
cd website && npm run build
cd website && npm run preview
```

## Documentation

For more detailed information, see:
- `PROJECT_STRUCTURE.md` - Complete project structure documentation
- `BACKEND_API_GUIDE.md` - API endpoints documentation
- `QUICK_REFERENCE.md` - Quick reference guide
- Individual README.md files in each folder

## Support

For issues or questions, check the documentation files or review the code comments.

---

**Happy coding! 🚀**
