# Developer Reference - Session Management API

## Overview
Complete API reference for the automatic logout and session management system.

---

## AuthContext API

### Properties

#### `user: Object | null`
Current logged-in user object or null if not authenticated.

```javascript
{
  id: string,
  email: string,
  name: string,
  role: 'admin' | 'teacher' | 'student' | 'parent',
  ...otherProperties
}
```

#### `isAuthenticated: Boolean`
True if user is logged in and not logged out.

```javascript
const { isAuthenticated } = useAuth();
if (isAuthenticated) {
  // User is logged in
}
```

#### `isOnline: Boolean`
True if browser has internet connection.

```javascript
const { isOnline } = useAuth();
if (!isOnline) {
  // User is offline
}
```

#### `showSessionWarning: Boolean`
True when session warning dialog should be displayed.

```javascript
const { showSessionWarning } = useAuth();
// SessionWarning component watches this flag
```

#### `loading: Boolean`
True while checking authentication status on app load.

```javascript
const { loading } = useAuth();
if (loading) {
  return <LoadingSpinner />;
}
```

#### `error: String | null`
Error message from login/logout operations.

```javascript
const { error } = useAuth();
if (error) {
  return <ErrorAlert message={error} />;
}
```

#### `isLoggedOut: Boolean`
True if user explicitly logged out (prevents session restoration).

```javascript
const { isLoggedOut } = useAuth();
```

---

### Methods

#### `login(email: string, password: string): Promise<User>`
Authenticates user with email and password.

```javascript
const { login } = useAuth();

try {
  const user = await login('user@example.com', 'password123');
  console.log('Login successful:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### `register(formData: Object): Promise<Object>`
Registers new user with provided information.

```javascript
const { register } = useAuth();

