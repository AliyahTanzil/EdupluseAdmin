# Quick Start: School Hierarchy Admin Filtering

## What Was Implemented

A complete role-based access control system where different admin types see and manage different schools:

| Admin Type | Schools Visible | Selection UI | Use Case |
|-----------|-----------------|--------------|----------|
| **Regular Admin** | 1 school | Dropdown | Single school manager |
| **Principal** | Junior + Senior Secondary | Checkboxes | Multi-level manager |
| **CEO** | All schools (Primary + Junior + Senior) | Checkboxes | Super admin |
| **Secretary** | 1 school level | Dropdown | Level-specific admin |
| **Finance** | All schools (finance only) | View-only | Finance management |

## Files Modified

### Frontend
```
website/src/config/schoolHierarchy.js ← NEW FILE
  Contains all access rules and utility functions

website/src/pages/Register.jsx ← UPDATED
  Added admin type selection and dynamic school UI
```

### Backend
```
backend/routes/auth.js ← UPDATED
  Register endpoint now accepts adminType & assignedSchools
```

## How to Use

### For Creating a New Admin Account

1. **Go to Register page** → Select "Admin" role
2. **Choose Admin Type** from dropdown:
   - Regular Admin (manages 1 school)
   - Principal (manages 2+ schools)
   - CEO (manages all schools)
   - Secretary (manages 1 level)
   - Finance (manages finances across all)
3. **Select Schools** based on type:
   - Single-select types: Choose one from dropdown
   - Multi-select types: Check multiple schools
4. **Submit** → User created with proper access scope

### For Developers: Using the Utility Functions

```javascript
import { 
  ADMIN_TYPES, 
  canViewMultipleSchools,
  getAllowedSchoolLevels,
  filterDataByAdminType 
} from '../config/schoolHierarchy';

// Check if admin type manages multiple schools
if (canViewMultipleSchools(adminType)) {
  // Show checkbox grid for multiple selection
} else {
  // Show single dropdown
}

// Get allowed school levels for an admin type
const levels = getAllowedSchoolLevels(adminType);
// Returns: ['primary', 'junior_secondary', 'senior_secondary']

// Filter data by admin type and schools
const filteredData = filterDataByAdminType(
  studentList, 
  'principal', 
  ['junior_secondary', 'senior_secondary']
);
```

## Database Schema (User Record)

```javascript
{
  id: "123456",
  email: "admin@school.com",
  password: "hashed_password",
  name: "Admin Name",
  role: "admin",
  phone: "+1-800-xxx-xxxx",
  
  // NEW FIELDS for school hierarchy
  adminType: "principal",           // Type of admin
  assignedSchools: [                // Schools they manage
    "junior_secondary",
    "senior_secondary"
  ],
  isSuperUser: false,              // true only for CEO
  
  createdAt: "2024-01-15T10:30:00Z"
}
```

## Frontend Form Flow

```
Register Page
  ↓
Role Selection = "Admin"
  ↓
Admin Type Dropdown appears
  (Regular Admin | Principal | CEO | Secretary | Finance)
  ↓
User selects type
  ↓
School Selection UI appears
  (Dropdown for single-select OR Checkboxes for multi-select)
  ↓
User selects schools
  ↓
Form validation confirms:
  - adminType is selected ✓
  - At least one school is selected ✓
  ↓
Submit → Backend receives all fields → User created
```

## What Happens During Registration

### Frontend (Register.jsx)
1. User fills in name, email, password
2. User selects "Admin" role
3. Admin Type dropdown appears (5 options)
4. User selects an admin type
5. School selection UI appears (different for each type)
6. User selects schools
7. Form validates all required fields
8. Submits with: `adminType` + `assignedSchools`

### Backend (auth.js)
1. Receives registration data including new fields
2. Validates `adminType` is provided
3. Validates `assignedSchools` is array (or empty)
4. Creates user record with:
   - `adminType` field
   - `assignedSchools` array
   - `isSuperUser` flag (if CEO)
5. Returns user with JWT token

### Result
User stored with full admin hierarchy context for later filtering

## Next Phase: Data Filtering

Once dashboard is updated, all API responses will be filtered based on admin type:

