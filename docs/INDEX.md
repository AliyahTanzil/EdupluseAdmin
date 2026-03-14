# 📋 Eduplus Admin System - Project Index

## Quick Navigation

### 🔑 Start Here
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** ← Start with this for setup instructions
- **[README.md](README.md)** - Project overview
- **[RESTRUCTURING_SUMMARY.md](RESTRUCTURING_SUMMARY.md)** - What changed

### 📚 Detailed Documentation
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete folder organization
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick reference guide
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Quick start
- **[BACKEND_API_GUIDE.md](BACKEND_API_GUIDE.md)** - API endpoints
- **[IMPLEMENTATION_ARCHITECTURE.md](IMPLEMENTATION_ARCHITECTURE.md)** - System design

---

## Project Structure

```
EdupluseAdmin/
│
├── 📁 backend/                 ← Express.js REST API
│   ├── routes/                 ← API endpoints
│   ├── services/               ← Business logic
│   ├── database/               ← Database configuration
│   ├── server.js               ← Entry point
│   ├── package.json
│   └── README.md
│
├── 📁 website/                 ← React + Vite web app
│   ├── src/
│   │   ├── pages/              ← Page components
│   │   ├── components/         ← Reusable components
│   │   ├── services/           ← API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
├── 📁 mobile/                  ← Mobile app (placeholder)
│   └── README.md
│
├── package.json                ← Root workspace config
├── SETUP_GUIDE.md              ← Setup instructions (READ THIS FIRST!)
├── PROJECT_STRUCTURE.md        ← Detailed structure
├── RESTRUCTURING_SUMMARY.md    ← What changed
├── README.md                   ← Quick overview
└── (other documentation files)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

**Option 1: Quick Start**
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Website  
cd website && npm install && npm run dev
```

**Option 2: Using Root Workspace**
```bash
npm run install-all    # Install all dependencies
npm run dev            # Run both simultaneously
```

---

## 📖 Available Commands

### From Root Directory
```bash
npm run install-all    # Install all dependencies
npm run dev            # Run both backend and website
npm run dev:backend    # Run only backend
npm run dev:website    # Run only website
npm run build          # Build website for production
```

### Backend Commands
```bash
cd backend
npm run dev            # Start development server
npm start              # Start production server
```

### Website Commands
```bash
cd website
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

---

## 🎯 Key Folders

### Backend (`/backend`)
- **Entry Point:** `server.js`
- **Routes:** `routes/` - API endpoints for all features
- **Logic:** `services/` - Business logic layer
- **Database:** `database/` - DB configuration

### Website (`/website`)
- **Entry Point:** `src/main.jsx` → `src/App.jsx`
- **Pages:** `src/pages/` - Full-page components
- **Components:** `src/components/` - Reusable UI components
- **API Client:** `src/services/api.js` - Backend communication
- **Styling:** Tailwind CSS + CSS modules

### Mobile (`/mobile`)
- Placeholder for future mobile app development
- To be filled with React Native or Flutter app

---

## 🔗 API Integration

The website communicates with the backend API:

```javascript
// Example: src/services/api.js
const API_BASE_URL = 'http://localhost:5000';

// Backend runs on http://localhost:5000
// Website runs on http://localhost:5173
```

---

## 📱 Features

### Students Module
- Add/Edit/Delete students
- Student list with filters
- Student dashboard

### Attendance Module
- Mark attendance for classes
- View attendance records
- Generate attendance reports

### Teachers Module
- Add/Edit/Delete teachers
- Teacher management

### Subjects Module
- Manage subjects
- Subject assignment to classes

### Timetable Module
- Create and manage class timetables
- Schedule management

### Reports Module
- Generate various reports
- Export functionality

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Firebase/Local Database** - Data storage
- **Axios** - HTTP client

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 📋 Documentation Files

| File | Purpose |
|------|---------|
| SETUP_GUIDE.md | Complete setup and configuration |
| PROJECT_STRUCTURE.md | Detailed folder organization |
| RESTRUCTURING_SUMMARY.md | Restructuring details |
| README.md | Quick overview |
| BACKEND_API_GUIDE.md | API endpoints documentation |
| QUICK_REFERENCE.md | Quick reference |
| IMPLEMENTATION_ARCHITECTURE.md | System design |

---

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change port in `.env` or `backend/server.js`
- Website: Vite auto-increments (5174, 5175, etc.)

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
1. Check backend is running on correct port
2. Verify CORS settings in `backend/server.js`
3. Check API endpoints in `website/src/services/api.js`

---

## 🔄 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Website** (in another terminal)
   ```bash
   cd website && npm run dev
   ```

3. **Access Website**
   - Open browser to `http://localhost:5173`

4. **Make Changes**
   - Edit files in `backend/` or `website/`
   - Both use hot reload for instant updates

5. **Build for Production**
   ```bash
   cd website && npm run build
   ```

---

## 📦 Deployment

### Website Deployment
```bash
cd website
npm run build
# Deploy website/dist/ to hosting (Vercel, Netlify, etc.)
```

### Backend Deployment
```bash
# Deploy backend/ folder to server
npm install --production
npm start
```

---

## 🤝 Contributing

Each folder operates independently:
- **Backend Changes:** Modify files in `/backend`
- **Frontend Changes:** Modify files in `/website`
- **Mobile Changes:** Work in `/mobile` when ready

---

## 📞 Support

For detailed information:
1. Read the relevant documentation files
2. Check code comments in the source files
3. Review the QUICK_REFERENCE.md for common tasks

---

## ✅ Checklist

- [ ] Read SETUP_GUIDE.md
- [ ] Install dependencies in both folders
- [ ] Start backend server
- [ ] Start website server
- [ ] Test API connectivity
- [ ] Begin development

---

**Last Updated:** March 14, 2026
**Project Status:** Ready for Development ✅
