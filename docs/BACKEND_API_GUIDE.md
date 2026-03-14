# Backend API Documentation

Complete API documentation for EduPlus Admin backend system with offline/online sync capabilities.

## Base URL

```
http://localhost:5000/api
```

## Overview

All endpoints return JSON responses with the following format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
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

---

## Students API

### Get All Students
- **URL:** `GET /students`
- **Query Parameters:**
  - `limit` (default: 50) - Number of records to return
  - `offset` (default: 0) - Number of records to skip
- **Response:** Returns array of students with total count

```bash
curl http://localhost:5000/api/students?limit=10&offset=0
```

### Get Student by ID
- **URL:** `GET /students/:id`
- **Response:** Returns single student object

```bash
curl http://localhost:5000/api/students/123e4567-e89b-12d3-a456-426614174000
```

### Create Student
- **URL:** `POST /students`
- **Body:**
```json
{
  "name": "John Doe",
  "roll": "A001",
  "class": "10-A",
  "email": "john@school.com",
  "phone": "+1234567890",
  "parent_phone": "+0987654321",
  "address": "123 Main St",
  "date_of_birth": "2005-01-15"
}
```
- **Required Fields:** `name`, `roll`, `class`, `email`, `phone`

### Update Student
- **URL:** `PUT /students/:id`
- **Body:** Any fields to update (same as create)

```bash
curl -X PUT http://localhost:5000/api/students/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","class":"10-B"}'
```

### Delete Student
- **URL:** `DELETE /students/:id`
- **Note:** Soft delete - records are not permanently removed

```bash
curl -X DELETE http://localhost:5000/api/students/123e4567-e89b-12d3-a456-426614174000
```

---

## Teachers API

### Get All Teachers
- **URL:** `GET /teachers`
- **Query Parameters:**
  - `subject_id` - Filter by subject
  - `class_filter` - Filter by assigned class
  - `limit` (default: 50)
  - `offset` (default: 0)

### Get Teacher by ID
- **URL:** `GET /teachers/:id`

### Create Teacher
- **URL:** `POST /teachers`
- **Body:**
```json
{
  "name": "Dr. Smith",
  "email": "smith@school.com",
  "phone": "+1234567890",
  "subject_id": "subject-uuid",
  "qualification": "M.Sc Computer Science",
  "experience": 5,
  "classes_assigned": "10-A,10-B",
  "hire_date": "2020-01-01",
  "status": "active"
}
```
- **Required Fields:** `name`, `email`, `phone`, `subject_id`

### Update Teacher
- **URL:** `PUT /teachers/:id`
- **Body:** Any fields to update

### Delete Teacher
- **URL:** `DELETE /teachers/:id`

---

## Attendance API

### Get Attendance Records
- **URL:** `GET /attendance`
- **Query Parameters:**
  - `date` - Filter by specific date (YYYY-MM-DD)
  - `class_name` - Filter by class
  - `student_id` - Filter by student
  - `limit` (default: 100)
  - `offset` (default: 0)

```bash
curl "http://localhost:5000/api/attendance?date=2024-03-07&class_name=10-A"
```

### Mark Attendance for Student
- **URL:** `POST /attendance/mark`
- **Body:**
```json
{
  "student_id": "student-uuid",
  "class": "10-A",
  "date": "2024-03-07",
  "morning_status": "present",
  "afternoon_status": "present",
  "remarks": "Regular attendance",
  "marked_by": "teacher-uuid"
}
```
- **Status Values:** `present`, `absent`, `leave`
- **Required Fields:** `student_id`, `class`, `date`

### Mark Bulk Attendance
- **URL:** `POST /attendance/bulk`
- **Body:**
```json
{
  "class": "10-A",
  "date": "2024-03-07",
  "marked_by": "teacher-uuid",
  "records": [
    {
      "student_id": "uuid1",
      "morning_status": "present",
      "afternoon_status": "present"
    },
    {
      "student_id": "uuid2",
      "morning_status": "absent",
      "afternoon_status": "present"
    }
  ]
}
```

### Get Student Attendance
- **URL:** `GET /attendance/student/:studentId`
- **Query Parameters:**
  - `limit` (default: 100)
  - `offset` (default: 0)

### Get Class Attendance for Date
- **URL:** `GET /attendance/class/:className`
- **Query Parameters:**
  - `date` (required) - Date in YYYY-MM-DD format

```bash
curl "http://localhost:5000/api/attendance/class/10-A?date=2024-03-07"
```

