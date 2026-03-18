import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/Shared';

/**
 * ProtectedRoute Component
 * Restricts access based on user role and teacher type
 * Supports multiple roles and teacher-specific types
 */
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

  // Check if admin-only access required
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check teacher type requirements (if user is a teacher)
  if (requiredTeacherTypes.length > 0) {
    if (user.role !== 'teacher') {
      return <Navigate to="/unauthorized" replace />;
    }

    const userTeacherType = user.teacherType || 'regular';
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
