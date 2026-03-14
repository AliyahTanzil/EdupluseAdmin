# API Integration Guide

## Overview

This guide explains how the EdupluseAdmin frontend integrates with the Express.js backend API. All API calls are centralized in `/src/services/api.js` for consistency and maintainability.

## Architecture

### API Layer Structure

```
src/services/
├── api.js                    # All API endpoints grouped by module
└── axios.js (optional)       # Axios instance configuration
```

### Backend URL

- **Base URL**: `http://localhost:5000`
- **API Prefix**: `/api`
- Full endpoint example: `http://localhost:5000/api/students`

## API Service Organization

The `src/services/api.js` file exports multiple API modules organized by feature:

```javascript
export const studentsAPI = { getAll(), getById(), create(), update(), delete(), ... }
export const teachersAPI = { getAll(), getById(), create(), update(), delete(), ... }
export const subjectsAPI = { getAll(), getById(), create(), update(), delete(), ... }
export const coursesAPI = { getAll(), getById(), create(), update(), delete(), ... }
export const classesAPI = { getAll(), getById(), create(), update(), getStudents(), ... }
export const timetableAPI = { getByClass(), create(), update(), delete(), ... }
export const attendanceAPI = { getByClass(), markBulk(), ... }
export const devicesAPI = { getAll(), create(), update(), delete(), toggleStatus(), ... }
export const reportsAPI = { generate(), export(), ... }
```

## Standard Response Format

All API endpoints follow this response format:

```javascript
{
  success: true/false,
  data: [],                 // Array or object, null on error
  message: "Success/Error message",
  totalCount: 100,          // For paginated endpoints
  currentPage: 1,           // For paginated endpoints
  pageSize: 50              // For paginated endpoints
}
```

## Common Patterns

### 1. List/Fetch Operations

**Pattern**: Get all records with pagination

```javascript
// Basic list
const response = await studentsAPI.getAll({ limit: 50, offset: 0 });

if (response.success) {
  const students = response.data;
  const total = response.totalCount;
} else {
  console.error(response.message);
}
```

**Typical Usage**:
```javascript
useEffect(() => {
  loadStudents();
}, []);

const loadStudents = async () => {
  try {
    setLoading(true);
    const response = await studentsAPI.getAll({ limit: 50, offset: 0 });
    if (response.success) {
      setStudents(response.data);
    } else {
      setError(response.message);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. Create Operations

**Pattern**: POST with form data

```javascript
const payload = {
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  address: "123 Main St"
};

const response = await studentsAPI.create(payload);

if (response.success) {
  setSuccess(true);
  // Redirect or refresh list
  navigate('/students');
} else {
  setError(response.message);
}
```

**Validation Checklist**:
- ✅ Check all required fields are provided
- ✅ Validate data types before sending
- ✅ Show loading state during request
- ✅ Handle success with redirect/toast
- ✅ Handle error with error alert

### 3. Update Operations

**Pattern**: PUT with pre-populated data

```javascript
const payload = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "9876543210",
  address: "456 Oak Ave"
};

const response = await studentsAPI.update(1, payload);

if (response.success) {
  setSuccess(true);
  setTimeout(() => navigate('/students'), 1500);
} else {
  setError(response.message);
}
```

**Key Points**:
- Always fetch current data first to pre-populate form
- Only send changed fields or entire object
- Validate before sending
- Show confirmation on success

### 4. Delete Operations

**Pattern**: DELETE with confirmation

```javascript
if (window.confirm('Are you sure you want to delete this record?')) {
  try {
    const response = await studentsAPI.delete(id);
    if (response.success) {
      setSuccess(true);
      await loadStudents(); // Refresh list
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(response.message);
    }
  } catch (err) {
    setError(err.message);
  }
}
```

**Best Practices**:
- Always show confirmation dialog
- Show loading state during deletion
- Refresh list after successful deletion
- Show success alert
- Handle errors gracefully

### 5. Filtered/Conditional Operations

**Pattern**: Fetch with filters

```javascript
// Get students by class
const response = await studentsAPI.getByClass(classId, { limit: 50, offset: 0 });

// Get attendance by class with date range
const response = await attendanceAPI.getByClass(classId, {
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31',
  studentId: null,
  limit: 50,
  offset: 0
});

// Get timetable by class
const response = await timetableAPI.getByClass(classId);
```

## Error Handling Strategy

### Expected Error Scenarios

```javascript
try {
  const response = await studentsAPI.getAll();
  
  // Check API success flag
  if (!response.success) {
    setError(response.message); // "Student not found" or similar
    return;
  }
  
  // Process successful response
  setStudents(response.data);
  
} catch (err) {
  // Network errors, parsing errors, etc.
  setError(err.message || 'An error occurred');
}
```

### Error Display Components

```javascript
// Show error alert
{error && <ErrorAlert message={error} onClose={() => setError(null)} />}

// Show success alert
{success && <SuccessAlert message="Record saved successfully!" onClose={() => {}} />}

// Show loading state
{loading && <LoadingSpinner message="Loading..." />}
```

## Loading States

### Best Practice Pattern

```javascript
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);

// For fetching/initial load
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    const response = await api.getAll();
    // ... process response
  } finally {
    setLoading(false);
  }
};

