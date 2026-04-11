import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardForRole } from '../config/dashboardConfig';

/**
 * DashboardRouter Component
 * 
 * Intelligently routes users to the correct dashboard based on their role.
 * Handles various scenarios:
 * 1. Unauthenticated users → /login
 * 2. Authenticated but no role → /role-selection
 * 3. Authenticated with role → appropriate role-specific dashboard
 */
const DashboardRouter = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but no role selected - redirect to role selection
  if (!user.role && !user.roleId) {
    return <Navigate to="/role-selection" replace />;
  }

  // Get appropriate dashboard for user's role
  // Use specific roleId (e.g., 'head_master', 'ceo') or fall back to base role
  const dashboardPath = getDashboardForRole(user.roleId || user.role);
  
  // Redirect to appropriate dashboard
  return <Navigate to={dashboardPath} replace />;
};

export default DashboardRouter;
