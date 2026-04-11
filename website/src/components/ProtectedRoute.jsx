import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/Shared';

/**
 * ProtectedRoute Component
 * Restricts access based on user role and teacher type
 * Supports multiple roles and teacher-specific types
 */

// Helper: resolve the effective base role from user object
// Returns 'admin', 'teacher', 'student', 'parent', or the raw role string
const resolveBaseRole = (user) => {
  if (!user) return null;
  const roleStr = typeof user.role === 'object' ? user.role?.id : user.role;
  
  // Direct base role match
  if (['admin', 'teacher', 'student', 'parent'].includes(roleStr)) {
    return roleStr;
  }
  
  // Fallback: use adminType or teacherType to determine base role
  if (user.adminType) return 'admin';
  if (user.teacherType) return 'teacher';
  
  // Fallback: map known specific role IDs to base roles
  const adminRoleIds = ['head_master', 'principal', 'vice_principal', 'secretary', 'treasurer', 'ceo'];
  const teacherRoleIds = ['class_master', 'ordinary_teacher', 'head_of_department', 'subject_head', 'regular_teacher'];
  if (adminRoleIds.includes(roleStr)) return 'admin';
  if (teacherRoleIds.includes(roleStr)) return 'teacher';
  
  return roleStr; // last resort
};

export const ProtectedRoute = ({ 
  children, 
  requiredRoles = [],
  requiredTeacherTypes = [],
  requireAdmin = false 
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const baseRole = resolveBaseRole(user);

  // Check if admin-only access required
  if (requireAdmin) {
<<<<<<< HEAD
<<<<<<< HEAD
    if (baseRole !== 'admin') {
=======
    const roleStr = typeof user.role === 'object' ? user.role?.id : user.role;
    if (roleStr !== 'admin') {
>>>>>>> 041b17aa (modification)
=======
    if (baseRole !== 'admin') {
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
<<<<<<< HEAD
<<<<<<< HEAD
    if (!requiredRoles.includes(baseRole)) {
=======
    const roleStr = typeof user.role === 'object' ? user.role?.id : user.role;
    if (!requiredRoles.includes(roleStr)) {
>>>>>>> 041b17aa (modification)
=======
    if (!requiredRoles.includes(baseRole)) {
>>>>>>> 5469f3f1 (chore: update gitignore and remove sensitive files)
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check teacher type requirements (if user is a teacher)
  if (requiredTeacherTypes.length > 0) {
    if (baseRole !== 'teacher') {
      return <Navigate to="/unauthorized" replace />;
    }

    const userTeacherType = user.teacherType || user.roleId || 'regular';
    if (!requiredTeacherTypes.includes(userTeacherType)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

/**
 * Hook to check if user has permission
 */
export const usePermission = () => {
  const { user } = useAuth();

  const hasRole = (role) => user?.role === role;

  const hasTeacherType = (type) => {
    if (user?.role !== 'teacher') return false;
    const userType = user.teacherType || 'regular';
    return userType === type;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const hasAnyTeacherType = (types) => {
    if (user?.role !== 'teacher') return false;
    const userType = user.teacherType || 'regular';
    return types.includes(userType);
  };

  const canAccess = (requiredRoles = [], requiredTeacherTypes = []) => {
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
      return false;
    }

    if (requiredTeacherTypes.length > 0) {
      if (user?.role !== 'teacher') return false;
      const userType = user?.teacherType || 'regular';
      if (!requiredTeacherTypes.includes(userType)) {
        return false;
      }
    }

    return true;
  };

  return {
    user,
    hasRole,
    hasTeacherType,
    hasAnyRole,
    hasAnyTeacherType,
    canAccess
  };
};
