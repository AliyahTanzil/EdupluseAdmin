# EduPlus Admin Backend API

Complete backend API with offline/online synchronization capability for school management system.

## Architecture

```
Backend Structure:
├── database/
│   ├── local.js              # SQLite local database
│   └── firebase.js           # Firebase Realtime Database
├── services/
│   └── syncService.js        # Sync logic between local and online
├── routes/
│   ├── students.js           # Student CRUD operations
│   ├── teachers.js           # Teacher management
│   ├── attendance.js         # Attendance marking
│   ├── timetable.js          # Timetable management
│   ├── subjects.js           # Subject management
│   ├── reports.js            # Report generation
│   ├── devices.js            # Biometric device management
│   ├── sync.js               # Sync operations
│   └── health.js             # Health check
└── server.js                 # Main entry point
```

## Technology Stack

### Local Database
- **SQLite3** (better-sqlite3) - Fast, serverless, file-based database
- Perfect for offline functionality
- Zero configuration required
- Automatic migrations included

### Online Database
- **Firebase Realtime Database** - Free tier available
- Real-time synchronization
- Automatic backup
- No server infrastructure needed

### Backend Framework
- **Node.js + Express** - Lightweight and fast
- RESTful API design
- CORS enabled for frontend communication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
LOCAL_DB_PATH=./database/data/eduplus.db

# Firebase Configuration (Optional for offline mode)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@firebase.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### Step 3: Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student/:studentId` - Get student attendance

### Timetable
- `GET /api/timetable` - Get timetable
- `POST /api/timetable/period` - Create period
- `PUT /api/timetable/period/:id` - Update period
- `DELETE /api/timetable/period/:id` - Delete period

### Synchronization
- `POST /api/sync/sync-all` - Sync all pending records
- `GET /api/sync/status` - Get sync status
- `GET /api/sync/connection-status` - Check online/offline status
- `POST /api/sync/batch-sync` - Batch sync records

### Health Check
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check

## Offline/Online Sync Strategy

### How It Works

1. **Offline Mode**
   - All data is saved to local SQLite database
   - Changes are tracked in `sync_logs` table
   - User can continue working without internet

2. **Online Mode**
   - When connection is available, pending records sync to Firebase
   - Automatic conflict resolution (latest timestamp wins)
   - Records marked as synced after successful upload

3. **Automatic Sync**
   - Sync occurs every 5 minutes (configurable)
   - Manual sync available via `/api/sync/sync-all`
   - Frontend can check connection status

### Sync Flow

```
User Action (Create/Update/Delete)
    ↓
Save to Local DB (SQLite)
    ↓
Log to sync_logs table with 'pending' status
    ↓
[Connection Available?]
    ├─ YES → Push to Firebase → Mark as 'synced'
    └─ NO  → Wait for connection → Retry when online
```

## Firebase Setup (Optional)

### Get Free Firebase Realtime Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (free)
3. Enable "Realtime Database"
4. Create service account key:
   - Project Settings → Service Accounts
   - Generate new private key
   - Copy credentials to `.env` file

### Alternative: Offline-Only Mode

If you don't want to use Firebase:
- Just use local SQLite
- Comment out Firebase initialization
- Data will sync only when you integrate a backend later

## Database Schema

### Students Table
```sql
id, name, roll, class, email, phone, parent_phone, 
address, date_of_birth, photo_url, created_at, updated_at, 
synced_at, is_deleted
```

### Attendance Table
```sql
id, student_id, class, date, morning_status, afternoon_status,
remarks, marked_by, created_at, updated_at, synced_at, is_deleted
```

### Timetable Table
```sql
id, class, day, period_number, start_time, end_time, 
subject_id, teacher_id, room_number, created_at, updated_at, 
synced_at, is_deleted
```

### Sync Logs Table
```sql
id, table_name, action, record_id, status, error_message, 
created_at, synced_at
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Performance Tips

1. **Database Indexing**
   - Indexes are created on frequently queried columns
   - Add more indexes as needed based on usage patterns

2. **Batch Operations**
   - Use `/api/sync/batch-sync` for multiple records
   - Reduces network calls

3. **Pagination**
   - Use `limit` and `offset` query parameters
   - Example: `/api/students?limit=50&offset=0`

## Next Steps

1. **Frontend Integration**
   - Update API endpoints in frontend `.env`
   - Point to `http://localhost:5000`

2. **Complete Implementations**
   - Teachers endpoints
   - Attendance marking with biometric devices
   - Report generation
   - Device management

3. **Authentication**
   - Add JWT authentication
   - Role-based access control (RBAC)

4. **Data Validation**
   - Add express-validator for all endpoints
   - Implement business logic validation

5. **Testing**
   - Unit tests for services
   - Integration tests for API routes
   - Sync mechanism testing

## Troubleshooting

### Database locked error
- Close all connections to the database
- Restart the server

### Firebase connection issues
- Check internet connection
- Verify Firebase credentials in `.env`
- Check Firebase Realtime Database rules

### Sync not working
- Check `/api/sync/status` endpoint
- Verify connection with `/api/sync/connection-status`
- Check server logs for errors

## License

MIT License - Feel free to use this backend for your projects!

## Support

For issues and questions, please check the documentation or create an issue in the repository.