// For form submission
const handleSubmit = async () => {
  try {
    setSaving(true);
    const response = await api.create(formData);
    // ... process response
  } finally {
    setSaving(false);
  }
};
```

### Button States

```javascript
<Button
  onClick={handleSubmit}
  disabled={saving}
  className="flex items-center gap-2"
>
  {saving ? (
    <>
      <Loader size={18} className="animate-spin" />
      Saving...
    </>
  ) : (
    <>
      <Save size={18} />
      Save Changes
    </>
  )}
</Button>
```

## Pagination Implementation

### Standard Pagination Pattern

```javascript
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 50;

useEffect(() => {
  loadStudents();
}, [currentPage]);

const loadStudents = async () => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const response = await studentsAPI.getAll({ 
    limit: ITEMS_PER_PAGE, 
    offset 
  });
  
  if (response.success) {
    setStudents(response.data);
    setTotalCount(response.totalCount);
  }
};

const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
```

### Pagination UI

```javascript
<div className="flex justify-between items-center mt-6">
  <Button 
    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
    disabled={currentPage === 1}
  >
    Previous
  </Button>
  
  <span className="text-gray-600">
    Page {currentPage} of {totalPages}
  </span>
  
  <Button 
    onClick={() => setCurrentPage(p => p + 1)}
    disabled={currentPage === totalPages}
  >
    Next
  </Button>
</div>
```

## Bulk Operations

### Bulk Marking Attendance Example

```javascript
const payload = {
  classId: 1,
  date: "2024-01-22",
  session: "morning",
  records: [
    { studentId: 1, status: 'present' },
    { studentId: 2, status: 'absent' },
    { studentId: 3, status: 'present' }
  ]
};

const response = await attendanceAPI.markBulk(payload);
```

## Authentication & Headers

Currently, the API doesn't require authentication headers. When authentication is added in Phase 3+:

```javascript
// Store token in localStorage
localStorage.setItem('authToken', token);

// Send with each request
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};
```

## API Functions Reference

### Students Module
- `getAll(params)` - Get all students
- `getById(id)` - Get single student
- `getByClass(classId, params)` - Get students by class
- `create(data)` - Create new student
- `update(id, data)` - Update student
- `delete(id)` - Delete student

### Teachers Module
- `getAll(params)` - Get all teachers
- `getById(id)` - Get single teacher
- `create(data)` - Create new teacher
- `update(id, data)` - Update teacher
- `delete(id)` - Delete teacher

### Subjects Module
- `getAll(params)` - Get all subjects
- `getById(id)` - Get single subject
- `create(data)` - Create new subject
- `update(id, data)` - Update subject
- `delete(id)` - Delete subject

### Courses Module
- `getAll(params)` - Get all courses
- `getById(id)` - Get single course
- `create(data)` - Create new course
- `update(id, data)` - Update course
- `delete(id)` - Delete course

### Classes Module
- `getAll(params)` - Get all classes
- `getById(id)` - Get single class
- `getStudents(classId, params)` - Get students in class

### Timetable Module
- `getByClass(classId)` - Get timetable for class
- `create(data)` - Create timetable entry
- `update(id, data)` - Update timetable entry
- `delete(id)` - Delete timetable entry

### Attendance Module
- `getByClass(classId, params)` - Get attendance records
- `markBulk(data)` - Mark attendance for multiple students

### Devices Module
- `getAll(params)` - Get all devices
- `create(data)` - Add new device
- `update(id, data)` - Update device
- `delete(id)` - Delete device
- `toggleStatus(id)` - Toggle device online/offline

### Reports Module
- `generate(payload)` - Generate report
- `export(payload)` - Export report

## Common Mistakes to Avoid

### ❌ Not handling errors
```javascript
// BAD
const data = await studentsAPI.getAll();
setStudents(data); // Crashes if error
```

### ✅ Proper error handling
```javascript
// GOOD
const response = await studentsAPI.getAll();
if (response.success) {
  setStudents(response.data);
} else {
  setError(response.message);
}
```

### ❌ Not showing loading state
```javascript
// BAD
setStudents(await studentsAPI.getAll());
```

### ✅ With loading state
```javascript
// GOOD
setLoading(true);
try {
  const response = await studentsAPI.getAll();
  if (response.success) {
    setStudents(response.data);
  }
} finally {
  setLoading(false);
}
```

### ❌ Direct response usage
```javascript
// BAD
const students = await studentsAPI.getAll();
students.map(s => console.log(s.name)); // May fail
```

### ✅ Checking success first
```javascript
// GOOD
const response = await studentsAPI.getAll();
if (response.success && response.data) {
  response.data.map(s => console.log(s.name));
}
```

## Testing API Integration

### Mock API Responses
```javascript
// Example test setup
const mockResponse = {
  success: true,
  data: [{ id: 1, name: 'John' }],
  totalCount: 1
};

jest.mock('../services/api', () => ({
  studentsAPI: {
    getAll: jest.fn(() => Promise.resolve(mockResponse))
  }
}));
```

## Performance Considerations

1. **Pagination**: Always use limit/offset for large datasets
2. **Caching**: Consider caching frequently fetched data
3. **Debouncing**: Debounce search/filter operations
4. **Lazy Loading**: Load data on-demand, not all at once

## Future Enhancements

- Add request/response interceptors for logging
- Implement token refresh logic
- Add request retry mechanism
- Cache layer for repeated requests
- Real-time updates with WebSocket (Phase 3)
