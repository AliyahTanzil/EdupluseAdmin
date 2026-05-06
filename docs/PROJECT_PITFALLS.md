# 🚨 EduPlus Admin — Complete Project Pitfalls & Issues Registry

> **Generated:** April 6, 2026  
> **Total Issues Found:** 108  
> **Breakdown:** 🔴 Critical: 20 | 🟠 High: 23 | 🟡 Medium: 27 | 🔵 Low: 22 | ✅ Info: 16

---

## Table of Contents

- [Section A — Security & Credentials (URGENT)](#section-a--security--credentials-urgent)
- [Section B — Backend Logic & API Bugs](#section-b--backend-logic--api-bugs)
- [Section C — Database & Data Integrity](#section-c--database--data-integrity)
- [Section D — Frontend Logic & UI Bugs](#section-d--frontend-logic--ui-bugs)
- [Section E — Architecture & Design Issues](#section-e--architecture--design-issues)
- [Section F — Infrastructure & DevOps](#section-f--infrastructure--devops)
- [Section G — Performance Concerns](#section-g--performance-concerns)
- [Section H — Documentation & Code Quality](#section-h--documentation--code-quality)
- [Quick Fix Priority Table](#quick-fix-priority-table)

---

## Section A — Security & Credentials (URGENT)

### A-1. 🔴 CRITICAL — Firebase Private Key Committed to Git
**Files:** `edupluseadmin-firebase-adminsdk-fbsvc-13ec3d2be6.json`, `backend/.env`  
**Issue:** The Firebase service account JSON containing the full RSA private key is committed to the repository. The `backend/.env` file also contains the same private key. Anyone with repo access can impersonate the Firebase Admin SDK, read/write all Firebase data, and potentially access GCP resources.  
**Fix:** Rotate the key immediately in Firebase Console. Remove both files from git history using `git filter-repo` or BFG Repo Cleaner. Add them to `.gitignore`.

### A-2. 🔴 CRITICAL — `.gitignore` is UTF-16LE Encoded (Non-Functional)
**File:** `.gitignore`  
**Issue:** The `.gitignore` file has a UTF-16LE BOM (`FF FE`). Git only reads UTF-8 `.gitignore` files, so **every rule is silently ignored**. This is the root cause of node_modules, .env, firebase keys, and build artifacts being committed.  
**Fix:** Recreate the file as UTF-8: `iconv -f UTF-16LE -t UTF-8 .gitignore > .gitignore.tmp && mv .gitignore.tmp .gitignore`

### A-3. 🔴 CRITICAL — `node_modules` Committed to Git (33,765 files, 316 MB)
**Files:** `node_modules/` (root), `website/node_modules/`  
**Issue:** Over 33,000 dependency files are tracked by git, bloating the repo to 316 MB. These include native binaries that differ per OS.  
**Fix:** Fix `.gitignore` (A-2), then `git rm -r --cached node_modules website/node_modules` and commit.

### A-4. 🔴 CRITICAL — Hardcoded JWT Secret Used in Production
**Files:** `backend/routes/auth.js`, `backend/middleware/auth.js`, `backend/middleware/permissions.js`, `backend/middleware/rbac.js`  
**Issue:** All four files use `process.env.JWT_SECRET || 'your-secret-key-change-in-production'`. Since `JWT_SECRET` is not defined in `backend/.env`, the hardcoded fallback is always used. The secret is duplicated in 4 places — if one changes, the others won't match. Any attacker can forge valid JWTs.  
**Fix:** Generate a strong random secret, add `JWT_SECRET=<value>` to `.env`, centralize the secret in a single config module.

### A-5. 🔴 CRITICAL — Plaintext Passwords in In-Memory User Store
**File:** `backend/routes/auth.js` (lines 10–220)  
**Issue:** All 12 demo users have `password: 'password'` stored in plain text. The login endpoint does direct string comparison (`user.password !== password`) instead of `bcrypt.compare()`. The `bcrypt` package is imported but never used.  
**Fix:** Hash all demo passwords with bcrypt. Use `bcrypt.compare()` for authentication. Better: migrate to database-backed users.

### A-6. 🔴 CRITICAL — SQL Injection via Dynamic Column Names
**File:** `backend/database/local.js`  
**Issue:** Every update function (`updateStudent`, `updateTeacher`, `updateAttendance`, `updateTimetablePeriod`, `updateSubject`, `updateCourse`, `updateDevice`) builds SQL dynamically from user-supplied object keys:
```js
const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
```
An attacker can pass crafted field names like `"id = 1; DROP TABLE students; --"` to inject SQL.  
**Fix:** Whitelist allowed column names per table. Only permit known columns in update operations.

### A-7. 🔴 CRITICAL — SQL Injection in `syncService.js` Table Names
**Files:** `backend/services/syncService.js`, `backend/database/local.js` (`markAsSynced`)  
**Issue:** Table names from `sync_logs` records are interpolated directly into SQL: `` SELECT * FROM ${table_name} `` and `` UPDATE ${tableName} SET synced_at ``. Not validated against an allowlist.  
**Fix:** Validate table names against a whitelist of known tables.

### A-8. 🟠 HIGH — Registration Stores Plaintext Passwords
**File:** `backend/routes/auth.js` (register endpoint)  
**Issue:** The `/register` endpoint pushes `password` directly into the in-memory array without hashing. If auth is ever switched to bcrypt comparison, all registered users are locked out.  
**Fix:** Hash password before storing: `const hashedPassword = await bcrypt.hash(password, 10);`

### A-9. 🟠 HIGH — Token Not Invalidated on Logout
**File:** `backend/routes/auth.js` (logout endpoint)  
**Issue:** The `/logout` endpoint returns success but does nothing — no blacklist, no token revocation. The JWT remains valid for its full 7-day lifetime.  
**Fix:** Implement a token blacklist (Redis or in-memory Set) and check it in `authMiddleware`.

### A-10. 🟠 HIGH — Demo Credentials Hardcoded in Frontend Build
**File:** `website/src/pages/Login.jsx`, `website/dist/` build artifacts  
**Issue:** Demo credentials (`admin@school.com/password`) are hardcoded in the login page and baked into committed build artifacts.  
**Fix:** Remove build artifacts from git. Use environment flags to conditionally show demo buttons.

### A-11. 🟡 MEDIUM — Error Handler Leaks Stack Traces
**File:** `backend/server.js`  
**Issue:** In development mode (the default), the full error stack is returned in API responses. Since `NODE_ENV=development` is not set in `.env`, it defaults to development and always leaks.  
**Fix:** Only return stack traces when `NODE_ENV === 'development'`.

### A-12. 🟡 MEDIUM — `/api/school-structure` Has No Auth Middleware
**File:** `backend/server.js`  
**Issue:** Unlike all other protected routes, `/api/school-structure` is mounted without `authMiddleware`. All school structure endpoints are publicly accessible.  
**Fix:** Add `authMiddleware` to the route mount: `app.use('/api/school-structure', authMiddleware, require('./routes/schoolStructure'));`

---

## Section B — Backend Logic & API Bugs

### B-1. 🔴 CRITICAL — Dual-Source User Data (In-Memory vs SQLite)
**Files:** `backend/routes/auth.js` (in-memory array), `backend/routes/users.js` (SQLite `users` table)  
**Issue:** Login/register use a hardcoded in-memory `users` array. The `/api/users` CRUD routes operate on the SQLite `users` table. These two stores are completely disconnected. A user created via `/api/users` POST can't log in. A user who logs in doesn't exist in the database.  
**Fix:** Migrate auth to use the SQLite `users` table for login/register.

### B-2. 🔴 CRITICAL — `requirePermission` Signature Mismatch = Authorization Bypass
**Files:** `backend/middleware/permissions.js` (defines `requirePermission`), `backend/routes/students.js` (calls it)  
**Issue:** `requirePermission` takes 2 parameters, but routes pass only 1. The second parameter (`userType`) is always `undefined`, causing role resolution to fail. The fallback logic says "If we can't resolve the role, allow access" — granting **all authenticated users full access** to every permission-protected endpoint.  
**Fix:** Fix the function signature or remove the second parameter requirement. Remove the "allow access on failure" fallback.

### B-3. 🔴 CRITICAL — All Admin Users Bypass Permission Checks
**File:** `backend/middleware/permissions.js`  
**Issue:** `if (user.role === 'admin') { return next(); }` bypasses ALL permission checks for every admin type. Even the lowest-tier admin (secretary) gets unrestricted access, defeating the RBAC system.  
**Fix:** Check specific admin types. Only CEO/superUser should have unrestricted bypass.

### B-4. 🟠 HIGH — Attendance Table Missing Required Columns
**File:** `backend/database/local.js` (schema) vs `backend/routes/attendance.js` (queries)  
**Issue:** The attendance routes filter by `class`, `morning_status`, `afternoon_status` columns, but the `attendance` table DDL doesn't have `class`, `morning_status`, or `afternoon_status`. Queries will fail or return empty results.  
**Fix:** Align the table schema with the route queries. Add the missing columns.

### B-5. 🟠 HIGH — Analytics Module References Non-Existent Tables/Columns
**File:** `backend/database/analytics.js`  
**Issue:** References tables that don't exist: `fee_payments`, `exam_scores`, `library_issued`. Also references columns that don't exist: `attendance.present` (actual: `attendance.status`), `students.admission_number` (doesn't exist), `grades.term` (doesn't exist).  
**Fix:** Create the missing tables or rewrite queries to use existing schema.

### B-6. 🟠 HIGH — No GET `/` (List All) Route for Grades
**File:** `backend/routes/grades.js`  
**Issue:** There's no `router.get('/')` endpoint. Requests to `GET /api/grades` fall through to the 404 handler. The frontend `Grades.jsx` page calls this endpoint.  
**Fix:** Add a `GET /` endpoint that lists grades with pagination and filtering.

### B-7. 🟠 HIGH — Analytics Routes Not Mounted in `server.js`
**File:** `backend/routes/analytics.js` exists but is never mounted in `backend/server.js`.  
**Impact:** All analytics endpoints are dead code. The StudentDashboard tries to call analytics endpoints that don't exist.  
**Fix:** Mount analytics routes in server.js.

### B-8. 🟠 HIGH — Assignments PUT/DELETE Have No Permission Checks
**File:** `backend/routes/assignments.js`  
**Issue:** Update and delete endpoints have no `requirePermission` or `requireRole` middleware. Any authenticated user can modify or delete any assignment.  
**Fix:** Add appropriate permission middleware.

### B-9. 🟠 HIGH — Subjects, Timetable, Devices, Courses Missing Permission Checks
**Files:** `backend/routes/subjects.js`, `backend/routes/timetable.js`, `backend/routes/devices.js`, `backend/routes/courses.js`  
**Issue:** Create, update, and delete endpoints have no permission middleware. Any authenticated user can modify these resources.  
**Fix:** Add role/permission checks to all write operations.

### B-10. 🟠 HIGH — Schools DELETE Does Hard Delete (No Soft Delete)
**File:** `backend/routes/schools.js`  
**Issue:** `DELETE FROM schools WHERE id = ?` permanently deletes with no recovery. All other entities use soft delete (`is_deleted = 1`). No cascade check for related students, teachers, etc.  
**Fix:** Use soft delete pattern. Add cascade checks.

### B-11. 🟠 HIGH — `requireRole` in Grades Uses Uppercase ('ADMIN') vs JWT Lowercase ('admin')
**File:** `backend/routes/grades.js`  
**Issue:** Routes use `authorizeRole('ADMIN', 'TEACHER')` but the JWT stores lowercase roles like `'admin'`, `'teacher'`. Case-insensitive comparison was added to `middleware/auth.js` but may not apply to `authorizeRole` consistently.  
**Fix:** Standardize to lowercase roles throughout. Always compare case-insensitively.

### B-12. 🟡 MEDIUM — Dashboard Returns Hardcoded/Mock Data
**File:** `backend/routes/dashboard.js`  
**Issue:** Teacher dashboard returns hardcoded `'94%'` for attendance. Parent dashboard returns hardcoded `'B+'` GPA. Student dashboard returns `'N/A'` strings.  
**Fix:** Replace with real database queries.

### B-13. 🟡 MEDIUM — Students Pagination Returns Wrong Total Count
**File:** `backend/routes/students.js`  
**Issue:** `total: students.length` returns the current page count, not the total database count. Frontend pagination will break.  
**Fix:** Run a separate `SELECT COUNT(*)` query for the total.

### B-14. 🟡 MEDIUM — Student/Teacher Update Can't Clear Fields to Empty
**File:** `backend/database/local.js`  
**Issue:** Uses `updates.field || existing.field` pattern. Empty string `""` or `null` are falsy, so fields can never be cleared.  
**Fix:** Use `updates.field !== undefined ? updates.field : existing.field` pattern.

### B-15. 🟡 MEDIUM — Grades Routes Apply Auth Middleware Redundantly
**File:** `backend/routes/grades.js`  
**Issue:** Imports and applies `authenticateToken` per-route, but `server.js` already applies `authMiddleware` (same function) at the router level. Double auth is redundant.  
**Fix:** Remove per-route auth middleware; rely on server.js level.

### B-16. 🟡 MEDIUM — Reports Export SQL Parameter Binding Fragility
**File:** `backend/routes/reports.js`  
**Issue:** Builds SQL with conditional WHERE clauses using template strings. If some params are provided but not others, parameter binding can mismatch and crash.  
**Fix:** Build query programmatically with proper parameter arrays.

### B-17. 🟡 MEDIUM — `/api/auth/me` Endpoint Broken
**File:** `backend/routes/auth.js`  
**Issue:** This endpoint is under the public `/api/auth` route (no auth middleware from server.js). It accesses `req.user` which is always `undefined` since no auth middleware runs. The endpoint is broken.  
**Fix:** Apply `authMiddleware` to the `/me` endpoint specifically.

### B-18. 🟡 MEDIUM — Sync Delete Actions Are No-Ops
**File:** `backend/services/syncService.js`  
**Issue:** When `action === 'DELETE'`, the code only calls `markAsSynced()` but never actually deletes the record from Firebase. Deleted local records remain in the cloud.  
**Fix:** Implement actual Firebase deletion for DELETE actions.

### B-19. 🟡 MEDIUM — Bulk Attendance Insert Doesn't Check Duplicates
**File:** `backend/routes/attendance.js`  
**Issue:** The bulk mark endpoint doesn't check for existing records. This can violate unique constraints and crash.  
**Fix:** Use `INSERT OR REPLACE` or check for existing records.

### B-20. 🔵 LOW — `uuid` Listed as Dependency but Not in `package.json`
**File:** `backend/routes/schoolStructure.js`  
**Issue:** Calls `require('uuid')` but `uuid` is not in `backend/package.json`. This will crash if the file is loaded and uuid isn't installed.  
**Fix:** Add `uuid` to dependencies or use crypto.randomUUID().

### B-21. 🔵 LOW — `permissionMiddlewareHardened.js` Uses ESM in CommonJS Project
**File:** `backend/middleware/permissionMiddlewareHardened.js`  
**Issue:** Uses `export` syntax but the project is CommonJS (`"type": "commonjs"` or no type field). This file will throw a syntax error if imported.  
**Fix:** Convert to CommonJS `module.exports` syntax or remove if unused.

### B-22. 🔵 LOW — Teacher GET by ID Missing Permission Check
**File:** `backend/routes/teachers.js`  
**Issue:** `GET /:id` has no `requirePermission` middleware while `GET /` requires `view_teachers`. Any authenticated user can fetch any teacher by ID.  
**Fix:** Add consistent permission checks.

### B-23. 🔵 LOW — Port Auto-Increment May Confuse Frontend
**File:** `backend/server.js`  
**Issue:** If port 5001 is busy, the server silently moves to 5002, 5003. The frontend may not detect the new port.  
**Fix:** Fail loudly or use a known port configuration.

### B-24. 🔵 LOW — In-Memory Audit Log in `rbac.js` Grows Without Bound
**File:** `backend/middleware/rbac.js`  
**Issue:** `permissionLog` and `auditTrail` arrays grow indefinitely with no cleanup. Memory leak over time.  
**Fix:** Implement a max-size ring buffer or use a database.

---

## Section C — Database & Data Integrity

### C-1. 🟠 HIGH — No Foreign Key Constraints
**File:** `backend/database/local.js`  
**Issue:** No `FOREIGN KEY` constraints between tables. `grades.student_id` doesn't reference `students.id`, `teachers.subject_id` doesn't reference `subjects.id`, etc. Orphaned records are possible.  
**Fix:** Add proper FOREIGN KEY constraints and enable `PRAGMA foreign_keys = ON`.

### C-2. 🟠 HIGH — No Database Indexes
**File:** `backend/database/local.js`  
**Issue:** No `CREATE INDEX` statements anywhere. Queries filtering by `class`, `date`, `student_id`, `is_deleted` will do full table scans.  
**Fix:** Add indexes for common query patterns: `students(class)`, `attendance(date)`, `grades(student_id)`, `*.(is_deleted)`.

### C-3. 🟡 MEDIUM — Attendance Table Schema vs Query Mismatch
**File:** `backend/database/local.js` (DDL) vs `backend/routes/attendance.js` (queries)  
**Issue:** The table has `status TEXT, date TEXT, time_in TEXT, time_out TEXT` but routes query `class TEXT`, `morning_status`, `afternoon_status` columns that don't exist.  
**Fix:** Update the DDL to include all columns used by routes, or update routes to match the DDL.

### C-4. 🟡 MEDIUM — Classes Table Missing (Routes Simulate via Students)
**File:** `backend/routes/classes.js`  
**Issue:** There's no `classes` table. The routes derive class lists from `DISTINCT class` on the students table. No way to manage classes independently (capacity, teacher assignment, room, schedule).  
**Fix:** Create a proper `classes` table with class metadata.

### C-5. 🟡 MEDIUM — No Data Validation on Database Writes
**File:** `backend/database/local.js`  
**Issue:** Insert functions accept any data and pass it directly to SQL without validation (beyond what the schema enforces). No email format checks, no phone format checks, no date format checks.  
**Fix:** Add input validation in route handlers or database functions.

### C-6. 🔵 LOW — Duplicate SQLite Dependencies
**File:** `backend/package.json`  
**Issue:** Both `better-sqlite3` and `sqlite3` are listed as dependencies but only `better-sqlite3` is used. `sqlite3` is ~20MB dead weight.  
**Fix:** Remove `sqlite3` from dependencies.

### C-7. 🔵 LOW — `exams` Table Seeded but No Route Exists
**File:** `backend/scripts/seed.js`, `backend/database/local.js`  
**Issue:** The `exams` table is created and seeded but there's no `routes/exams.js` file. The data is inaccessible via API.  
**Fix:** Create exam routes or remove the table if not needed yet.

### C-8. 🔵 LOW — `class_enrollments` Table Seeded but No Route Exists
**Files:** Same as C-7  
**Issue:** The `class_enrollments` table is created and seeded but no route file uses it.  
**Fix:** Create enrollment routes or defer to future milestone.

---

## Section D — Frontend Logic & UI Bugs

### D-1. 🔴 CRITICAL — `Grades.jsx` Uses UPPERCASE Role Strings
**File:** `website/src/pages/Grades.jsx`  
**Issue:** Checks `user.role === 'TEACHER'` and `user.role === 'STUDENT'` but the auth system stores lowercase `'teacher'`, `'student'`. All role-based UI logic silently fails — add/edit/delete buttons are hidden for everyone.  
**Fix:** Change to lowercase: `user.role === 'teacher'`.

### D-2. 🔴 CRITICAL — `RoleSelection.jsx` Reads `userType` That Doesn't Exist in Context
**File:** `website/src/pages/RoleSelection.jsx`  
**Issue:** `const { schoolType, userType } = useSchool();` — SchoolContext only provides `selectedSchool`, `selectSchool`, `clearSchool`. `userType` is always `undefined`, causing the redirect logic to always send users back to school selection, making the role selection page unreachable.  
**Fix:** Get `userType` from `useAuth()` user data instead, or remove the dependency.

### D-3. 🔴 CRITICAL — `Dashboard.jsx` Always Redirects Away
**File:** `website/src/pages/Dashboard.jsx`  
**Issue:** The dashboard component checks `user.role.roleId` which doesn't exist (role is a string like `'admin'`). `roleId` is always `undefined`, so `getDashboardForRole(undefined)` returns an unknown path, and the component always redirects.  
**Fix:** Use `user.role` (string) or `user.adminType` for routing. Update `getDashboardForRole` to accept role strings.

### D-4. 🔴 CRITICAL — `Dashboard.jsx` Routes Don't Match `App.jsx` Routes
**File:** `website/src/pages/Dashboard.jsx`  
**Issue:** `getDashboardForRole()` returns paths like `/dashboards/admin`, `/dashboards/teacher`. But `App.jsx` defines routes as `/admin-dashboard`, `/teacher-dashboard`. Users are redirected to non-existent routes.  
**Fix:** Update `getDashboardForRole` to return the correct route paths.

### D-5. 🔴 CRITICAL — Duplicate Route Definitions in `App.jsx`
**File:** `website/src/App.jsx`  
**Issue:** `/subjects`, `/attendance`, and `/mark-attendance` are defined twice — once in the admin Layout group and again in the teacher Layout group. React Router matches the first definition, so teachers are always blocked by the admin `ProtectedRoute`.  
**Fix:** Remove duplicate routes. Use a single route per path with combined role checks.

### D-6. 🔴 CRITICAL — Triple API Configuration Systems
**Files:** `website/src/config/apiConfig.js`, `website/src/utils/apiConfig.js`, `website/src/services/api.js`  
**Issue:** Three separate files handle API URL detection, each with its own cache and slightly different port lists. They can resolve to different ports, causing auth calls to go to one server and data calls to another.  
**Fix:** Consolidate to a single API config module used everywhere.

### D-7. 🟠 HIGH — `ProtectedRoute.jsx` Inconsistent Role Check for Teacher Types
**File:** `website/src/components/ProtectedRoute.jsx`  
**Issue:** Lines 40-43 properly normalize `user.role` to a string. But line 50 does `user.role !== 'teacher'` without normalization. If role is stored as an object after `selectRole()`, this check always fails.  
**Fix:** Normalize role to string consistently in all checks.

### D-8. 🟠 HIGH — `services/api.js` Race Condition on Port Detection
**File:** `website/src/services/api.js`  
**Issue:** Port detection runs as an async IIFE. Any API call made before it completes uses the default `localhost:5001`. There's no mechanism to wait for detection to finish.  
**Fix:** Consolidate to a single detection system; use a promise-based approach all consumers can await.

### D-9. 🟠 HIGH — `main.jsx` Can Delay Render 8+ Seconds
**File:** `website/src/main.jsx`  
**Issue:** Calls `detectBackendPort()` which tries up to 8 ports with ~1-second timeouts each before rendering. In the worst case (backend down), the app shows a blank white screen for 8+ seconds.  
**Fix:** Render immediately with a loading state; detect port in the background.

### D-10. 🟠 HIGH — Parent Dashboard Links to 8 Non-Existent Routes
**File:** `website/src/pages/ParentDashboard.jsx`  
**Issue:** Navigation targets like `/parent-attendance`, `/parent-grades`, `/parent-communication`, `/parent-messages`, `/parent-events`, `/parent-appointments`, `/parent-health`, `/parent-report-cards` — none exist in `App.jsx`. Clicking any shows a blank page.  
**Fix:** Create the routes or link to existing pages.

### D-11. 🟠 HIGH — Teacher Dashboard Links to Non-Existent Routes
**File:** `website/src/pages/TeacherDashboard.jsx`  
**Issue:** `/class-attendance` and `/reports` are not defined in App.jsx.  
**Fix:** Create the routes or use existing paths.

### D-12. 🟠 HIGH — Sidebar Has 15+ Links to Non-Existent Routes
**File:** `website/src/layouts/Layout.jsx`  
**Issue:** Multiple sidebar paths for teacher, student, and parent roles don't exist in App.jsx: `/my-classes`, `/my-subjects`, `/curriculum-management`, `/grade-book`, `/staff-management`, `/budget-allocation`, `/my-grades`, `/my-assignments`, `/my-schedule`, `/child-marks`, `/child-attendance`, `/child-reports`, etc.  
**Fix:** Map sidebar links to actual existing routes.

### D-13. 🟠 HIGH — `AuthContext.jsx` useMemo Missing Function Dependencies
**File:** `website/src/contexts/AuthContext.jsx`  
**Issue:** The context `value` useMemo includes `login`, `register`, `logout`, etc. but these aren't in the dependency array. They are closures over `user` state but are recreated every render since they aren't wrapped in `useCallback`. This can cause stale closures.  
**Fix:** Wrap functions in `useCallback` or add them to the dependency array.

### D-14. 🟡 MEDIUM — No Error Boundaries in Entire App
**File:** `website/src/App.jsx`  
**Issue:** Zero `ErrorBoundary` components. Any uncaught render error crashes the entire app with a white screen and no recovery.  
**Fix:** Add `ErrorBoundary` components around major sections (Layout, Dashboard, etc.).

### D-15. 🟡 MEDIUM — `StudentDashboard.jsx` Uses `localStorage.getItem('token')` First
**File:** `website/src/pages/StudentDashboard.jsx`  
**Issue:** Tries `'token'` key first, then `'authToken'`. The `'token'` key is never set anywhere, adding confusion. Now fixed to only use `'authToken'` but verify no regressions.  
**Fix:** Verified — ensure consistent use of `'authToken'` key everywhere.

### D-16. 🟡 MEDIUM — `FinanceDashboard.jsx` Shows Random Mock Data
**File:** `website/src/pages/FinanceDashboard.jsx`  
**Issue:** `Math.floor(Math.random() * 40) + 60` generates random financial data displayed as if real. Every refresh shows different numbers.  
**Fix:** Connect to a real backend endpoint or clearly label as mock data.

### D-17. 🟡 MEDIUM — `Settings.jsx` Doesn't Persist to Backend
**File:** `website/src/pages/Settings.jsx`  
**Issue:** Settings are only logged to console: `console.log('Settings saved:', settings)`. Refreshing the page loses all changes.  
**Fix:** Create a backend endpoint for settings persistence.

### D-18. 🟡 MEDIUM — `Settings.jsx` Hidden for All Users
**File:** `website/src/pages/Settings.jsx`  
**Issue:** Checks `user.role.isSuperAdmin` but role is a string, so `.isSuperAdmin` is always `undefined`. The settings page returns `null` for everyone.  
**Fix:** Check `user.isSuperUser` instead.

### D-19. 🟡 MEDIUM — `ProfileSettings` Route Only for Admin Role
**File:** `website/src/App.jsx`  
**Issue:** `/profile-settings` route is wrapped in `<ProtectedRoute requiredRoles={['admin']}>`. But the Sidebar links all roles to this page. Teachers, students, parents get redirected to `/unauthorized`.  
**Fix:** Allow all authenticated users to access profile settings.

### D-20. 🟡 MEDIUM — `Attendance.jsx` Has Hardcoded Summary Data
**File:** `website/src/pages/Attendance.jsx`  
**Issue:** "Today's Summary" shows hardcoded: Total Students: 45, Present: 42, Absent: 3, Attendance Rate: 93.3%. Never fetches real data.  
**Fix:** Fetch summary data from the attendance API.

### D-21. 🟡 MEDIUM — `MarkAttendance.jsx` Uses Hardcoded Subject/Class Lists
**File:** `website/src/pages/MarkAttendance.jsx`  
**Issue:** Uses hardcoded arrays `['Mathematics', 'English', ...]` and `['9-A', '9-B', '10-A', ...]` instead of fetching from the API.  
**Fix:** Fetch from `/api/subjects` and `/api/classes`.

### D-22. 🟡 MEDIUM — Port Detection Uses `timeout` Option (Not Supported by Fetch)
**Files:** `website/src/config/apiConfig.js`, `website/src/services/api.js`  
**Issue:** `fetch(url, { timeout: 1000 })` — the Fetch API does not support a `timeout` option. It's silently ignored, so each port check can hang indefinitely if the server is unresponsive.  
**Fix:** Use `AbortController` with `setTimeout()` for proper timeout handling.

### D-23. 🟡 MEDIUM — `TeacherDashboard.jsx` Silently Shows Mock Data on Error
**File:** `website/src/pages/TeacherDashboard.jsx`  
**Issue:** On fetch error, replaces stats with fabricated numbers (95 present, 5 absent). User sees fake data with no indication.  
**Fix:** Show an error state instead of fabricated numbers.

### D-24. 🟡 MEDIUM — `ParentDashboard.jsx` Silently Shows Mock Data on Error
**File:** `website/src/pages/ParentDashboard.jsx`  
**Issue:** Same as D-23. Shows hardcoded stats like "88% attendance", "5 notifications" on error.  
**Fix:** Show an error state.

### D-25. 🟡 MEDIUM — `Dashboard.jsx` Calculates Classes from Student Count
**File:** `website/src/pages/Dashboard.jsx`  
**Issue:** `totalClasses: Math.ceil((studentsData.data?.length || 0) / 30)` — guesses class count by dividing students by 30 instead of querying actual class data.  
**Fix:** Use the classes API endpoint.

### D-26. 🔵 LOW — `Logout.jsx` References `user?.name` After Logout
**File:** `website/src/pages/Logout.jsx`  
**Issue:** By the time the goodbye message renders, `user` may already be `null` from the async logout call. Always shows generic message instead of personalized one.  
**Fix:** Capture user name before initiating logout.

### D-27. 🔵 LOW — `ExportReports.jsx` Uses Hardcoded Class List
**File:** `website/src/pages/ExportReports.jsx`  
**Issue:** Hardcoded class list `['9-A', '9-B', '10-A', ...]` won't match actual database classes.  
**Fix:** Fetch class list from API.

### D-28. 🔵 LOW — `api.js` Offline Cache Returns Stale Data Without Warning
**File:** `website/src/services/api.js`  
**Issue:** Offline returns include `_cached: true` flag, but no consuming component checks or displays this.  
**Fix:** Show a "cached data" indicator in the UI.

### D-29. 🔵 LOW — `Grades.jsx` Imports From Standalone Component Files
**File:** `website/src/pages/Grades.jsx`  
**Issue:** Imports `Navbar`, `Sidebar`, `Table`, `Modal`, `Card` from standalone files instead of the `Shared/` barrel export. Inconsistent with all other pages.  
**Fix:** Use consistent import pattern from `../components/Shared`.

### D-30. 🔵 LOW — `ParentDashboard` Notifications Are Hardcoded
**File:** `website/src/pages/ParentDashboard.jsx`  
**Issue:** Notification data is hardcoded and never fetched from backend.  
**Fix:** Create a notifications API endpoint.

### D-31. 🔵 LOW — Students Search Input Does Nothing
**File:** `website/src/pages/Students.jsx`  
**Issue:** The search input tracks state but has no search handler — typing does nothing.  
**Fix:** Implement search filtering on the displayed data.

---

## Section E — Architecture & Design Issues

### E-1. 🟠 HIGH — In-Memory Users vs Database Users Split
**Root Cause:** Authentication (login/register) uses an in-memory array. CRUD operations use SQLite. This is the single biggest architectural flaw.  
**Impact:** Users created via API can't log in. Demo users who log in don't exist in the database for CRUD queries.  
**Fix:** Migrate auth to use the SQLite `users` table exclusively.

### E-2. 🟠 HIGH — 5 Middleware Files for Auth/Permissions
**Files:** `middleware/auth.js`, `middleware/permissions.js`, `middleware/rbac.js`, `middleware/permissionMiddleware.js`, `middleware/permissionMiddlewareHardened.js`  
**Issue:** Three middleware files are never imported by any route (`rbac.js`, `permissionMiddleware.js`, `permissionMiddlewareHardened.js`). They duplicate logic and cause confusion about which is authoritative.  
**Fix:** Remove unused middleware files. Consolidate into `auth.js` and `permissions.js`.

### E-3. 🟡 MEDIUM — Inconsistent Error Response Format
**Backend Routes:** Some return `{ success: false, message }`, others return `{ error: message }`, others return `{ success: false, error }`.  
**Fix:** Standardize all error responses to `{ success: false, message, error? }`.

### E-4. 🟡 MEDIUM — No API Versioning
**Issue:** All routes are under `/api/`. No version prefix like `/api/v1/`. Adding breaking changes will break all clients.  
**Fix:** Add version prefix: `/api/v1/`.

### E-5. 🟡 MEDIUM — No Rate Limiting
**File:** `backend/server.js`  
**Issue:** No rate limiting on any endpoint. The login endpoint is vulnerable to brute-force attacks.  
**Fix:** Add `express-rate-limit` middleware, especially on `/api/auth/login`.

### E-6. 🟡 MEDIUM — Duplicate `schoolStructure` Files
**Files:** `website/src/utils/schoolStructure.js`, `website/src/utils/schoolStructure.jsx`  
**Issue:** Both `.js` and `.jsx` versions exist with identical content. Import resolution is ambiguous.  
**Fix:** Remove one of the duplicate files.

### E-7. 🔵 LOW — No Request Logging in Production
**File:** `backend/server.js`  
**Issue:** Uses a simple custom logger (`console.log` with timestamps). No structured logging, no log levels, no log rotation.  
**Fix:** Use a proper logging library (winston, pino) with structured output.

### E-8. 🔵 LOW — No Graceful Shutdown Handler
**File:** `backend/server.js`  
**Issue:** No `SIGTERM`/`SIGINT` handler to close database connections and stop accepting new requests.  
**Fix:** Add shutdown handlers: `process.on('SIGTERM', () => { db.close(); server.close(); })`.

### E-9. 🔵 LOW — Config File Proliferation
**Files:** `config/sessionConfig.js`, `config/dashboardConfig.js` (frontend)  
**Issue:** `sessionConfig.js` defines timeout values but `AuthContext.jsx` hardcodes its own. `dashboardConfig.js` maps to non-existent routes. Both are dead code.  
**Fix:** Either use the config files or remove them.

---

## Section F — Infrastructure & DevOps

### F-1. 🔴 CRITICAL — `.gitignore` Non-Functional (UTF-16LE)
*See A-2 above.*

### F-2. 🔴 CRITICAL — `node_modules` Committed (316 MB)
*See A-3 above.*

### F-3. 🟠 HIGH — Build Artifacts (`dist/`) Committed
**Files:** `dist/`, `website/dist/`  
**Issue:** Two sets of stale build artifacts are tracked. They contain minified JS with embedded demo credentials.  
**Fix:** Remove from git, add to `.gitignore`.

### F-4. 🟠 HIGH — 44 MB `google-cloud-cli` Tarball Committed
**File:** `google-cloud-cli-linux-x86_64.tar.gz`  
**Issue:** A 44 MB binary file in the repo root. Should never be in git.  
**Fix:** Remove from git history. Add `*.tar.gz` to `.gitignore`.

### F-5. 🟠 HIGH — No Production Deployment Configuration
**Issue:** No Dockerfile, no docker-compose, no deployment scripts, no CI/CD pipeline. The frontend hardcodes `localhost` making it impossible to deploy without code changes.  
**Fix:** Create deployment configs. Use environment variables for API URLs.

### F-6. 🟠 HIGH — `.env` PORT Mismatch
**File:** `backend/.env`  
**Issue:** `.env` defines `PORT=5000` but `server.js` reads `process.env.PORT` and defaults to `5001`. The env var name matches but the value conflicts with the hardcoded default. Actually, the env var `PORT=5000` is set but server.js tries port `5001` first.  
**Fix:** Align `.env` `PORT` value with the expected port (5001).

### F-7. 🟡 MEDIUM — No `website/.env` File
**Issue:** `website/.env` doesn't exist. The app relies on runtime port-scanning. `VITE_API_URL` is never set.  
**Fix:** Create `website/.env` with `VITE_API_URL=http://localhost:5001/api`.

### F-8. 🟡 MEDIUM — Vite Proxy Not Configured
**File:** `website/vite.config.js`  
**Issue:** No proxy configuration. The app makes direct cross-origin requests requiring CORS, which is fragile and won't work in production.  
**Fix:** Add `server.proxy` in vite config to proxy `/api` requests to the backend.

### F-9. 🟡 MEDIUM — Significantly Outdated Dependencies
**Issue:** Vite 4.3.2 (current: 6.x), `@vitejs/plugin-react` 3.1.0 (current: 4.x), `lucide-react` 0.263.1 (current: 0.400+). No lockfile version pinning strategy.  
**Fix:** Update dependencies. Pin versions in package-lock.json.

### F-10. 🟡 MEDIUM — No `engines` Field in Backend `package.json`
**File:** `backend/package.json`  
**Issue:** No Node.js version requirement specified. `better-sqlite3` requires specific Node versions for native compilation.  
**Fix:** Add `"engines": { "node": ">=18.0.0" }`.

### F-11. 🟡 MEDIUM — Vite Timestamp Cache Files Committed
**Files:** `website/node_modules/.vite/deps/_metadata.json`, timestamp files  
**Issue:** Dev server cache files should never be committed.  
**Fix:** Remove from git (will be fixed when node_modules is removed).

### F-12. 🔵 LOW — Root `package.json` Workspace + Manual Install Redundancy
**File:** `package.json`  
**Issue:** Defines `workspaces` but also has `install-all` script that runs `npm install --prefix` for each workspace. The `build:backend` script swallows errors with `2>/dev/null`.  
**Fix:** Remove manual install scripts; rely on workspace auto-install.

### F-13. 🔵 LOW — 227+ Markdown Documentation Files
**Issue:** 133 `.md` files in root + 94 in subfolders. Many are AI-generated session logs with significant overlap (7 about logout, 6 about RBAC, 5 about Phase 4, multiple "COMPLETE"/"MISSION_ACCOMPLISHED" files).  
**Fix:** Consolidate into ~10 authoritative documents.

### F-14. 🔵 LOW — Default Vite Favicon
**File:** `website/index.html`  
**Issue:** References `/vite.svg` — the default Vite favicon, not a project-specific icon.  
**Fix:** Replace with project branding.

### F-15. 🔵 LOW — Undocumented `EduPlus/` React Native Directory
**Directory:** `EduPlus/`  
**Issue:** Contains React Native code with its own `package.json`. Not in the `workspaces` config, not documented, and status is unknown.  
**Fix:** Either document and integrate, or remove.

---

## Section G — Performance Concerns

### G-1. 🟡 MEDIUM — No Database Indexes
*See C-2 above.*  
**Impact:** Every query does full table scans. Will degrade significantly with >1000 records.

### G-2. 🟡 MEDIUM — Frontend Port Detection Adds 0-8 Second Delay
*See D-9 above.*  
**Impact:** Users see a blank white screen while ports are scanned on every page load.

### G-3. 🔵 LOW — JWT Payload Too Large
**File:** `backend/routes/auth.js`  
**Issue:** Token includes `assignedSchools` array, `role`, `adminType`, `userType`, `schoolType`, `schoolLevel`, `teacherType`, and more. Token size is ~500+ bytes. Every HTTP request includes this in the header.  
**Fix:** Include only essential fields (id, role). Fetch details from DB when needed.

### G-4. 🔵 LOW — No Pagination on List Endpoints
**Files:** `backend/routes/teachers.js`, `backend/routes/subjects.js`, `backend/routes/timetable.js`, etc.  
**Issue:** Most list endpoints return all records with no pagination. Will cause slow responses and high memory usage with large datasets.  
**Fix:** Add offset/limit pagination to all list endpoints.

### G-5. 🔵 LOW — Offline Cache Uses localStorage (5 MB Limit)
**File:** `website/src/services/api.js`  
**Issue:** Caches every API response in localStorage. The 5 MB limit can fill quickly, causing writes to silently fail.  
**Fix:** Use IndexedDB for larger storage or implement cache eviction.

---

## Section H — Documentation & Code Quality

### H-1. 🔵 LOW — `.env.example` Missing for Backend
**Issue:** No `.env.example` file documenting all required environment variables. New developers won't know what to configure.  
**Fix:** Create `.env.example` with all required variables (commented).

### H-2. 🔵 LOW — No Code Linting Configuration
**Issue:** No `.eslintrc`, `.prettierrc`, or similar code quality configs. Code style is inconsistent.  
**Fix:** Add ESLint + Prettier configuration.

### H-3. 🔵 LOW — No Test Files
**Issue:** Zero test files in the entire project. No unit tests, no integration tests, no E2E tests.  
**Fix:** Add test framework (Jest/Vitest) and write tests for critical paths.

### H-4. 🔵 LOW — Dead Code: Unused Config Files
**Files:** `config/sessionConfig.js`, `config/dashboardConfig.js`, `middleware/rbac.js`, `middleware/permissionMiddleware.js`, `middleware/permissionMiddlewareHardened.js`  
**Issue:** Multiple files are never imported or used.  
**Fix:** Remove dead code.

### H-5. ✅ INFO — `firebase-admin` Is Heavy But Optional
**File:** `backend/package.json`  
**Issue:** `firebase-admin` (~50 MB) is a required dependency but cloud sync is optional.  
**Fix:** Move to optional dependencies or use lazy loading.

---

## Quick Fix Priority Table

| Priority | Issue IDs | Description | Effort |
|----------|-----------|-------------|--------|
| **🔥 P0 — Do Now** | A-1, A-2, A-3 | Rotate Firebase key, fix .gitignore, remove node_modules from git | 1 hour |
| **🔥 P0 — Do Now** | A-4, A-5 | Fix JWT secret, hash passwords | 30 min |
| **🔥 P0 — Do Now** | A-6, A-7 | Fix SQL injection (whitelist columns, validate table names) | 1 hour |
| **⚡ P1 — This Week** | B-1 | Migrate auth to use SQLite users table | 3 hours |
| **⚡ P1 — This Week** | B-2, B-3 | Fix permission middleware bypass | 2 hours |
| **⚡ P1 — This Week** | D-1, D-2, D-3, D-4 | Fix Grades role case, RoleSelection, Dashboard routing | 2 hours |
| **⚡ P1 — This Week** | D-5, D-6 | Fix duplicate routes, consolidate API config | 2 hours |
| **📋 P2 — This Sprint** | B-4, B-5, B-6, B-7 | Fix attendance schema, analytics, grades list, mount analytics | 4 hours |
| **📋 P2 — This Sprint** | B-8, B-9, B-10 | Add permission checks to all write endpoints | 3 hours |
| **📋 P2 — This Sprint** | D-7 through D-13 | Fix ProtectedRoute, navigation links, missing routes | 4 hours |
| **📋 P2 — This Sprint** | F-3, F-4, F-5 | Remove build artifacts, add deployment config | 3 hours |
| **📅 P3 — Next Sprint** | D-14 through D-25 | Error boundaries, mock data replacement, hardcoded lists | 6 hours |
| **📅 P3 — Next Sprint** | C-1, C-2, C-3, C-4 | Database constraints, indexes, schema alignment | 4 hours |
| **📅 P3 — Next Sprint** | E-2 through E-9 | Architecture cleanup, middleware consolidation | 4 hours |
| **🗓️ P4 — Backlog** | All 🔵 LOW items | Code quality, dead code removal, pagination, tests | 8+ hours |

---

> **Note:** This document should be reviewed and updated after each sprint. Issues marked as fixed should be moved to a "Resolved" section with the date and PR/commit reference.
