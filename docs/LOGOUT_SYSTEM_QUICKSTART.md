# Automatic Logout System - Quick Setup Guide

## What Was Changed?

The system now automatically logs out users in these scenarios:

1. **Browser Loses Connection** ⚡ - Immediate logout
2. **15 Minutes of Inactivity** ⏱️ - Automatic logout with 2-minute warning
3. **Browser Closes** 🔒 - Session not restored

## Key Components Added

### 1. **SessionWarning.jsx** - Warning Dialog
Shows when session is about to expire in 2 minutes
- Countdown timer
- "Stay Logged In" button to extend session
- "Logout Now" button for immediate logout
- Connection status indicator

### 2. **OfflineNotification.jsx** - Connection Status
Displays at top-right corner
- Shows when offline (red)
- Shows when back online (green)
- Auto-dismisses

### 3. **sessionConfig.js** - Configuration
Centralized settings for session management
```javascript
SESSION_TIMEOUT: 15 * 60 * 1000  // 15 minutes
WARNING_TIMEOUT: 13 * 60 * 1000  // Warning at 13 minutes
```

### 4. **Updated AuthContext.jsx**
- Offline/online detection
- Session inactivity tracking
- Auto-logout logic
- Activity event listeners

## How It Works

### Scenario 1: Offline Detection
```
User loses internet
    ↓
Browser fires 'offline' event
    ↓
System logs user out immediately
    ↓
User sees: "Connection lost - You have been logged out"
```

### Scenario 2: Inactivity Timeout
```
User logs in
    ↓
No activity for 13 minutes
    ↓
Warning modal appears with 2-minute countdown
    ↓
If no action taken → Auto-logout
    ↓
If "Stay Logged In" clicked → Session extends 15 more minutes
```

### Scenario 3: Activity Detected
```
User moves mouse / types / scrolls / touches
    ↓
Activity timer resets
    ↓
15-minute countdown starts again
```

## Testing the System

### Test 1: Offline Logout
1. Open the app and log in
2. Open DevTools (F12)
3. Go to Network tab
4. Check "Offline" checkbox
5. ✅ Should logout immediately with notification

### Test 2: Inactivity Timeout
1. Log in
2. Don't touch keyboard/mouse
3. Wait 13 minutes
4. ✅ Warning dialog should appear
5. Click "Stay Logged In"
6. ✅ Session extends and dialog closes

### Test 3: Activity Reset
1. Log in
2. Move mouse around
3. ✅ Activity timer resets (works in background)
4. Session won't expire during activity

## Configuration

To customize timeouts, edit `website/src/config/sessionConfig.js`:

```javascript
// Change from 15 minutes to 20 minutes
SESSION_TIMEOUT: 20 * 60 * 1000,

// Warning shows 2 minutes before logout (at 18 minutes)
WARNING_TIMEOUT: 18 * 60 * 1000,
```

## Files Modified

```
website/src/
├── App.jsx                          (Added notification components)
├── contexts/
│   └── AuthContext.jsx              (Added session management)
├── components/
│   ├── SessionWarning.jsx           (NEW)
│   └── OfflineNotification.jsx      (NEW)
└── config/
    └── sessionConfig.js             (NEW)

Root/
└── AUTOMATIC_LOGOUT_SYSTEM.md       (NEW - Full documentation)
```

## User Experience

### What Users See

**Offline:**
```
[⚠️ No Connection]
[You will be logged out immediately]
```

**Session Warning:**
```
[⚠️ Session Expiring]
[Your session is about to expire due to inactivity]
[14:32 remaining]
[Stay Logged In] [Logout Now]
```

## Security Features

✅ Immediate logout on connection loss
✅ 15-minute inactivity timeout
✅ 2-minute warning before logout
✅ Clear all tokens from storage
✅ Prevent session restoration after logout
✅ Auto-extend session during active use

## Browser Compatibility

| Browser | Offline API | Event Support | Status |
|---------|------------|--------------|--------|
| Chrome | ✅ | ✅ | Supported |
| Firefox | ✅ | ✅ | Supported |
| Safari | ✅ | ✅ | Supported |
| Edge | ✅ | ✅ | Supported |
| IE 11 | ⚠️ | ⚠️ | Partial |

## Troubleshooting

### Issue: Not logging out when offline
**Solution:** 
- Check DevTools Network tab → make sure "Offline" is enabled
- Refresh page
- Check browser console for errors

### Issue: Warning not appearing after 13 minutes
**Solution:**
- Check `SESSION_CONFIG` in `sessionConfig.js`
- Verify no activity for full 13 minutes
- Check if page is active/focused (some browsers pause timers for background tabs)

### Issue: Session extending unexpectedly
**Solution:**
- Check if activity events are being triggered (mouse, keyboard)
- Any accidental mouse movement resets the timer
- This is intentional - only true inactivity triggers logout

## Next Steps

1. ✅ System is ready to use
2. 📝 Review the [Full Documentation](./AUTOMATIC_LOGOUT_SYSTEM.md)
3. 🧪 Test each scenario
4. 🔧 Adjust timeouts if needed in `sessionConfig.js`
5. 🚀 Deploy to production

## Support

For detailed information, see: `AUTOMATIC_LOGOUT_SYSTEM.md`

Questions? Check the troubleshooting section or contact the development team.
