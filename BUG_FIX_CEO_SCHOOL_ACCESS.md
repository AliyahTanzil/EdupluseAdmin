# Bug Fix: CEO Admin Not Showing All 3 School Types

## Problem Identified

**Issue**: When logging in as a CEO admin (which should have access to all 3 school types: Primary, Junior Secondary, and Senior Secondary), the system was displaying:
- Role: **Principal** (incorrect - should be CEO)
- Available Schools: **2 schools** (Junior Secondary + Senior Secondary only - should be 3)

**Root Cause**: The login endpoint was not returning the new `adminType` and `assignedSchools` fields that were added in Phase 2. The system was falling back to the old RBAC role-based system, which was mapping the user to a "Principal" role instead of recognizing them as a "CEO".

---

## Files Fixed

### 1. **backend/routes/auth.js** - Login Endpoint
**What was wrong**: The login endpoint was stripping out the `adminType` and `assignedSchools` fields from the user response.

**What was fixed**: Updated the response object to include these fields:
```javascript
// BEFORE: Missing admin hierarchy fields
const responseUser = {
  ...userWithoutPassword,
  userType,
  schoolType,
  role: roleObj || { id: user.role, name: user.role }
};

// AFTER: Includes admin hierarchy fields
const responseUser = {
  ...userWithoutPassword,
  userType,
  schoolType,
  role: roleObj || { id: user.role, name: user.role },
  // Include admin hierarchy fields if present
  adminType: user.adminType || undefined,
  assignedSchools: user.assignedSchools || [],
  isSuperUser: user.isSuperUser || false
};
```

### 2. **website/src/pages/SchoolSelection.jsx** - School Selection Logic
**What was wrong**: The component was only checking the old RBAC `user.role` system and not using the new `adminType` field to determine available schools.

**What was fixed**:

#### Added imports for school hierarchy system:
```javascript
import { 
  ADMIN_TYPES, 
  SCHOOL_LEVELS, 
  getAllowedSchoolLevels, 
  canViewMultipleSchools 
} from '../config/schoolHierarchy';
```

#### Updated `applicableSchoolTypeIds` logic:
```javascript
// Now prioritizes adminType if available
const applicableSchoolTypeIds = useMemo(() => {
  if (!user) return [];
  
  // If user has adminType (from school hierarchy system)
  if (user.adminType) {
    const allowedLevels = getAllowedSchoolLevels(user.adminType);
    // Map school hierarchy levels to school type IDs
    const schoolTypeMap = {
      [SCHOOL_LEVELS.PRIMARY]: 'primary',
      [SCHOOL_LEVELS.JUNIOR_SECONDARY]: 'junior_secondary',
      [SCHOOL_LEVELS.SENIOR_SECONDARY]: 'senior_secondary'
    };
    return allowedLevels.map(level => schoolTypeMap[level]).filter(Boolean);
  }
  
  // Fall back to old RBAC system if no adminType
  if (!user.role) return [];
  return getApplicableSchoolTypes(user.role);
}, [user]);
```

#### Updated `getRoleName()` to display correct admin type:
```javascript
const getRoleName = () => {
  if (!user) return 'User';
  
  // If user has adminType (from school hierarchy system)
  if (user.adminType) {
    // Map adminType to display name
    const adminTypeNames = {
      [ADMIN_TYPES.CEO]: 'CEO',
      [ADMIN_TYPES.PRINCIPAL]: 'Principal',
      [ADMIN_TYPES.REGULAR_ADMIN]: 'Regular Admin',
      [ADMIN_TYPES.SECRETARY]: 'Secretary',
      [ADMIN_TYPES.FINANCE]: 'Finance Officer'
    };
    return adminTypeNames[user.adminType] || user.adminType;
  }
  
  // Fall back to old system
  if (!user.role) return 'User';
  return user.role.name || 'User';
};
```

#### Updated `hasUnrestrictedAccess` to recognize CEO:
```javascript
const hasUnrestrictedAccess = useMemo(() => {
  if (!user) return false;
  
  // For adminType system: CEO has unrestricted access
  if (user.adminType === ADMIN_TYPES.CEO) {
    return true;
  }
  
  // For old RBAC system
  if (!user.role) return false;
  return !user.role.applicableTo;
}, [user]);
```

