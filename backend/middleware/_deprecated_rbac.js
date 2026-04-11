/**
 * Role-Based Access Control (RBAC) Middleware
 * Handles permission verification for different user roles and teacher types
 */

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and extract user information
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to authenticate user via JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  req.user = decoded;
  next();
};

/**
 * Permission definitions for different roles and teacher types
 */
const permissions = {
  admin: {
    canAccess: ['all'],
    canView: ['all_students', 'all_teachers', 'all_classes', 'all_subjects', 'all_attendance', 'all_reports', 'devices'],
    canManage: ['all_students', 'all_teachers', 'all_classes', 'all_subjects', 'settings'],
    dashboardPages: ['admin-dashboard', 'students', 'teachers', 'subjects', 'timetable', 'attendance', 'courses', 'reports', 'devices']
  },
  
  teacher: {
    regular: {
      canAccess: ['own_class_data', 'own_subject_data'],
      canView: ['own_students', 'own_class_attendance', 'own_subject_marks'],
      canManage: ['mark_attendance', 'enter_marks'],
      dashboardPages: ['teacher-dashboard', 'mark-attendance'],
      dataFilters: {
        students: 'filter by assigned class',
        attendance: 'filter by assigned class',
        marks: 'filter by assigned subjects',
        timetable: 'filter by assigned subjects'
      }
    },

    class_teacher: {
      canAccess: ['class_data', 'class_students', 'class_attendance', 'class_reports'],
      canView: ['class_students', 'class_attendance', 'class_performance', 'class_health_status'],
      canManage: ['class_attendance', 'student_info_corrections', 'class_reports'],
      dashboardPages: ['teacher-dashboard', 'class-specific', 'mark-attendance', 'class-attendance', 'class-timetable', 'class-subjects'],
      dataFilters: {
        students: 'only students in their class',
        attendance: 'only their class attendance',
        marks: 'all subjects in their class',
        reports: 'class-specific reports'
      }
    },

    subject_head: {
      canAccess: ['subject_curriculum', 'subject_teachers', 'subject_students', 'subject_marks', 'subject_assessment'],
      canView: ['all_subject_teachers', 'subject_performance', 'subject_coverage', 'student_marks_by_subject'],
      canManage: ['curriculum', 'assessment_criteria', 'mark_verification', 'teacher_coordination'],
      dashboardPages: ['teacher-dashboard', 'subject-head-dashboard', 'subject-performance', 'teacher-coordination', 'curriculum-management'],
      dataFilters: {
        teachers: 'only subject teachers',
        students: 'students taking their subject',
        marks: 'only their subject marks',
        classes: 'classes offering their subject'
      }
    },

    departmental_head: {
      canAccess: ['department_data', 'department_budget', 'department_staff', 'department_reports', 'department_curriculum'],
      canView: ['all_department_teachers', 'department_performance', 'department_resources', 'teacher_performance', 'subject_performance'],
      canManage: ['department_reports', 'staff_performance_evaluation', 'budget_allocation', 'curriculum_oversight', 'teacher_coordination'],
      dashboardPages: ['teacher-dashboard', 'department-head-dashboard', 'department-overview', 'staff-management', 'performance-analytics'],
      dataFilters: {
        teachers: 'only department teachers',
        students: 'students in department',
        classes: 'classes in department',
        subjects: 'subjects in department',
        reports: 'department reports'
      }
    }
  },

  student: {
    canAccess: ['own_data', 'own_class_info', 'own_marks', 'own_attendance'],
    canView: ['own_marks', 'own_attendance', 'own_timetable', 'own_assignments'],
    canManage: ['none'],
    dashboardPages: ['student-dashboard'],
    dataFilters: {
      attendance: 'only own attendance',
      marks: 'only own marks',
      timetable: 'only assigned classes'
    }
  },

  parent: {
    canAccess: ['child_data', 'child_attendance', 'child_marks', 'child_progress'],
    canView: ['child_attendance', 'child_marks', 'child_progress_reports', 'child_timetable'],
    canManage: ['none'],
    dashboardPages: ['parent-dashboard'],
    dataFilters: {
      students: 'only their children',
      attendance: 'only their children attendance',
      marks: 'only their children marks'
    }
  }
};

