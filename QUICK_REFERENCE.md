# Quick Reference - Button Navigation Map

## All Functional Buttons & Their Routes

### 📊 Dashboard (/dashboard)
```
[Add New Student] → /students
[Generate Report] → /export-reports  
[Manage Timetable] → /timetable
```

### 👥 Student Dashboard (/student-dashboard)
**Class Cards (for each class)**
```
[📋 Attendance] → /class/:classId/attendance
[🕐 Timetable] → /class/:classId/timetable
[📚 Subjects] → /class/:classId/subjects
```

### 📅 Class Attendance Page (/class/:classId/attendance)
```
[Back] → /student-dashboard
[Export Report] → /export-reports
[Mark Attendance] → /class/:classId/mark-attendance
```

### ✏️ Mark Attendance Page (/class/:classId/mark-attendance)
```
[Back to Attendance] → /class/:classId/attendance
[Export] → /export-reports
[Manage Devices] → /manage-devices
[Mark Morning Attendance] → ALERT (ready for backend)
[Mark Afternoon Attendance] → ALERT (ready for backend)
[Send SMS] → ALERT (ready for backend)
```

### 📈 Attendance Management (/attendance)
```
[Export Report] → /export-reports
[Manage Devices] → /manage-devices
[Mark Morning Attendance] → ALERT (ready for backend)
[Mark Afternoon Attendance] → ALERT (ready for backend)
[Send SMS Notifications] → ALERT (ready for backend)
```

### 📄 Export Reports (/export-reports)
```
[Download Report] → ALERT (ready for backend)
[Preview] → Shows report preview
```

### ⚙️ Manage Devices (/manage-devices)
```
[Add Device] → MODAL dialog to add device
[Toggle Online/Offline] → Updates device status (mock)
[Delete Device] → Removes device from list (mock)
```

---

## Class ID Reference

| Class | ID |
|-------|-----|
| 10-A  | 1   |
| 10-B  | 2   |
| 9-A   | 3   |
| 9-B   | 4   |
| 11-A  | 5   |
| 11-B  | 6   |

**Example URLs:**
- `/class/1/attendance` → 10-A Attendance
- `/class/1/mark-attendance` → 10-A Mark Attendance
- `/class/1/timetable` → 10-A Timetable
- `/class/1/subjects` → 10-A Subjects

---

## Development Tips

### Adding New Navigation
```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  // Navigate to a route
  const handleClick = () => {
    navigate('/export-reports');
    // OR navigate to class-specific route
    navigate(`/class/${classId}/attendance`);
  };
  
  return <button onClick={handleClick}>Go</button>;
};
```

### Accessing Route Parameters
```javascript
import { useParams } from 'react-router-dom';

const MyComponent = () => {
  const { classId } = useParams();
  
  // classId will be '1', '2', '3', etc.
  console.log(classId);
};
```

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented & functional |
| 📋 | Uses mock data, ready for backend |
| ⚠️ | Partial implementation |
| 🔧 | Needs backend integration |

---

## Current Implementation Status

```
✅ Navigation routing: COMPLETE
✅ Class-specific pages: COMPLETE  
✅ Export Reports page: COMPLETE
✅ Manage Devices page: COMPLETE
✅ Mark Attendance page: COMPLETE
📋 Mock data: All pages have mock data
🔧 Backend integration: Ready for implementation
```

---

## Next Steps for Developers

1. **Backend Setup**
   - Create API endpoints for export, devices, attendance marking
   - Set up database schema for reports and devices

2. **API Integration**
   - Update pages to fetch real data from backend
   - Implement POST/PUT/DELETE operations

3. **Authentication** 
   - Add auth tokens to API calls
   - Implement role-based access control

4. **Real-time Features**
   - Add WebSocket for live device status
   - Implement real-time attendance updates

---

Generated: March 7, 2026
Last Updated: Latest Build
