/**
 * Role-Based Permissions Configuration
 * Defines what each role can access, view, and manage
 */

const ROLE_PERMISSIONS = {
  /**
   * ADMIN Role - Full System Access
   */
  admin: {
    name: 'Administrator',
    description: 'Full system access - manages all aspects of the school system',
    canAccess: {
      routes: ['all'],
      data: ['all']
    },
    pages: {
      dashboard: '/admin-dashboard',
      allowedPages: [
        'dashboard',
        'students',
        'teachers',
        'subjects',
        'timetable',
        'attendance',
        'courses',
        'reports',
        'manage-devices',
        'settings',
        'profile-settings'
      ]
    },
    features: {
      canCreateUsers: true,
      canDeleteUsers: true,
      canEditAllData: true,
      canViewAllReports: true,
      canManageBudget: true,
      canConfigureSettings: true,
      canBackupData: true
    }
  },

  /**
   * TEACHER Roles - Multiple Types
   */
  teacher: {
    /**
     * Regular Teacher - Teaches specific subjects and classes
     */
    regular: {
      name: 'Regular Teacher',
      description: 'Teaches assigned subjects to assigned classes',
      canAccess: {
        routes: [
          'get own profile',
          'view own classes',
          'view own subjects',
          'view assigned students',
          'mark attendance for own class',
          'enter marks for own subjects'
        ],
        data: {
          students: 'only students in assigned class',
          attendance: 'only their class attendance',
          marks: 'only their subject marks',
          timetable: 'only their assigned teaching slots',
          subjects: 'only their assigned subjects'
        }
      },
      pages: {
        dashboard: '/teacher-dashboard',
        allowedPages: [
          'teacher-dashboard',
          'mark-attendance',
          'view-timetable',
          'profile-settings'
        ]
      },
      features: {
        canMarkAttendance: true,
        canEnterMarks: true,
        canViewStudentProgress: true,
        canViewClassPerformance: false,
        canViewAllClassesData: false,
        canManageSubjects: false,
        canCoordinateWithTeachers: false
      },
      dataFilters: {
        students: 'WHERE class = "{teacherClass}"',
        attendance: 'WHERE class = "{teacherClass}"',
        marks: 'WHERE subject IN {teacherSubjects}',
        timetable: 'WHERE class = "{teacherClass}" OR subject IN {teacherSubjects}'
      }
    },

    /**
     * Class Teacher - Heads a specific class
     */
    class_teacher: {
      name: 'Class Teacher',
      description: 'Class head - manages all aspects of a specific class',
      canAccess: {
        routes: [
          'get own profile',
          'view class data',
          'view class students',
          'view class timetable',
          'view class attendance',
          'mark class attendance',
          'view class performance',
          'manage class notices'
        ],
        data: {
          students: 'all students in their class with extended info',
          attendance: 'comprehensive class attendance records',
          marks: 'all subject marks for class students',
          timetable: 'complete class timetable',
          health: 'health records for all class students',
          reports: 'class-specific performance reports'
        }
      },
      pages: {
        dashboard: '/teacher-dashboard',
        allowedPages: [
          'teacher-dashboard',
          'class-attendance',
          'class-timetable',
          'class-subjects',
          'mark-attendance',
          'class-reports',
          'student-list',
          'profile-settings'
        ]
      },
      features: {
        canMarkAttendance: true,
        canEnterMarks: false,
        canViewStudentProgress: true,
        canViewClassPerformance: true,
        canViewAllClassesData: false,
        canManageClassInfo: true,
        canCoordinateWithTeachers: true,
        canGenerateClassReports: true,
        canManageStudentInfo: true,
        canViewHealthRecords: true
      },
      dataFilters: {
        students: 'WHERE class = "{classTeacherClass}"',
        attendance: 'WHERE class = "{classTeacherClass}"',
        marks: 'WHERE class = "{classTeacherClass}"',
        timetable: 'WHERE class = "{classTeacherClass}"',
        health: 'WHERE class = "{classTeacherClass}"'
      }
    },

    /**
     * Subject Head - Oversees a subject across classes
     */
    subject_head: {
      name: 'Subject Head',
      description: 'Subject coordination - oversees subject curriculum, assessment, and teachers',
      canAccess: {
        routes: [
          'get own profile',
          'view subject curriculum',
          'view subject teachers',
          'view all classes offering subject',
          'view subject marks across classes',
          'view subject performance analytics',
          'manage subject assessment criteria',
          'coordinate with subject teachers'
        ],
        data: {
          teachers: 'all teachers teaching their subject',
          students: 'all students taking their subject',
          marks: 'all marks for their subject across classes',
          curriculum: 'their subject curriculum',
          classes: 'all classes offering their subject',
          reports: 'subject performance and assessment reports'
        }
      },
      pages: {
        dashboard: '/teacher-dashboard',
        allowedPages: [
          'teacher-dashboard',
          'subject-head-dashboard',
          'subject-performance',
          'teacher-coordination',
          'curriculum-management',
          'mark-verification',
          'subject-reports',
          'profile-settings'
        ]
      },
      features: {
        canMarkAttendance: false,
        canEnterMarks: false,
        canVerifyMarks: true,
        canViewStudentProgress: true,
        canViewSubjectPerformance: true,
        canManageCurriculum: true,
        canCoordinateWithTeachers: true,
        canSetAssessmentCriteria: true,
        canGenerateSubjectReports: true,
        canEvaluateTeacherPerformance: true
      },
      dataFilters: {
        teachers: 'WHERE "{subjectHeadSubject}" IN subjects',
        students: 'WHERE class IN {subjectClasses} AND "{subjectHeadSubject}" IN subjects',
        marks: 'WHERE subject = "{subjectHeadSubject}"',
        curriculum: 'WHERE subject = "{subjectHeadSubject}"',
        classes: 'WHERE subject = "{subjectHeadSubject}"'
      }
    },

    /**
     * Departmental Head - Oversees entire department
     */
    departmental_head: {
      name: 'Departmental Head',
      description: 'Department management - oversees all subjects, teachers, and operations in department',
      canAccess: {
        routes: [
          'get own profile',
          'view department overview',
          'view all department teachers',
          'view all department subjects',
          'view department students',
          'view department performance',
          'manage department budget',
          'manage department staff',
          'view department reports',
          'manage department curriculum'
        ],
        data: {
          teachers: 'all teachers in their department',
          students: 'all students in their department classes',
          subjects: 'all subjects in their department',
          classes: 'all classes in their department',
          marks: 'all marks in their department',
          budget: 'department budget information',
          reports: 'comprehensive department reports'
        }
      },
      pages: {
        dashboard: '/teacher-dashboard',
        allowedPages: [
          'teacher-dashboard',
          'department-head-dashboard',
          'department-overview',
          'staff-management',
          'performance-analytics',
          'curriculum-management',
          'budget-allocation',
          'department-reports',
          'teacher-coordination',
          'profile-settings'
        ]
      },
      features: {
        canMarkAttendance: false,
        canEnterMarks: false,
        canVerifyMarks: true,
        canViewStudentProgress: true,
        canViewDepartmentPerformance: true,
        canManageCurriculum: true,
        canCoordinateWithTeachers: true,
        canManageBudget: true,
        canEvaluateTeacherPerformance: true,
        canGenerateDepartmentReports: true,
        canHireTeachers: false,
        canFireTeachers: false
      },
      dataFilters: {
        teachers: 'WHERE department = "{department}"',
        students: 'WHERE class IN {departmentClasses}',
        subjects: 'WHERE department = "{department}"',
        classes: 'WHERE department = "{department}"',
        marks: 'WHERE department = "{department}"',
        budget: 'WHERE department = "{department}"'
      }
    }
  },

  /**
   * STUDENT Role
   */
  student: {
    name: 'Student',
    description: 'Student - access own academic information',
    canAccess: {
      routes: [
        'get own profile',
        'view own marks',
        'view own attendance',
        'view own timetable',
        'view own assignments',
        'view class announcements'
      ],
      data: {
        marks: 'only own marks',
        attendance: 'only own attendance',
        timetable: 'own class timetable',
        assignments: 'own class assignments',
        announcements: 'class announcements'
      }
    },
    pages: {
      dashboard: '/student-dashboard',
      allowedPages: [
        'student-dashboard',
        'profile-settings'
      ]
    },
    features: {
      canViewMarks: true,
      canViewAttendance: true,
      canViewTimetable: true,
      canViewAssignments: true,
      canSubmitAssignments: true,
      canEditProfile: false,
      canViewClassmates: true
    }
  },

  /**
   * PARENT Role
   */
  parent: {
    name: 'Parent',
    description: 'Parent/Guardian - access child academic information',
    canAccess: {
      routes: [
        'get own profile',
        'view child marks',
        'view child attendance',
        'view child timetable',
        'view child progress reports',
        'communicate with teachers'
      ],
      data: {
        marks: 'only their children marks',
        attendance: 'only their children attendance',
        timetable: 'their children class timetable',
        reports: 'their children progress reports'
      }
    },
    pages: {
      dashboard: '/parent-dashboard',
      allowedPages: [
        'parent-dashboard',
        'profile-settings'
      ]
    },
    features: {
      canViewMarks: true,
      canViewAttendance: true,
      canViewTimetable: true,
      canViewReports: true,
      canCommunicate: true,
      canEditProfile: true,
      canViewMultipleChildren: true
    }
  }
};

