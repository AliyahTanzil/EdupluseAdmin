# Dashboard Quick Reference Guide

## Role-Based Dashboard Access

### URLs
- **Admin**: `http://localhost:3000/admin-dashboard`
- **Teacher**: `http://localhost:3000/teacher-dashboard`
- **Student**: `http://localhost:3000/student-dashboard`
- **Parent**: `http://localhost:3000/parent-dashboard`

---

## Dashboard Statistics at a Glance

### Admin Dashboard Stats (6 cards)
| Stat | Purpose | Data Source |
|------|---------|-------------|
| Total Students | System-wide student count | GET /api/students |
| Total Teachers | System-wide teacher count | GET /api/teachers |
| Total Classes | Calculated from students/30 | Calculated |
| Attendance Today | Present vs absent count | GET /api/attendance/today |
| Pending Tasks | Admin tasks requiring action | Mock data (3) |
| System Health | Overall system status | Mock data (Good) |

### Teacher Dashboard Stats (6 cards)
| Stat | Purpose | Data Source |
|------|---------|-------------|
| My Classes | Classes taught by this teacher | Filtered by teacher ID |
| Total Students | Students across all classes | Aggregated from classes |
| My Subjects | Subjects assigned to teacher | Filtered by teacher ID |
| Attendance Today | Class attendance snapshot | GET /api/attendance/today |
| Average Attendance % | Class average attendance rate | Calculated from records |
| Assignments | Active assignments count | Mock data (12) |

### Student Dashboard Stats (6 cards)
| Stat | Purpose | Data Source |
|------|---------|-------------|
| Enrolled Subjects | Student's subject count | GET /api/subjects |
| Attendance Rate % | Student's attendance percentage | GET /api/attendance |
| Average Grade | Student's overall grade | Mock data (A) |
| GPA | Student's grade point average | Mock data (3.8) |
| Classes | Classes enrolled in | Mock data (5) |
| Upcoming Tests | Tests in next 2 weeks | Mock data (3) |

### Parent Dashboard Stats (6 cards)
| Stat | Purpose | Data Source |
|------|---------|-------------|
| My Children | Number of children enrolled | Filtered by parent ID |
| Attendance Average % | Average across all children | Aggregated attendance |
| Grade Average | Average grade across children | Mock data (A-) |
| Notifications | Total notifications count | Mock data (5) |
| School Events | Upcoming events count | Mock data (4) |
| Academic Concerns | Concerns flagged for children | Mock data (0) |

---

## Common Features by Dashboard

| Feature | Admin | Teacher | Student | Parent |
|---------|-------|---------|---------|--------|
| Statistics Cards | ✓ | ✓ | ✓ | ✓ |
| Profile Dropdown | ✓ | ✓ | ✓ | ✓ |
| Logout Button | ✓ | ✓ | ✓ | ✓ |
| Action Grid | ✓ (10) | ✓ (6) | ✓ (8) | ✓ (8) |
| Real-time Data | ✓ | ✓ | ✓ | ✓ |
| Role Indicator | Super Admin | Class Master | Class | - |

---

## Action Items by Role

### Admin Dashboard (10 Actions)
1. **Students** - Manage all students
2. **Teachers** - Manage all teachers
3. **Subjects** - Manage curriculum
4. **Timetable** - Manage schedules
5. **Attendance** - View attendance records
6. **Mark Attendance** - Mark daily attendance
7. **Courses** - Manage courses
8. **Reports** - Generate & export reports
9. **Devices** - Manage biometric devices
10. **Settings** - System configuration

### Teacher Dashboard (6 Actions)
1. **My Subjects** - View/manage subjects
2. **My Classes** - View classes teaching
3. **Mark Attendance** - Mark student attendance
4. **Attendance Records** - View history
5. **Class Students** - Manage class students
6. **Assignment Reports** - View submissions
- *Plus Class Grades if Class Master*

