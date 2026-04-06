<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
=======
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
>>>>>>> 041b17aa (modification)
import { getApiBaseUrlSync } from '../config/apiConfig';

const AuthContext = createContext();

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;
// Warning timeout (2 minutes before logout)
const WARNING_TIMEOUT = SESSION_TIMEOUT - (2 * 60 * 1000);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  
  const sessionTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const inactivityTimeoutRef = useRef(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user explicitly logged out
        const logoutFlag = sessionStorage.getItem('userLoggedOut');
        
        if (logoutFlag) {
          // User has logged out, don't restore session
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('userLoggedOut');
          setUser(null);
          setIsLoggedOut(true);
        } else {
          const storedUser = localStorage.getItem('user');
          const token = localStorage.getItem('authToken');
          
          if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsLoggedOut(false);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('userLoggedOut');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser is online');
      setIsOnline(true);
      setShowSessionWarning(false);
    };

    const handleOffline = () => {
      console.log('Browser is offline - initiating automatic logout');
      setIsOnline(false);
      // Logout immediately when offline
      if (user) {
        performLogout('Connection lost - You have been logged out for security');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Session timeout and inactivity handling
  useEffect(() => {
    if (!user) return;

    const resetSessionTimeout = () => {
      // Clear existing timeouts
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      setShowSessionWarning(false);

      // Set warning timeout (13 minutes)
      warningTimeoutRef.current = setTimeout(() => {
        console.warn('Session warning: 2 minutes until logout');
        setShowSessionWarning(true);
      }, WARNING_TIMEOUT);

      // Set logout timeout (15 minutes)
      sessionTimeoutRef.current = setTimeout(() => {
        console.log('Session expired due to inactivity');
        performLogout('Your session has expired due to inactivity');
      }, SESSION_TIMEOUT);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, resetSessionTimeout);
    });

    // Initial setup
    resetSessionTimeout();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetSessionTimeout);
      });
      
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      setError(null);
      // Clear explicit-logout state before creating a new session
      sessionStorage.removeItem('userLoggedOut');
      setIsLoggedOut(false);
      const apiBase = getApiBaseUrlSync();
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
<<<<<<< HEAD
        // Use userType as the base role for routing (matches ProtectedRoute/Sidebar checks)
        // userType is always 'admin', 'teacher', 'student', or 'parent'
        role: data.user.userType || (typeof data.user.role === 'string' ? data.user.role : (data.user.role?.id || data.user.role)),
        // Store the specific role ID (e.g., 'head_master', 'class_master', 'ceo')
        roleId: typeof data.user.role === 'object' ? data.user.role.id : data.user.role,
=======
        // Store the full role object for permissions/SchoolSelection
        role: typeof data.user.role === 'string' ? data.user.role : (data.user.role?.id || data.user.role),