/**
 * Get permissions for a specific role and teacher type
 */
const getPermissions = (role, teacherType = null) => {
  if (role === 'teacher' && teacherType && ROLE_PERMISSIONS.teacher[teacherType]) {
    return ROLE_PERMISSIONS.teacher[teacherType];
  }
  return ROLE_PERMISSIONS[role] || null;
};

/**
 * Check if role has specific feature
 */
const hasFeature = (role, teacherType, feature) => {
  const perms = getPermissions(role, teacherType);
  return perms?.features?.[feature] === true;
};

/**
 * Get allowed pages for role
 */
const getAllowedPages = (role, teacherType = null) => {
  const perms = getPermissions(role, teacherType);
  return perms?.pages?.allowedPages || [];
};

/**
 * Get dashboard for role
 */
const getDashboard = (role, teacherType = null) => {
  const perms = getPermissions(role, teacherType);
  return perms?.pages?.dashboard || '/';
};

/**
 * API Endpoint Permissions by Role
 */
const API_PERMISSIONS = {
  '/api/students': {
    GET: ['admin', 'teacher', 'parent'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin']
  },
  '/api/teachers': {
    GET: ['admin', 'teacher', 'student'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin']
  },
  '/api/attendance': {
    GET: ['admin', 'teacher', 'student', 'parent'],
    POST: ['admin', 'teacher'],
    PUT: ['admin', 'teacher'],
    DELETE: ['admin']
  },
  '/api/marks': {
    GET: ['admin', 'teacher', 'student', 'parent'],
    POST: ['admin', 'teacher'],
    PUT: ['admin', 'teacher'],
    DELETE: ['admin']
  },
  '/api/timetable': {
    GET: ['admin', 'teacher', 'student', 'parent'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin']
  },
  '/api/subjects': {
    GET: ['admin', 'teacher', 'student'],
    POST: ['admin'],
    PUT: ['admin'],
    DELETE: ['admin']
  },
  '/api/reports': {
    GET: ['admin', 'teacher', 'parent'],
    POST: ['admin', 'teacher'],
    PUT: ['admin'],
    DELETE: ['admin']
  }
};

/**
 * Data access level definitions
 */
const DATA_ACCESS_LEVELS = {
  FULL: 'full_access',           // View all data
  DEPARTMENT: 'department',       // Department-level access
  CLASS: 'class',                 // Class-level access
  SUBJECT: 'subject',             // Subject-level access
  OWN: 'own_data',               // Own data only
  CHILDREN: 'children_data',      // Own children data
  NONE: 'no_access'              // No access
};

module.exports = {
  ROLE_PERMISSIONS,
  getPermissions,
  hasFeature,
  getAllowedPages,
  getDashboard,
  API_PERMISSIONS,
  DATA_ACCESS_LEVELS
};