### Update Attendance Record
- **URL:** `PUT /attendance/:id`
- **Body:**
```json
{
  "morning_status": "leave",
  "afternoon_status": "present",
  "remarks": "Doctor appointment"
}
```

### Delete Attendance Record
- **URL:** `DELETE /attendance/:id`

---

## Timetable API

### Get All Timetable Entries
- **URL:** `GET /timetable`
- **Query Parameters:**
  - `class` - Filter by class
  - `day` - Filter by day (Monday-Saturday)
  - `teacher_id` - Filter by teacher
  - `limit` (default: 100)
  - `offset` (default: 0)

### Get Class Timetable
- **URL:** `GET /timetable/class/:className`
- **Returns:** All periods for the class

```bash
curl http://localhost:5000/api/timetable/class/10-A
```

### Get Day Timetable
- **URL:** `GET /timetable/class/:className/day/:day`
- **Example Days:** Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

```bash
curl http://localhost:5000/api/timetable/class/10-A/day/Monday
```

### Get Teacher Schedule
- **URL:** `GET /timetable/teacher/:teacherId`
- **Returns:** All periods assigned to the teacher

### Create Period
- **URL:** `POST /timetable/period`
- **Body:**
```json
{
  "class": "10-A",
  "day": "Monday",
  "period_number": 1,
  "start_time": "09:00",
  "end_time": "09:45",
  "subject_id": "subject-uuid",
  "teacher_id": "teacher-uuid",
  "room_number": "101"
}
```
- **Required Fields:** `class`, `day`, `period_number`, `start_time`, `end_time`, `subject_id`, `teacher_id`
- **Validation:** Prevents time conflicts for the same class

### Update Period
- **URL:** `PUT /timetable/period/:id`
- **Body:** Fields to update
- **Note:** Validates time conflicts with other periods

### Delete Period
- **URL:** `DELETE /timetable/period/:id`

---

## Subjects API

### Get All Subjects
- **URL:** `GET /subjects`
- **Query Parameters:**
  - `category` - Filter by category
  - `limit` (default: 100)
  - `offset` (default: 0)

### Get Subject by ID
- **URL:** `GET /subjects/:id`

### Create Subject
- **URL:** `POST /subjects`
- **Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "description": "Basic Mathematics",
  "credit_hours": 3,
  "category": "Science"
}
```
- **Required Fields:** `name`, `code`

### Update Subject
- **URL:** `PUT /subjects/:id`
- **Body:** Fields to update

### Delete Subject
- **URL:** `DELETE /subjects/:id`

---

## Reports API

### Generate Attendance Report
- **URL:** `POST /reports/attendance`
- **Body:**
```json
{
  "class": "10-A",
  "start_date": "2024-03-01",
  "end_date": "2024-03-31",
  "student_id": "optional-uuid"
}
```
- **Returns:** Attendance statistics with percentages
- **Required Fields:** `class`, `start_date`, `end_date`

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": "uuid",
      "name": "John Doe",
      "roll": "A001",
      "total_days": 20,
      "present_days": 18,
      "absent_days": 2,
      "leave_days": 0,
      "attendance_percentage": "90.00"
    }
  ],
  "summary": {
    "class": "10-A",
    "period": "2024-03-01 to 2024-03-31",
    "total_students": 45
  }
}
```

### Generate Performance Report
- **URL:** `POST /reports/performance`
- **Body:**
```json
{
  "class": "10-A",
  "date": "2024-03-07"
}
```
- **Returns:** Daily class attendance statistics

### Export Report
- **URL:** `POST /reports/export`
- **Body:**
```json
{
  "report_type": "attendance",
  "class": "10-A",
  "start_date": "2024-03-01",
  "end_date": "2024-03-31",
  "format": "json"
}
```
- **Report Types:** `attendance`, `students`, `timetable`
- **Formats:** `json` (CSV support coming)

---

## Devices API

### Get All Devices
- **URL:** `GET /devices`
- **Query Parameters:**
  - `status` - Filter by status (online, offline, inactive, error)
  - `location` - Filter by location
  - `limit` (default: 50)
  - `offset` (default: 0)

### Get Device by ID
- **URL:** `GET /devices/:id`

### Register Device
- **URL:** `POST /devices/register`
- **Body:**
```json
{
  "device_id": "BIO-001",
  "name": "Main Gate Biometric",
  "location": "Main Entrance",
  "device_type": "biometric"
}
```
- **Required Fields:** `device_id`, `name`, `location`
- **Device Types:** `biometric`, `camera`, `gate-controller`