>>>>>>> 041b17aa (modification)
        roleObj: typeof data.user.role === 'object' ? data.user.role : null,
        // Admin hierarchy fields
        adminType: data.user.adminType || null,
        assignedSchools: data.user.assignedSchools || [],
        isSuperUser: data.user.isSuperUser || false,
        // Teacher-specific fields
        teacherType: data.user.teacherType || null,
        schoolLevel: data.user.schoolLevel || null,
        // Other user fields
        class: data.user.class,
        subjects: data.user.subjects,
        isClassMaster: data.user.isClassMaster,
        phone: data.user.phone,
        address: data.user.address,
        joinDate: data.user.joinDate,
        department: data.user.department
      };

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedOut(false);

      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const selectRole = async (role) => {
    try {
      setError(null);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update user with selected role details but keep the base role string intact
      // user.role stays as 'admin'/'teacher' etc. for ProtectedRoute/Sidebar checks
      const updatedUser = {
        ...user,
        selectedRole: role,
        roleId: typeof role === 'object' ? role.id : role,
        roleObj: typeof role === 'object' ? role : user.roleObj,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Optional: Send role selection to backend for logging/tracking
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = getApiBaseUrlSync();
        await fetch(`${apiBase}/auth/select-role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            roleId: role.id,
            roleName: role.name
          })
        });
      } catch (err) {
        console.warn('Failed to log role selection on backend:', err);
        // Don't throw - role selection is still valid locally
      }

      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const apiBase = getApiBaseUrlSync();
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // D-13 fix: wrap logout in useCallback to stabilize reference
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Call backend logout endpoint if token exists
      if (token) {
        try {
          const apiBase = getApiBaseUrlSync();
          await fetch(`${apiBase}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (err) {
          console.warn('Backend logout failed, continuing with client-side logout:', err);
        }
      }

      // Set logout flag to prevent session restoration
      sessionStorage.setItem('userLoggedOut', 'true');
      
      // Clear all authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      setIsLoggedOut(true);
      setShowSessionWarning(false);
      
      // Clear all timeouts
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
      
      console.log('Logout completed successfully');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if backend call fails
      sessionStorage.setItem('userLoggedOut', 'true');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      setIsLoggedOut(true);
      setShowSessionWarning(false);
    }
  }, []);  // D-13: stable deps - only uses state setters and refs

  // Perform logout with optional message
  const performLogout = useCallback(async (message) => {
    if (message) {
      setError(message);
    }
    await logout();
  }, [logout]);

  // Extend session when user is still active
  const extendSession = () => {
    setShowSessionWarning(false);
    // Reset activity by simulating an activity event
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    
    // Dispatch custom event to trigger reset
    window.dispatchEvent(new Event('mousedown'));
  };

  // Check if user has a specific permission (with edge case handling)
  const hasPermission = useCallback((permission) => {
    try {
      // Edge case: no user or role
      if (!user || !user.role) return false;
      
      // Edge case: invalid permission parameter types
      if (permission === null || permission === undefined || permission === '') {
        console.warn('hasPermission called with invalid permission:', permission);
        return false;
      }
      
      // Edge case: permission is not a string
      if (typeof permission !== 'string') {
        console.warn('hasPermission called with non-string permission:', typeof permission);
        return false;
      }
      
      // Super admin bypass - check multiple places
      if (user.isSuperUser === true) {
        return true;
      }
      
      // If role is an object with permissions
      const roleObj = user.roleObj || (typeof user.role === 'object' ? user.role : null);
      
      if (roleObj) {
        if (roleObj.isSuperAdmin === true) return true;
        if (Array.isArray(roleObj.permissions)) {
          return roleObj.permissions.includes(permission);
        }
      }
      
      // Admin/CEO roles get all permissions by default
      const roleStr = typeof user.role === 'string' ? user.role : user.role?.id;
      if (roleStr === 'admin' || user.adminType === 'ceo') {
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error in hasPermission:', err);
      // Fail securely - deny access on error
      return false;
    }
  }, [user]);

  // Check if user has any of the given permissions (with edge case handling)
  const hasAnyPermission = (permissions) => {
    try {
      // Edge case: no permissions array provided
      if (!permissions) return false;
      
      // Edge case: permissions is not an array
      if (!Array.isArray(permissions)) {
        console.warn('hasAnyPermission called with non-array permissions:', typeof permissions);
        return false;
      }
      
      // Edge case: empty array
      if (permissions.length === 0) return false;
      
      // Filter out invalid permissions and check
      const validPermissions = permissions.filter(p => typeof p === 'string' && p !== '');
      return validPermissions.some(permission => hasPermission(permission));
    } catch (err) {
      console.error('Error in hasAnyPermission:', err);
      return false;
    }
  };

  // Check if user has all of the given permissions (with edge case handling)
  const hasAllPermissions = (permissions) => {
    try {
      // Edge case: no permissions array provided
      if (!permissions) return false;
      
      // Edge case: permissions is not an array
      if (!Array.isArray(permissions)) {
        console.warn('hasAllPermissions called with non-array permissions:', typeof permissions);
        return false;
      }
      
      // Edge case: empty array (technically user has all zero permissions)
      if (permissions.length === 0) return true;
      
      // Filter out invalid permissions and check
      const validPermissions = permissions.filter(p => typeof p === 'string' && p !== '');
      return validPermissions.length > 0 && validPermissions.every(permission => hasPermission(permission));
    } catch (err) {
      console.error('Error in hasAllPermissions:', err);
      return false;
    }
  };

  const value = React.useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    selectRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAuthenticated: !!user && !isLoggedOut,
    isLoggedOut,
    isOnline,
    showSessionWarning,
    extendSession,
    performLogout
  }), [user, loading, error, isLoggedOut, isOnline, showSessionWarning, login, register, logout, selectRole, hasPermission, hasAnyPermission, hasAllPermissions, extendSession, performLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