```
GET /api/students
  ← Filtered by admin's assigned schools

GET /api/teachers  
  ← Filtered by admin's assigned schools

GET /api/courses
  ← Filtered by admin's assigned schools

GET /api/finance
  ← Only if Finance admin type
```

## Validation Rules

```javascript
// These validations are enforced:

1. Admin role requires adminType selection
   → Error: "Please select admin account type"

2. Principal role requires at least 1 school
   → Error: "Please select at least one school"

3. Regular Admin requires school level
   → Error: "Please select a school level"

4. Secretary role requires school level
   → Error: "Please select a school level"

5. Finance role requires school selection (all visible)
   → Can select multiple or none (default to all)
```

## Admin Type Characteristics

### 🎯 Regular Admin
- Single school only
- Limited module access
- Cannot see other schools' data
- Configuration: `canViewMultiple: false`

### 👨‍🎓 Principal
- Multiple schools: Junior + Senior Secondary
- Expanded module access
- Management capabilities for both levels
- Configuration: `canViewMultiple: true`

### 👑 CEO
- All schools: Primary + Junior + Senior Secondary
- Complete system access
- Super admin capabilities
- Configuration: `isSuperUser: true`, `canViewMultiple: true`

### 📋 Secretary
- Single school level only
- Limited secretarial functions
- Level-specific scope
- Configuration: `canViewMultiple: false`

### 💰 Finance Officer
- All schools visible
- Finance data only
- Financial management across system
- Configuration: `canViewMultiple: true`, `financeOnly: true`

## Testing the Feature

### Test Case 1: Register Regular Admin
```
1. Role: Admin
2. Admin Type: Regular Admin
3. School: Senior Secondary
✓ Should create user with assignedSchools: []
  (single school stored in schoolLevel field)
```

### Test Case 2: Register Principal
```
1. Role: Admin
2. Admin Type: Principal
3. Schools: ✓ Junior Secondary, ✓ Senior Secondary
✓ Should create user with assignedSchools: 
  ['junior_secondary', 'senior_secondary']
```

### Test Case 3: Register CEO
```
1. Role: Admin
2. Admin Type: CEO
3. Schools: All checked
✓ Should create user with isSuperUser: true
✓ assignedSchools: ['primary', 'junior_secondary', 'senior_secondary']
```

### Test Case 4: Validation Error
```
1. Role: Admin
2. Admin Type: [empty]
✗ Should show error: "Please select admin account type"
✗ Submit button disabled/form not sent
```

## File Reference Guide

| File | Purpose | Changes |
|------|---------|---------|
| `schoolHierarchy.js` | Config & utils | Created |
| `Register.jsx` | Account creation form | Updated imports, validation, UI |
| `auth.js` | Backend registration | Updated to accept new fields |

## Key Functions in schoolHierarchy.js

```javascript
getAllowedSchoolLevels(adminType)
  → Returns: string[] of allowed school levels

canViewMultipleSchools(adminType)
  → Returns: boolean (true if multi-select)

getSchoolOptionsForAdminType(adminType)
  → Returns: {label, value, disabled}[] for UI

filterDataByAdminType(data, adminType, schools)
  → Returns: filtered data array

getDashboardViewForAdminType(adminType)
  → Returns: dashboard modules configuration

validateAdminTypeSelection(currentType, selectedType)
  → Returns: boolean (can create?)
```

## Common Issues & Solutions

### Issue: Admin type dropdown not appearing
**Solution**: Check that role is set to "admin" first

### Issue: School selection not changing UI
**Solution**: Make sure `canViewMultipleSchools()` returns correct boolean

### Issue: Form validation bypassed
**Solution**: Verify validation rules are in handleSubmit() before register()

### Issue: Backend not storing adminType
**Solution**: Check auth.js register endpoint has new fields in destructuring

## Status

✅ **COMPLETE** - Ready for dashboard integration  
✅ Form accepts and validates admin types  
✅ Backend stores admin types and school assignments  
✅ Utility functions ready for use  
🔄 **NEXT**: Update dashboard to filter data by admin type

---

**For Questions or Issues**: Check SCHOOL_HIERARCHY_IMPLEMENTATION_COMPLETE.md for detailed documentation
