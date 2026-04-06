# 🎨 Frontend Implementation Guide - UI/UX Based on Mockups

**Version:** 1.0.0  
**Target:** Phase 2 Dashboard Implementation  
**Status:** Ready for Development

---

## Overview

This guide provides detailed specifications for building the frontend based on the design mockups provided in the `Images/` folder. All dashboard layouts, components, and responsive behavior are documented here.

---

## Dashboard Layouts to Implement

### 1. Student Dashboard (`Images/Dashboard.jpeg`)

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Navigation + User Profile + Logout             │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│   SIDEBAR    │         MAIN CONTENT AREA                 │
│   Navigation │                                           │
│              │  - Welcome section                        │
│              │  - Statistics cards                       │
│              │  - Charts & graphs                        │
│              │  - Recent activity                        │
│              │  - Quick actions                          │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘
```

#### Components to Create

**1. Header Component**
```jsx
export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-blue-600">EduPlus</span>
          <span className="text-gray-600">Admin</span>
        </div>

        {/* Center - School/Role Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">Current School</p>
          <p className="font-semibold">Senior Secondary School</p>
        </div>

        {/* Right - User Profile + Settings */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <img src="avatar" className="w-8 h-8 rounded-full" />
            <div className="text-sm">
              <p className="font-semibold">John Doe</p>
              <p className="text-gray-500 text-xs">Student</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

**2. Sidebar Component**
```jsx
export function Sidebar({ active }) {
  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: BookOpen, label: 'My Classes', id: 'classes' },
    { icon: FileText, label: 'Assignments', id: 'assignments' },
    { icon: BarChart3, label: 'Grades', id: 'grades' },
    { icon: Calendar, label: 'Attendance', id: 'attendance' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 px-6 py-8">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              active === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="w-full mt-8 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
```

**3. Statistics Cards Component**
```jsx
export function StatCard({ icon: Icon, label, value, bgColor = 'bg-blue-50' }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon size={32} className="text-gray-400" />
      </div>
    </div>
  );
}

export function StatisticsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={BookOpen}
        label="Enrolled Classes"
        value="8"
        bgColor="bg-blue-50"
      />
      <StatCard
        icon={CheckCircle}
        label="Completed Assignments"
        value="24"
        bgColor="bg-green-50"
      />
      <StatCard
        icon={Award}
        label="Average Grade"
        value="A-"
        bgColor="bg-purple-50"
      />
      <StatCard
        icon={TrendingUp}
        label="Attendance"
        value="96%"
        bgColor="bg-amber-50"
      />
    </div>
  );
}
```

**4. Classes Section**
```jsx
export function ClassCard({ name, teacher, schedule, students }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
          Active
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p className="flex items-center gap-2">
          <Users size={16} /> {students} Students
        </p>
        <p className="flex items-center gap-2">
          <Clock size={16} /> {schedule}
        </p>
        <p className="flex items-center gap-2">
          <User size={16} /> {teacher}
        </p>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        View Details
      </button>
    </div>
  );
}

export function ClassesSection() {
  const classes = [
    { name: 'Mathematics 101', teacher: 'Mr. Smith', schedule: 'MWF 9:00-10:30', students: 32 },
    { name: 'English Literature', teacher: 'Ms. Johnson', schedule: 'TTh 10:00-11:30', students: 28 },
    { name: 'Biology', teacher: 'Dr. Wilson', schedule: 'MWF 1:00-2:30', students: 24 },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassCard key={cls.name} {...cls} />
        ))}
      </div>
    </div>
  );
}
```

**5. Recent Assignments Section**
```jsx
export function AssignmentItem({ title, subject, dueDate, status }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-green-100 text-green-800',
    graded: 'bg-blue-100 text-blue-800',
  };

  const daysUntil = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{subject}</p>
      </td>
      <td className="px-6 py-4 text-gray-600">{dueDate}</td>
      <td className="px-6 py-4">
        {daysUntil > 0 ? (
          <span className="text-sm text-gray-600">{daysUntil} days left</span>
        ) : (
          <span className="text-sm text-red-600">Overdue</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <button className="text-blue-600 hover:underline">View</button>
      </td>
    </tr>
  );
}

export function RecentAssignmentsSection() {
  const assignments = [
    { title: 'Calculus Problem Set', subject: 'Mathematics 101', dueDate: '2024-03-28', status: 'pending' },
    { title: 'Essay on Shakespeare', subject: 'English Literature', dueDate: '2024-03-25', status: 'submitted' },
    { title: 'Lab Report', subject: 'Biology', dueDate: '2024-03-20', status: 'graded' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Assignments</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assignment</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time Left</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <AssignmentItem key={assignment.title} {...assignment} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### 2. Admin Dashboard (`Images/Admin.jpeg`)

#### Layout Structure (Similar to Student but Different Sections)

**Key Sections:**

**1. System Overview Cards**
```jsx
export function AdminDashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Users}
        label="Total Users"
        value="2,543"
        bgColor="bg-blue-50"
      />
      <StatCard
        icon={Building2}
        label="Schools"
        value="3"
        bgColor="bg-green-50"
      />
      <StatCard
        icon={UserCheck}
        label="Active Today"
        value="1,892"
        bgColor="bg-purple-50"
      />
      <StatCard
        icon={AlertCircle}
        label="Pending Tasks"
        value="12"
        bgColor="bg-red-50"
      />
    </div>
  );
}
```

**2. User Management Table**
```jsx
export function UserManagementSection() {
  const [users, setUsers] = useState([]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">School</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-semibold">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.school}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:underline text-sm">Edit</button>
                    <button className="text-red-600 hover:underline text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**3. Activity Log**
```jsx
export function ActivityLog() {
  const activities = [
    { user: 'John Smith', action: 'Created student account', timestamp: '2 hours ago', type: 'create' },
    { user: 'Jane Doe', action: 'Updated class settings', timestamp: '4 hours ago', type: 'update' },
    { user: 'Admin User', action: 'Deleted inactive teacher', timestamp: '1 day ago', type: 'delete' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold">{activity.user}</p>
              <p className="text-gray-600 text-sm">{activity.action}</p>
              <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Responsive Design Implementation

### Mobile Breakpoints Strategy

#### 1. Mobile (< 640px)
```jsx
export function StudentDashboardMobile() {
  return (
    <div className="flex flex-col">
      {/* Compact Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Senior Secondary</p>
      </div>

      {/* Stats - Single Column */}
      <div className="p-4 space-y-3">
        <StatCard icon={BookOpen} label="Classes" value="8" />
        <StatCard icon={CheckCircle} label="Assignments" value="24" />
        <StatCard icon={Award} label="Grade" value="A-" />
        <StatCard icon={TrendingUp} label="Attendance" value="96%" />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around">
        <NavItem icon={Home} label="Home" active />
        <NavItem icon={BookOpen} label="Classes" />
        <NavItem icon={FileText} label="Work" />
        <NavItem icon={BarChart3} label="Grades" />
        <NavItem icon={MessageSquare} label="Messages" />
      </nav>
    </div>
  );
}
```

#### 2. Tablet (640px - 1024px)
```jsx
// Use 2-column grid layouts
// Hide sidebar, show hamburger menu
// Show bottom drawer for navigation
```

#### 3. Desktop (> 1024px)
```jsx
// Full layout with sidebar
// Multi-column grids
// All navigation items visible
```

---

## Component Library

### Reusable Components

```jsx
// Button Component
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) {
  const baseClass = 'rounded-lg font-semibold transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Component
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}

