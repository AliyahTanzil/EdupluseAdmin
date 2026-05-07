/**
 * RBAC (Role-Based Access Control) Constants and Utilities
 */

const USER_TYPES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

const SCHOOL_TYPES = {
  PRIMARY: 'primary',
  JUNIOR_SECONDARY: 'junior_secondary',
  SENIOR_SECONDARY: 'senior_secondary',
  NURSERY: 'nursery'
};

const ADMIN_ROLES = {
  SUPER_ADMIN: { id: 'super_admin', name: 'Super Admin' },
  CEO: { id: 'ceo', name: 'CEO' },
  PRINCIPAL: { id: 'principal', name: 'Principal' },
  HEAD_MASTER: { id: 'head_master', name: 'Head Master' },
  REGULAR_ADMIN: { id: 'admin', name: 'Regular Admin' },
  SECRETARY: { id: 'secretary', name: 'Secretary' },
  TREASURER: { id: 'treasurer', name: 'Treasurer' }
};

const TEACHER_ROLES = {
  ORDINARY_TEACHER: { id: 'regular', name: 'Regular Teacher' },
  CLASS_MASTER: { id: 'class_teacher', name: 'Class Teacher' },
  SUBJECT_HEAD: { id: 'subject_head', name: 'Subject Head' },
  DEPARTMENTAL_HEAD: { id: 'departmental_head', name: 'Departmental Head' }
};

/**
 * Get role object by ID
 */
const getRoleById = (id) => {
  const allRoles = {
    ...ADMIN_ROLES,
    ...TEACHER_ROLES,
    student: { id: 'student', name: 'Student' },
    parent: { id: 'parent', name: 'Parent' }
  };
  
  // Search by ID
  return Object.values(allRoles).find(role => role.id === id) || { id, name: id };
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (role, permission) => {
  // This is a simplified version. In a real app, you'd check a permissions matrix.
  // For now, let's assume Super Admin and CEO have all permissions.
  if (role.id === 'super_admin' || role.id === 'ceo') return true;
  
  // Example permission check
  const permissionsMatrix = {
    admin: ['all'],
    principal: ['manage_students', 'manage_teachers', 'view_reports'],
    regular: ['view_own_data'],
    class_teacher: ['manage_class_students', 'mark_attendance'],
    // Add more as needed
  };
  
  const rolePermissions = permissionsMatrix[role.id] || [];
  return rolePermissions.includes('all') || rolePermissions.includes(permission);
};

module.exports = {
  USER_TYPES,
  SCHOOL_TYPES,
  ADMIN_ROLES,
  TEACHER_ROLES,
  getRoleById,
  hasPermission
};
