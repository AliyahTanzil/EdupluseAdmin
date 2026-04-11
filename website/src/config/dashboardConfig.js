/**
 * Dashboard Routing Logic
 * 
 * Routes users to role-specific dashboards based on their authentication state
 * and selected role. Handles:
 * - Unauthenticated users → redirect to login
 * - Authenticated but no role selected → redirect to role selection
 * - Each role → appropriate dashboard
 */

// Role to Dashboard Mapping
export const getDashboardForRole = (roleId) => {
  const dashboardMap = {
    // Teacher roles
    'class_master': '/dashboards/teacher',
    'ordinary_teacher': '/dashboards/teacher',
    'departmental_head': '/dashboards/teacher',
    
    // Admin roles
    'ceo': '/dashboards/admin',
    'head_master': '/dashboards/admin',
    'principal': '/dashboards/admin',
    'vice_principal': '/dashboards/admin',
    'secretary': '/dashboards/admin',
    
    // Finance
    'treasurer': '/dashboards/finance',
    
    // Student & Parent
    'student': '/dashboards/student',
    'parent': '/dashboards/parent'
  };
  
  return dashboardMap[roleId] || '/dashboard';
};

/**
 * Check if user should be able to access a specific dashboard
 */
export const canAccessDashboard = (userRole, targetDashboard) => {
  const accessMap = {
    'teacher': ['teacher'],
    'admin': ['admin'],
    'finance': ['finance'],
    'student': ['student'],
    'parent': ['parent']
  };
  
  return accessMap[targetDashboard]?.includes(userRole) || false;
};

/**
 * Get dashboard title based on role
 */
export const getDashboardTitle = (roleId) => {
  const titleMap = {
    'class_master': 'Class Master Dashboard',
    'ordinary_teacher': 'Teacher Dashboard',
    'departmental_head': 'Departmental Head Dashboard',
    'ceo': 'CEO Dashboard',
    'head_master': 'Admin Dashboard',
    'principal': 'Principal Dashboard',
    'vice_principal': 'Vice Principal Dashboard',
    'secretary': 'Admin Dashboard',
    'treasurer': 'Finance Dashboard',
    'student': 'Student Dashboard',
    'parent': 'Parent Dashboard'
  };
  
  return titleMap[roleId] || 'Dashboard';
};

/**
 * Dashboard permission requirements
 * Used to determine which dashboard the user can access based on their permissions
 */
export const dashboardPermissions = {
  'teacher': {
    required: ['view_grades', 'view_attendance'],
    optional: ['manage_attendance', 'create_grades']
  },
  'admin': {
    required: ['view_students', 'view_teachers'],
    optional: ['manage_students', 'manage_teachers', 'manage_classes']
  },
  'finance': {
    required: ['view_all_reports', 'create_reports'],
    optional: []
  },
  'student': {
    required: ['view_grades', 'view_attendance'],
    optional: []
  },
  'parent': {
    required: [],
    optional: []
  }
};

export default {
  getDashboardForRole,
  canAccessDashboard,
  getDashboardTitle,
  dashboardPermissions
};
