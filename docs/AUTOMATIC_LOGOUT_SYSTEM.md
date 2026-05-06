# Session Management & Auto-Logout System

## Overview
This document describes the automatic session management and logout system implemented in the EdupluseAdmin application. The system ensures users are automatically logged out when:
- Browser loses internet connection
- Session expires due to inactivity (15 minutes)
- Browser is closed and session is not explicitly saved

## Features

### 1. **Offline Detection**
- **Automatic Logout**: When the browser loses internet connection, the user is immediately logged out
- **Offline Notification**: Visual indicator showing connection status
- **Automatic Recovery**: When connection is restored, notification disappears after 2 seconds

**Files Involved:**
- `OfflineNotification.jsx` - Displays offline/online status
- `AuthContext.jsx` - Handles offline/online events

### 2. **Session Timeout (Inactivity)**
- **15-Minute Timeout**: User is logged out after 15 minutes of inactivity
- **Activity Detection**: The following actions reset the inactivity timer:
  - Mouse movements
  - Keyboard inputs
  - Scrolling
  - Touch events
  - Clicks
  - Wheel scroll

- **2-Minute Warning**: Users receive a warning 2 minutes before logout

**Files Involved:**
- `SessionWarning.jsx` - Warning dialog before logout
- `AuthContext.jsx` - Session timeout logic
- `sessionConfig.js` - Configuration settings

### 3. **Session Warning Dialog**
When a user's session is about to expire:
- A modal dialog appears showing remaining time
- User can choose to:
  - **Stay Logged In**: Extends the session for another 15 minutes
  - **Logout Now**: Immediately logout
- Countdown timer displays remaining time
- Displays connection status warning if offline

### 4. **Browser Offline Detection**
The system monitors browser connectivity:
- Uses `navigator.onLine` API
- Listens to `online` and `offline` events
- Immediately logs out when offline is detected
- Restores connectivity notification when back online

## Implementation Details

### Configuration
Session settings are managed in `config/sessionConfig.js`:

```javascript
export const SESSION_CONFIG = {
  SESSION_TIMEOUT: 15 * 60 * 1000,           // 15 minutes
  WARNING_TIMEOUT: 13 * 60 * 1000,           // 13 minutes (warning at 2 min before)
  ACTIVITY_EVENTS: [...],                     // Events that reset timer
  AUTO_LOGOUT: {
    onConnectionLoss: true,
    onInactivity: true,
    showWarning: true,
    clearStorage: true
  }
};
```

### AuthContext Updates
New properties and methods in `AuthContext.jsx`:

```javascript
// New State Properties
isOnline: boolean                 // Browser online status
showSessionWarning: boolean       // Show warning dialog

// New Methods
extendSession(): void             // Extend session by 15 minutes
performLogout(message): Promise   // Logout with optional message

// Modified logout()
// Now clears session timeouts and resets warnings
```

### Components

#### SessionWarning.jsx
- Displays when session is about to expire
- Shows countdown timer
- Provides options to extend or logout
- Displays offline warning if applicable

**Props from Context:**
- `showSessionWarning`: Controls visibility
- `extendSession()`: Method to extend session
- `logout()`: Method to logout
- `isOnline`: Connection status

#### OfflineNotification.jsx
- Displays at top-right corner
- Shows when offline
- Auto-dismisses when back online
- Non-intrusive notification style

**Props from Context:**
- `isOnline`: Connection status
- `user`: Current user (controls when to show)

## Usage

### For End Users

1. **Inactivity Warning**
   - After 13 minutes without activity, a warning appears
   - You have 2 minutes to click "Stay Logged In"
   - If no action is taken, you're logged out

2. **Connection Loss**
   - If internet connection is lost, you're logged out immediately
   - A notification appears confirming the logout

3. **Session Extension**
   - Click "Stay Logged In" in the warning dialog
   - Your session will be extended for another 15 minutes

### For Developers

#### Accessing Session State
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    isOnline, 
    showSessionWarning, 
    user, 
    extendSession, 
    logout 
  } = useAuth();

  // Use in your component
  if (!isOnline) {
    return <div>You are offline</div>;
  }

  return <div>Your content</div>;
}
```

#### Customizing Session Timeout
Edit `config/sessionConfig.js`:

```javascript
SESSION_TIMEOUT: 20 * 60 * 1000,  // Change to 20 minutes
WARNING_TIMEOUT: 18 * 60 * 1000,  // Warning at 18 minutes (2 min before)
```

#### Adding Custom Activity Events
Edit `config/sessionConfig.js`:

```javascript
ACTIVITY_EVENTS: [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
  'mousemove',
  'wheel',
  'customEvent'  // Add your custom event
]
```

## Files Modified

1. **`website/src/contexts/AuthContext.jsx`**
   - Added offline detection
   - Added session timeout logic
   - Added session warning state
   - New methods: `extendSession()`, `performLogout()`

2. **`website/src/App.jsx`**
   - Imported `SessionWarning` component
   - Imported `OfflineNotification` component
   - Added components inside AuthProvider

3. **NEW: `website/src/components/SessionWarning.jsx`**
   - Warning dialog component
   - Countdown timer
   - Extend/Logout options

4. **NEW: `website/src/components/OfflineNotification.jsx`**
   - Offline status notification
   - Auto-dismiss when online

5. **NEW: `website/src/config/sessionConfig.js`**
   - Configuration file for session settings
   - Helper functions for formatting
   - Debug utilities

## Security Considerations

1. **Token Cleanup**: All auth tokens are removed from localStorage
2. **Session Flag**: `userLoggedOut` flag prevents session restoration
3. **Backend Logout**: Backend logout endpoint is called (if available)
4. **Force Logout**: Connection loss immediately logs out user
5. **Timeout Protection**: Inactivity timeout prevents session hijacking

## Testing Checklist

- [ ] Close browser tab/window → Verify logout works
- [ ] Disconnect internet → Verify immediate logout
- [ ] Wait 15 minutes inactive → Verify logout warning appears
- [ ] Verify warning appears at 13 minutes
- [ ] Click "Stay Logged In" → Verify session extends
- [ ] Click "Logout Now" → Verify immediate logout
- [ ] Reconnect internet after offline → Verify notification
- [ ] Check browser console for timeout logs
- [ ] Verify tokens are cleared from localStorage
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Warning Dialog Not Appearing
1. Check if `showSessionWarning` is true in DevTools
2. Verify timeout values in `sessionConfig.js`
3. Check browser console for errors

### Not Logging Out When Offline
1. Open DevTools → Network tab
2. Check if "Offline" is actually enabled
3. Verify `isOnline` state in React DevTools
4. Check if user is still logged in (check localStorage)

### Session Not Extending
1. Verify `extendSession()` is being called
2. Check if activity events are being triggered
3. Confirm timeouts are being cleared

### Performance Issues
1. Check if too many event listeners are attached
2. Verify timeouts are being cleared properly
3. Monitor memory usage in DevTools

## Future Enhancements

1. **Biometric Reauthentication**: Re-login with fingerprint before logout
2. **Remember Me**: Option to extend session on next visit
3. **Activity Dashboard**: Show user activity timeline
4. **Multi-Tab Sync**: Logout across all tabs when session expires
5. **Custom Logout Messages**: Display reason for logout
6. **Session History**: Log all session activities
7. **Device Management**: Track and manage logged-in devices
8. **Notification Service**: Send email on forced logout

## References

- [MDN: Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [MDN: Online and Offline Events](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [OWASP: Session Management](https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/06-Session_Management_Testing/README)

## Support

For issues or questions about the session management system, contact the development team or refer to the troubleshooting section above.
