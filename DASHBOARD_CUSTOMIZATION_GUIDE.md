# Dashboard Component Customization Guide

## Overview
This guide explains how to customize and extend the dashboard components for additional features, statistics, or layout changes.

---

## Component Files

### File Locations:
```
website/src/pages/
├── AdminDashboard.jsx       (Admin role dashboard)
├── TeacherDashboard.jsx     (Teacher role dashboard)
├── StudentDashboard.jsx     (Student role dashboard)
└── ParentDashboard.jsx      (Parent role dashboard)
```

---

## Adding New Statistics Cards

### Step 1: Add to `statCards` Array
```javascript
// Inside the component, locate the statCards definition
const statCards = [
  // ... existing cards
  {
    title: 'New Stat Title',
    value: stats.newStatValue,           // Value from state
    icon: NewIconName,                   // From lucide-react
    color: 'blue',                       // Color theme
    trend: 'Trend description'           // Subtitle text
  }
];
```

### Step 2: Add to State
```javascript
const [stats, setStats] = useState({
  // ... existing stats
  newStatValue: 0,                       // Initialize stat
});
```

### Step 3: Update Fetch Logic
```javascript
// In fetchDashboardStats function
const newStatRes = await fetch('http://localhost:5000/api/new-endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const newStatData = await newStatRes.json();

// Update stats
setStats(prev => ({
  ...prev,
  newStatValue: newStatData.count || 0
}));
```

### Color Options for Stats:
- `'blue'` - bg-blue-50, text-blue-700
- `'green'` - bg-green-50, text-green-700
- `'purple'` - bg-purple-50, text-purple-700
- `'orange'` - bg-orange-50, text-orange-700
- `'red'` - bg-red-50, text-red-700
- `'cyan'` - bg-cyan-50, text-cyan-700
- `'pink'` - bg-pink-50, text-pink-700

---

## Adding New Action Items

### Step 1: Add to `menuItems` Array
```javascript
const menuItems = [
  // ... existing items
  {
    title: 'New Feature',
    description: 'Feature description here',
    icon: NewIcon,                    // From lucide-react
    onClick: () => navigate('/path-to-feature'),
    color: 'from-X-500 to-X-600'     // Gradient colors
  }
];
```

### Available Gradient Options:
```
'from-blue-500 to-blue-600'
'from-green-500 to-green-600'
'from-purple-500 to-purple-600'
'from-orange-500 to-orange-600'
'from-red-500 to-red-600'
'from-yellow-500 to-yellow-600'
'from-cyan-500 to-cyan-600'
'from-pink-500 to-pink-600'
'from-indigo-500 to-indigo-600'
```

### Step 2: Create the Target Page
```javascript
// Create a new page component
// website/src/pages/NewFeature.jsx
export default function NewFeature() {
  // Your component logic
}
```

### Step 3: Add Route to App.jsx
```javascript
// Import the new component
import NewFeature from './pages/NewFeature';

// Add the route
<Route
  path="/new-feature"
  element={
    <ProtectedRoute requiredRoles={['admin']}>
      <NewFeature />
    </ProtectedRoute>
  }
/>
```

---

## Modifying Statistics Display

### Change Number Format:
```javascript
// From:
<p className="text-3xl font-bold text-gray-900">{stat.value}</p>

// To (e.g., percentages):
<p className="text-3xl font-bold text-gray-900">
  {typeof stat.value === 'number' ? `${stat.value.toFixed(1)}%` : stat.value}
</p>
```

### Add Sparklines or Charts:
```javascript
// Install: npm install recharts
import { LineChart, Line } from 'recharts';

// Add to stat card:
<LineChart width={100} height={50} data={stat.chartData}>
  <Line type="monotone" dataKey="value" stroke="#3b82f6" />
</LineChart>
```

---

## Styling Customizations

### Change Card Hover Effect:
```javascript
// Current:
className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"

// Options:
// Subtle: "cursor-pointer hover:shadow-md transition-shadow duration-200"
// Smooth: "cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300"
// Dark: "cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
```

### Modify Grid Layout:
```javascript
// Admin (currently 5 columns):
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

// Change to 4 columns:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Change to 6 columns:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
```

### Adjust Spacing:
```javascript
// Gap between cards
gap-4        // Small (1rem)
gap-6        // Medium (1.5rem) - current
gap-8        // Large (2rem)
gap-10       // Extra Large (2.5rem)

// Padding inside cards
p-4          // Small (1rem)
p-6          // Medium (1.5rem) - current
p-8          // Large (2rem)
```

---

## Fetching Data from New APIs

### Template for Adding New Data Source:
```javascript
const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    // Single endpoint
    const res = await fetch('http://localhost:5000/api/endpoint', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    // Multiple parallel endpoints
    const [res1, res2, res3] = await Promise.all([
      fetch('endpoint1', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('endpoint2', { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch('endpoint3', { headers: { 'Authorization': `Bearer ${token}` } })
    ]);
    
    const data1 = await res1.json();
    const data2 = await res2.json();
    const data3 = await res3.json();
    
    // Update state
    setStats({
      totalStudents: data1.data?.length || 0,
      // ... other stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to mock data
  } finally {
    setLoading(false);
  }
};
```

---

## Icon Changes