### Student Dashboard (8 Actions)
1. **My Profile** - View personal info
2. **My Grades** - View grades
3. **My Subjects** - View enrolled subjects
4. **My Teachers** - View teacher info
5. **Attendance** - View attendance record
6. **Class Timetable** - View schedule
7. **Assignments** - Submit assignments
8. **Report Card** - Download report

### Parent Dashboard (8 Actions)
1. **My Children** - View children info
2. **Children Grades** - View children's grades
3. **Attendance Records** - View attendance
4. **Messages** - Communicate with teachers
5. **Notifications** - View alerts
6. **School Events** - View events calendar
7. **Teacher Contact** - Get teacher contact
8. **Report Cards** - Download reports

---

## Component Structure

```
Dashboard (Parent Component)
├── Header Section
│   ├── Title & Welcome Message
│   ├── Profile Dropdown Menu
│   └── Logout Button
├── Statistics Section
│   └── Grid of Stat Cards (1-6 cards per role)
│       ├── Card Icon
│       ├── Stat Value
│       └── Trend Indicator
└── Action Items Grid
    └── Card per Function
        ├── Gradient Icon Container
        ├── Title
        └── Description
```

---

## Color Coding Scheme

### Stat Card Colors
- **Blue**: Basic info (students, profiles)
- **Green**: Success/Positive (teachers, attendance high)
- **Purple**: Academic (subjects, grades)
- **Orange**: Action/Warning (attendance, tasks)
- **Red**: Critical/Alert (concerns, absent)
- **Cyan**: System/Tech (health, systems)
- **Pink**: Events/Social (notifications, events)

### Gradient Backgrounds
```
Admin    : from-X-500 to-X-600
Teacher  : from-X-500 to-X-600
Student  : from-X-500 to-X-600
Parent   : from-X-500 to-X-600
```

---

## API Integration Points

### Fetch Pattern Used:
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:5000/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

### Required Backend Endpoints:
- `GET /api/students` - List all students
- `GET /api/teachers` - List all teachers
- `GET /api/subjects` - List all subjects
- `GET /api/attendance` - Attendance records
- `GET /api/attendance/today` - Today's attendance

---

## Data Caching & Refresh

- **Initial Load**: Data fetched on component mount via `useEffect`
- **Refresh Strategy**: No auto-refresh (can be added in future)
- **Error Handling**: Falls back to mock data if API fails
- **Loading State**: Tracked via `loading` state variable

---

## Responsive Breakpoints

- **Mobile** (< 768px): 1 column stat cards
- **Tablet** (768px - 1024px): 2 column stat cards
- **Desktop** (> 1024px): 3-4 column stat cards

Grid classes used: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## State Management

Each dashboard maintains:
- `user` - From AuthContext (name, role, class, etc.)
- `stats` - Local state for statistics
- `loading` - Boolean for loading state
- `showProfileMenu` - Boolean for dropdown visibility

---

## Route Protection

All dashboards are protected by `ProtectedRoute` component:
```javascript
<ProtectedRoute requiredRoles={['role']}>
  <DashboardComponent />
</ProtectedRoute>
```

---

## Known Limitations & Future Improvements

### Current Limitations:
- Statistics update only on page load
- Mock data for some fields (assignments, events)
- No real-time notifications
- No chart visualizations

### Future Enhancements:
- Real-time stat updates every 30 seconds
- WebSocket for live notifications
- Chart.js integration for data visualization
- Export dashboard as PDF
- Dark mode support
- Multi-language support
- Custom dashboard themes

---

## Troubleshooting

### Statistics Not Loading:
1. Check backend server is running
2. Verify API endpoints are accessible
3. Check AuthToken in localStorage
4. Check browser console for errors

### Profile Dropdown Not Working:
1. Ensure click-outside detection is working
2. Check z-index values (should be 50+)
3. Verify onClick handlers are properly bound

### Styling Issues:
1. Verify Tailwind CSS is compiled
2. Check class names for typos
3. Ensure lucide-react icons are installed

### Role Access Issues:
1. Verify user role in AuthContext
2. Check ProtectedRoute configuration
3. Ensure localStorage has correct user data

---

*Last Updated: March 16, 2026*
*Dashboard Version: 1.0*