/**
 * Check if user has permission to access a route
 */
const hasPermission = (user, requiredPermission) => {
  if (!user) return false;

  if (user.role === 'admin') {
    return true;
  }

  if (user.role === 'teacher') {
    const teacherType = user.teacherType || 'regular';
    const teacherPerms = permissions.teacher[teacherType];
    if (!teacherPerms) return false;

    if (teacherPerms.canAccess.includes('all')) return true;
    if (teacherPerms.canAccess.includes(requiredPermission)) return true;
    if (teacherPerms.canManage.includes(requiredPermission)) return true;

    return false;
  }

  const userPerms = permissions[user.role];
  if (!userPerms) return false;

  return userPerms.canAccess.includes(requiredPermission) || userPerms.canManage.includes(requiredPermission);
};

/**
 * Get allowed pages for a user based on their role and type
 */
const getAllowedPages = (user) => {
  if (!user) return [];

  if (user.role === 'admin') {
    return permissions.admin.dashboardPages;
  }

  if (user.role === 'teacher') {
    const teacherType = user.teacherType || 'regular';
    return permissions.teacher[teacherType]?.dashboardPages || [];
  }

  return permissions[user.role]?.dashboardPages || [];
};

/**
 * Middleware to require specific permissions
 */
const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (!hasPermission(decoded, requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requiredPermission
      });
    }

    req.user = decoded;
    next();
  };
};

/**
 * Middleware to require specific teacher type
 */
const requireTeacherType = (allowedTypes) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (decoded.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Teacher access only'
      });
    }

    const teacherType = decoded.teacherType || 'regular';
    if (!allowedTypes.includes(teacherType)) {
      return res.status(403).json({
        success: false,
        message: `Access restricted to: ${allowedTypes.join(', ')}`
      });
    }

    req.user = decoded;
    next();
  };
};

/**
 * Filter data based on user role
 */
const filterDataByRole = (user, data, resourceType) => {
  if (!user) return [];
  if (user.role === 'admin') return data;

  if (user.role === 'teacher') {
    const teacherType = user.teacherType || 'regular';
    
    switch (teacherType) {
      case 'regular':
        // Regular teachers see only their class and subjects
        if (resourceType === 'students') {
          return data.filter(s => user.class && s.class === user.class);
        }
        if (resourceType === 'marks') {
          return data.filter(m => user.subjects && user.subjects.includes(m.subject));
        }
        break;

      case 'class_teacher':
        // Class teachers see only their class data
        if (resourceType === 'students') {
          return data.filter(s => user.class && s.class === user.class);
        }
        if (resourceType === 'attendance') {
          return data.filter(a => user.class && a.class === user.class);
        }
        break;

      case 'subject_head':
        // Subject heads see only their subject data
        if (resourceType === 'teachers') {
          return data.filter(t => t.subjects && t.subjects.includes(user.headingSubject));
        }
        if (resourceType === 'students') {
          return data.filter(s => user.classes && user.classes.includes(s.class));
        }
        if (resourceType === 'marks') {
          return data.filter(m => m.subject === user.headingSubject);
        }
        break;

      case 'departmental_head':
        // Departmental heads see all department data
        if (resourceType === 'teachers') {
          return data.filter(t => t.department === user.department);
        }
        if (resourceType === 'students') {
          return data.filter(s => user.classes && user.classes.includes(s.class));
        }
        if (resourceType === 'classes') {
          return data.filter(c => user.classes && user.classes.includes(c.id));
        }
        break;
    }
  }

  if (user.role === 'student') {
    if (resourceType === 'marks') {
      return data.filter(m => m.studentId === user.id);
    }
    if (resourceType === 'attendance') {
      return data.filter(a => a.studentId === user.id);
    }
  }

  if (user.role === 'parent') {
    if (resourceType === 'students') {
      return data.filter(s => user.children && user.children.includes(s.id));
    }
    if (resourceType === 'marks') {
      return data.filter(m => user.children && user.children.includes(m.studentId));
    }
  }

  return data;
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireTeacherType,
  hasPermission,
  getAllowedPages,
  filterDataByRole,
  permissions,
  verifyToken
};