### Available Icons from lucide-react:
```javascript
// Import examples:
import { 
  Users, BookOpen, BarChart3, Clock, TrendingUp,
  Award, Bell, Mail, Heart, AlertCircle,
  GraduationCap, User, ChevronDown, LogOut,
  Settings, Zap, FileText, Wifi
} from 'lucide-react';

// Size options:
size={18}  // Small
size={20}  // Medium (header)
size={24}  // Large (action cards)
size={32}  // Extra Large (old style)

// Color options:
className="text-blue-600"
className="text-green-600"
className="text-white"  // For gradient background
className="text-2xl opacity-50"  // In stat cards
```

### To find more icons:
Visit [lucide.dev](https://lucide.dev) and search for icon names.

---

## Conditional Display

### Show/Hide Elements by Role:
```javascript
// Example: Show only for class masters
{user?.isClassMaster && (
  <Card>
    {/* Class Master exclusive content */}
  </Card>
)}

// Example: Show only for super admins
{user?.isSuperUser && (
  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
    Super Admin Features
  </div>
)}
```

### Conditional Styling:
```javascript
const getColorClass = (color) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    // ... add more colors
  };
  return colors[color] || colors.blue;
};

// Usage:
className={getColorClass(stat.color)}
```

---

## Adding Real-Time Updates

### Auto-Refresh Every 30 Seconds:
```javascript
useEffect(() => {
  // Initial fetch
  fetchDashboardStats();
  
  // Auto-refresh
  const interval = setInterval(fetchDashboardStats, 30000);
  
  // Cleanup
  return () => clearInterval(interval);
}, []);
```

### WebSocket Integration:
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:5000/stats');
  
  ws.onmessage = (event) => {
    const newStats = JSON.parse(event.data);
    setStats(prev => ({ ...prev, ...newStats }));
  };
  
  return () => ws.close();
}, []);
```

---

## Animation Customizations

### Button Hover Effects:
```javascript
// Subtle
className="transition-colors duration-200"

// Smooth scale
className="hover:scale-105 transition-transform duration-300"

// Combine multiple
className="hover:shadow-lg hover:scale-105 transition-all duration-300"

// Bounce
className="hover:animate-bounce"
```

### Transition Durations:
```
duration-75   // 75ms
duration-100  // 100ms
duration-150  // 150ms
duration-200  // 200ms (current)
duration-300  // 300ms
duration-500  // 500ms
```

---

## Profile Menu Customization

### Add More Menu Items:
```javascript
{showProfileMenu && (
  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-2xl">
    {/* Existing items */}
    
    {/* New item */}
    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
      <Icon size={18} />
      New Option
    </button>
  </div>
)}
```

---

## Common Customization Tasks

### 1. Change Dashboard Title:
```javascript
// Old:
<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

// New:
<h1 className="text-3xl font-bold text-gray-900">System Administration Panel</h1>
```

### 2. Modify Welcome Message:
```javascript
// Old:
<p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>

// New:
<p className="text-gray-600 mt-1">
  Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.name}!
</p>
```

### 3. Add Custom Statistics Calculation:
```javascript
// Example: Calculate attendance percentage
const attendancePercent = Math.round(
  (stats.presentStudents / stats.totalAttendanceToday) * 100
);

// Add to stats
setStats(prev => ({
  ...prev,
  attendancePercentage: attendancePercent + '%'
}));
```

### 4. Filter Menu Items Dynamically:
```javascript
// Show different actions based on user properties
const visibleMenuItems = menuItems.filter(item => {
  if (item.requiresAdmin && !user?.isSuperUser) return false;
  if (item.requiresClassMaster && !user?.isClassMaster) return false;
  return true;
});

// Then render:
{visibleMenuItems.map((item) => /* render */)}
```

---

## Performance Optimization

### Memoization for Stat Cards:
```javascript
import { useMemo } from 'react';

const MemoStatCard = useMemo(() => {
  return statCards.map(stat => ({
    // stat data
  }));
}, [stats]);
```

### Lazy Load Non-Critical Data:
```javascript
const [detailedStats, setDetailedStats] = useState(null);
const [showDetails, setShowDetails] = useState(false);

const loadDetails = () => {
  fetchDetailedStats();
  setShowDetails(true);
};
```

---

## Testing Component Changes

### Verify After Changes:
1. Check browser console for errors
2. Verify statistics display correctly
3. Test click handlers work
4. Test responsive layout on mobile/tablet
5. Verify API calls succeed
6. Check styling consistency

### Debug Tips:
```javascript
// Log state changes
useEffect(() => {
  console.log('Stats updated:', stats);
}, [stats]);

// Log user data
useEffect(() => {
  console.log('User data:', user);
}, [user]);

// Log fetch responses
.then(data => {
  console.log('API Response:', data);
  return data;
})
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Icons not showing | Icon not imported | Add to import statement |
| Layout breaks | Wrong grid columns | Check lg:grid-cols-X values |
| Colors not applying | Typo in color name | Use exact Tailwind names |
| Dropdown doesn't close | Missing event handler | Add onClick={(e) => e.stopPropagation()} |
| Stats show 0 | API not returning data | Check API endpoint and response format |
| Animations lag | Too many transitions | Reduce number of animated elements |

---

*Dashboard Customization Guide*
*Last Updated: March 16, 2026*