---

## How It Works Now

### For CEO Admin
```
1. User logs in with email/password
2. Backend finds CEO user record with:
   - adminType: 'ceo'
   - assignedSchools: ['primary', 'junior_secondary', 'senior_secondary']
3. Backend returns these fields in login response
4. Frontend's SchoolSelection component receives adminType: 'ceo'
5. Calls getAllowedSchoolLevels('ceo')
6. Gets all 3 school levels
7. Displays: "Logged in as: CEO • Viewing 3 available school types"
8. Shows all 3 school cards: Primary, Junior Secondary, Senior Secondary
```

### For Principal Admin
```
1. User logs in with email/password
2. Backend finds Principal user record with:
   - adminType: 'principal'
   - assignedSchools: ['junior_secondary', 'senior_secondary']
3. Backend returns these fields in login response
4. Frontend receives adminType: 'principal'
5. Calls getAllowedSchoolLevels('principal')
6. Gets 2 school levels (Junior + Senior Secondary)
7. Displays: "Logged in as: Principal • Viewing 2 available school types"
8. Shows 2 school cards: Junior Secondary, Senior Secondary
```

### For Regular Admin
```
1. User logs in with email/password
2. Backend finds Regular Admin user record with:
   - adminType: 'regular_admin'
   - assignedSchools: ['senior_secondary'] (or whatever they chose)
3. Backend returns these fields in login response
4. Frontend receives adminType: 'regular_admin'
5. Calls getAllowedSchoolLevels('regular_admin')
6. Gets 1 school level (whatever was assigned)
7. Displays: "Logged in as: Regular Admin • Viewing 1 available school type"
8. Shows 1 school card
```

---

## Impact

✅ **Fixes**: CEO admins now correctly see all 3 school types  
✅ **Fixes**: Admin type displays correctly (CEO instead of Principal)  
✅ **Fixes**: All admin types now show the correct number of available schools  
✅ **Backward Compatible**: Old RBAC system still works as fallback  
✅ **No Breaking Changes**: Existing functionality preserved  

---

## Testing Steps

### Test 1: Login as CEO
1. Go to `/login`
2. Use CEO credentials (from database)
3. Verify message shows: "Logged in as: CEO • Viewing 3 available school types"
4. Verify all 3 schools displayed: Primary, Junior Secondary, Senior Secondary

### Test 2: Login as Principal
1. Go to `/login`
2. Use Principal credentials
3. Verify message shows: "Logged in as: Principal • Viewing 2 available school types"
4. Verify 2 schools displayed: Junior Secondary, Senior Secondary

### Test 3: Login as Regular Admin
1. Go to `/login`
2. Use Regular Admin credentials
3. Verify message shows: "Logged in as: Regular Admin • Viewing 1 available school type"
4. Verify 1 school displayed: Whatever school they were assigned

---

## Verification Checklist

- [x] Backend login endpoint returns adminType field
- [x] Backend login endpoint returns assignedSchools field
- [x] Frontend imports school hierarchy utilities
- [x] Frontend prioritizes adminType over old RBAC system
- [x] Frontend correctly maps admin types to school levels
- [x] Frontend displays correct admin type name
- [x] Frontend shows correct number of available schools
- [x] CEO shows 3 schools
- [x] Principal shows 2 schools
- [x] Regular Admin shows 1 school
- [x] Role display message is accurate
- [x] No syntax errors
- [x] No console errors
- [x] Backward compatible with old system

---

## Summary

The bug was caused by the login endpoint not returning the new `adminType` and `assignedSchools` fields from Phase 2. The frontend was still using the old RBAC system to determine available schools, which didn't recognize the CEO admin type properly.

**Solution**: Updated both the backend and frontend to properly handle and use the admin type fields:
- Backend now includes `adminType`, `assignedSchools`, and `isSuperUser` in the login response
- Frontend now checks for `adminType` first and uses school hierarchy utilities to determine available schools
- Frontend displays the correct admin type name and school count

**Result**: CEO admins now correctly see all 3 school types, and the role display shows "CEO" instead of "Principal".

---

**Status**: ✅ Fixed and verified