try {
  const result = await register({
    email: 'new@example.com',
    password: 'secure123',
    name: 'John Doe',
    role: 'student'
  });
  console.log('Registration successful');
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### `logout(): Promise<void>`
Logs out current user and clears session.

```javascript
const { logout } = useAuth();

await logout();
// User is logged out
// Tokens are cleared
// User redirected to login
```

#### `extendSession(): void`
Extends session by 15 minutes and closes warning dialog.

**Called by:** SessionWarning component "Stay Logged In" button

```javascript
const { extendSession } = useAuth();

// User clicks "Stay Logged In"
extendSession();
// Session extends
// Warning closes
```

#### `performLogout(message?: string): Promise<void>`
Logs out user with optional error message.

**Internal Use:** Called automatically on offline/timeout

```javascript
const { performLogout } = useAuth();

// When offline detected
performLogout('Connection lost - You have been logged out');

// In error handler
performLogout('Session expired due to inactivity');
```

---

## Hook Usage

### useAuth Hook

Import the hook:
```javascript
import { useAuth } from '../contexts/AuthContext';
```

Use in component:
```javascript
function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isOnline,
    loading,
    login, 
    logout 
  } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Configuration API

### sessionConfig.js

Import configuration:
```javascript
import { SESSION_CONFIG } from '../config/sessionConfig';
```

#### Constants
```javascript
SESSION_CONFIG.SESSION_TIMEOUT           // 15 minutes (ms)
SESSION_CONFIG.WARNING_TIMEOUT           // 13 minutes (ms)
SESSION_CONFIG.ACTIVITY_EVENTS           // Array of event names
SESSION_CONFIG.AUTO_LOGOUT.onConnectionLoss    // Boolean
SESSION_CONFIG.AUTO_LOGOUT.onInactivity        // Boolean
SESSION_CONFIG.AUTO_LOGOUT.showWarning         // Boolean
SESSION_CONFIG.AUTO_LOGOUT.clearStorage        // Boolean
SESSION_CONFIG.NOTIFICATIONS.showOfflineNotification     // Boolean
SESSION_CONFIG.NOTIFICATIONS.showSessionWarning         // Boolean
SESSION_CONFIG.DEBUG                    // Boolean
```

#### Helper Functions

**getSessionTimeoutDisplay()**
```javascript
import { getSessionTimeoutDisplay } from '../config/sessionConfig';

const display = getSessionTimeoutDisplay();
console.log(display); // "15:00"
```

**getWarningTimeoutDisplay()**
```javascript
import { getWarningTimeoutDisplay } from '../config/sessionConfig';

const display = getWarningTimeoutDisplay();
console.log(display); // "13:00"
```

**debugLog(message, data?)**
```javascript
import { debugLog } from '../config/sessionConfig';

debugLog('User activity detected', { eventType: 'mousedown' });
// Only logs if DEBUG = true
```

---

## Component API

### SessionWarning Component

Props from context (automatic):
- `showSessionWarning`: Controls visibility
- `extendSession()`: Called on "Stay Logged In"
- `logout()`: Called on "Logout Now"
- `isOnline`: Shows offline warning if false

Features:
- Countdown timer (updates every second)
- Red background when offline
- Auto-logout when countdown reaches 0

```javascript
import SessionWarning from '../components/SessionWarning';

// Used in App.jsx (inside AuthProvider)
<SessionWarning />
```

### OfflineNotification Component

Props from context (automatic):
- `isOnline`: Toggles content
- `user`: Only shows if user is logged in

Features:
- Appears top-right corner
- Red when offline, green when online
- Auto-dismisses when back online

```javascript
import OfflineNotification from '../components/OfflineNotification';

// Used in App.jsx (inside AuthProvider)
<OfflineNotification />
```

---

## Event Flow

### Login Flow
```
User enters credentials
    ↓
login(email, password)
    ↓
Validates with backend
    ↓
Token stored in localStorage
    ↓
User object stored
    ↓
Session timeout timers start
    ↓
Activity listeners activated
```

### Logout Flow
```
logout() called
    ↓
Backend logout API called
    ↓
Timeouts cleared
    ↓
localStorage cleared
    ↓
Tokens removed
    ↓
user = null
    ↓
Event listeners removed
    ↓
User redirected
```

### Offline Detection Flow
```
Browser offline event
    ↓
isOnline = false
    ↓
OfflineNotification shows (red)
    ↓
performLogout() called
    ↓
User logged out immediately
    ↓
Session timers cleared
```

### Inactivity Flow
```
User logs in
    ↓
15-minute timeout starts
    ↓
Activity listener activated
    ↓
ANY activity? → Reset timer
    ↓
No activity for 13 minutes?
    ↓
showSessionWarning = true
    ↓
SessionWarning dialog appears
    ↓
2-minute countdown starts
    ↓
User clicks "Stay Logged In"?
    ├→ extendSession() → Timer resets
    └→ "Logout Now" or timeout → logout()
```

---

## Error Handling

### Login Error
```javascript
try {
  await login(email, password);
} catch (error) {
  console.error('Login failed:', error.message);
  // error.message: "Invalid credentials"
  // error.message: "User not found"
  // error.message: "Server error"
}
```

### Logout Error
```javascript
try {
  await logout();
} catch (error) {
  // Error is caught internally
  // Local logout still occurs
  // User is still logged out
}
```

### Network Error
```javascript
// When offline
performLogout('Connection lost');
// User is logged out
// Error message shown

// When connection restored
isOnline = true;
// OfflineNotification shows "Back Online"
```

---

## Debugging

### Enable Debug Mode
Edit `website/src/config/sessionConfig.js`:
```javascript
DEBUG: true,  // Enable console logs
```

### Check Status
In browser console:
```javascript
// Check if user is logged in
localStorage.getItem('user')

// Check if token exists
localStorage.getItem('authToken')

// Check logout flag
sessionStorage.getItem('userLoggedOut')

// Check connection
navigator.onLine  // true/false
```

### Monitor Events
In browser DevTools:
```javascript
// Add listener to debug
window.addEventListener('online', () => console.log('ONLINE'));
window.addEventListener('offline', () => console.log('OFFLINE'));

// Check activity
['mousedown', 'keydown', 'scroll'].forEach(e => {
  window.addEventListener(e, () => console.log('Activity:', e));
});
```

---

## Best Practices

### ✅ DO

✅ Check `isAuthenticated` before rendering protected content
```javascript
if (!isAuthenticated) return <Navigate to="/login" />;
```

✅ Show loading state while checking auth
```javascript
if (loading) return <LoadingSpinner />;
```

✅ Handle logout errors gracefully
```javascript
try {
  await logout();
} catch (err) {
  console.error(err);
}
```

✅ Use `isOnline` for conditional features
```javascript
{isOnline ? <SyncButton /> : <OfflineMode />}
```

✅ Call `extendSession()` on user action
```javascript
button.onClick = () => extendSession();
```

### ❌ DON'T

❌ Don't remove SessionWarning or OfflineNotification
```javascript
// Wrong:
function App() {
  return (
    <AuthProvider>
      {/* NO: Don't remove these */}
      {/* <SessionWarning /> */}
      {/* <OfflineNotification /> */}
    </AuthProvider>
  );
}
```

❌ Don't modify timeout values without testing
```javascript
// Wrong:
SESSION_TIMEOUT: 1 * 60 * 1000,  // 1 minute - too short!
```

❌ Don't call logout() too frequently
```javascript
// Wrong:
render() {
  if (condition) logout();  // Every render!
}
```

❌ Don't rely on localStorage for sensitive data
```javascript
// Wrong:
localStorage.setItem('password', password);
```

❌ Don't disable offline detection
```javascript
// Wrong:
// window.removeEventListener('offline', handleOffline);
```

---

## Testing Examples

### Test Component
```javascript
import { useAuth } from '../contexts/AuthContext';

function SessionTest() {
  const { 
    user,
    isOnline,
    showSessionWarning,
    extendSession,
    performLogout
  } = useAuth();

  return (
    <div>
      <h2>Session Status</h2>
      <p>User: {user?.name || 'Not logged in'}</p>
      <p>Online: {isOnline ? '✓' : '✗'}</p>
      <p>Warning: {showSessionWarning ? 'Showing' : 'Hidden'}</p>
      
      <button onClick={() => extendSession()}>
        Extend Session
      </button>
      <button onClick={() => performLogout('Test logout')}>
        Test Logout
      </button>
    </div>
  );
}
```

### Unit Test Template
```javascript
describe('useAuth', () => {
  it('should extend session', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.extendSession();
    });
    
    expect(result.current.showSessionWarning).toBe(false);
  });

  it('should logout when offline', () => {
    // Simulate offline
    global.navigator.onLine = false;
    window.dispatchEvent(new Event('offline'));
    
    // Verify logout
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
```

---

## Changelog

### v1.0.0 (March 16, 2026)
- ✅ Initial implementation
- ✅ Offline detection
- ✅ Session timeout
- ✅ Warning dialog
- ✅ Activity tracking
- ✅ Configuration system

---

## Support & Resources

- Full Documentation: `AUTOMATIC_LOGOUT_SYSTEM.md`
- Quick Start Guide: `LOGOUT_SYSTEM_QUICKSTART.md`
- Implementation Details: `AUTOMATIC_LOGOUT_IMPLEMENTATION.md`

---

Last Updated: March 16, 2026