### Update Device Status
- **URL:** `PUT /devices/:id/status`
- **Body:**
```json
{
  "status": "online"
}
```
- **Status Values:** `online`, `offline`, `inactive`, `error`

### Update Device Details
- **URL:** `PUT /devices/:id`
- **Body:** Fields to update (name, location, device_type)

### Delete Device
- **URL:** `DELETE /devices/:id`

### Get Device Sync Logs
- **URL:** `GET /devices/:deviceId/sync-logs`
- **Query Parameters:**
  - `limit` (default: 50)
  - `offset` (default: 0)
- **Returns:** Sync history for the device

---

## Sync API

### Sync All Pending Records
- **URL:** `POST /sync/sync-all`
- **Response:**
```json
{
  "success": true,
  "synced_records": 15,
  "failed_records": 0,
  "message": "Sync completed successfully"
}
```

### Get Sync Status
- **URL:** `GET /sync/status`
- **Response:**
```json
{
  "success": true,
  "data": {
    "total_pending": 5,
    "total_synced": 145,
    "total_failed": 2,
    "last_sync": "2024-03-07T10:30:00Z"
  }
}
```

### Check Connection Status
- **URL:** `GET /sync/connection-status`
- **Response:**
```json
{
  "success": true,
  "online": true,
  "firebase_connected": true
}
```

### Batch Sync Records
- **URL:** `POST /sync/batch-sync`
- **Body:**
```json
{
  "records": [
    {
      "table_name": "students",
      "action": "INSERT",
      "record_id": "uuid1"
    },
    {
      "table_name": "attendance",
      "action": "UPDATE",
      "record_id": "uuid2"
    }
  ]
}
```

---

## Health API

### Health Check
- **URL:** `GET /health`
- **Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-03-07T10:30:00Z"
}
```

### Readiness Check
- **URL:** `GET /health/ready`
- **Response:**
```json
{
  "success": true,
  "ready": true,
  "database": "connected",
  "firebase": "connected"
}
```

---

## Error Codes

| Code | Message | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Check request parameters |
| 404 | Not Found | Verify ID/endpoint |
| 409 | Conflict | Resource already exists or schedule conflict |
| 500 | Server Error | Retry later or contact support |
| 0 | Offline | Check internet connection, data cached |

---

## Offline Behavior

When the backend is offline:

1. **Data is saved locally** in SQLite database
2. **Operations recorded** in sync_logs table
3. **Frontend uses cached data** from localStorage
4. **When online**, records automatically sync to Firebase
5. **Conflicts resolved** using timestamp-based strategy (latest wins)

---

## Rate Limiting

Currently no rate limits implemented. Production deployment should include:
- IP-based rate limiting
- User-based rate limiting
- Request throttling per endpoint

---

## Pagination

All list endpoints support pagination:

```bash
curl "http://localhost:5000/api/students?limit=20&offset=40"
```

- First page: `offset=0, limit=20`
- Second page: `offset=20, limit=20`
- Third page: `offset=40, limit=20`

---

## Common Query Patterns

### Get today's attendance
```bash
curl "http://localhost:5000/api/attendance/class/10-A?date=$(date +%Y-%m-%d)"
```

### Get all active teachers
```bash
curl "http://localhost:5000/api/teachers?limit=100"
```

### Get weekly timetable
```bash
curl "http://localhost:5000/api/timetable/class/10-A"
```

### Sync status check
```bash
curl http://localhost:5000/api/sync/status
```

---

## Frontend Integration

Use the provided frontend API service (`/src/services/api.js`) for all API calls:

```javascript
import { studentsAPI, attendanceAPI, syncAPI } from '@/services/api';

// Get students
const students = await studentsAPI.getAll({ limit: 50 });

// Mark attendance
const result = await attendanceAPI.mark({
  student_id: 'uuid',
  class: '10-A',
  date: '2024-03-07',
  morning_status: 'present'
});

// Check sync status
const status = await syncAPI.getStatus();
```

---

## Support & Troubleshooting

### API not responding
1. Check backend is running: `npm run dev` in `/backend`
2. Verify API_URL in frontend `.env`
3. Check port 5000 is not blocked

### Sync issues
1. Check internet connection
2. Verify Firebase credentials in `.env`
3. Check sync logs: `GET /sync/status`

### Database errors
1. Ensure `/backend/database/data` directory exists
2. Delete `eduplus.db` to reset database
3. Restart backend server

---

## Version History

- **v1.0.0** (2024-03-07) - Initial release with full CRUD operations and sync system