// Modal Component
export function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Alert Component
export function Alert({ type = 'info', children }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[type]}`}>
      {children}
    </div>
  );
}

// Input Component
export function Input({ label, error, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>}
      <input 
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
```

---

## Dark Mode Support (Optional)

```jsx
export function useDarkMode() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('darkMode', isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return [isDark, setIsDark];
}
```

---

## Loading States

```jsx
export function Skeleton({ width = 'w-full', height = 'h-4' }) {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border">
            <Skeleton width="w-24" height="h-6" />
            <Skeleton width="w-32" height="h-4" className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Form Validation Example

```jsx
export function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    adminType: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.fullName) {
      newErrors.fullName = 'Full name required';
    }
    if (!formData.adminType) {
      newErrors.adminType = 'Admin type required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit form
      console.log('Valid form:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        error={errors.fullName}
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Admin Type
        </label>
        <select
          value={formData.adminType}
          onChange={(e) => setFormData({ ...formData, adminType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Admin Type</option>
          <option value="ceo">CEO Admin</option>
          <option value="principal">Principal</option>
          <option value="admin">Regular Admin</option>
        </select>
        {errors.adminType && <p className="text-red-600 text-sm mt-1">{errors.adminType}</p>}
      </div>

      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
```

---

## Next Steps

1. **Create the component files** in `website/src/components/`
2. **Build the Student Dashboard** page
3. **Build the Admin Dashboard** page
4. **Test responsiveness** on mobile, tablet, desktop
5. **Connect to backend API** for real data
6. **Style refinements** based on mockup review

---

**Ready to start building?** Choose a dashboard layout and begin implementing components!

