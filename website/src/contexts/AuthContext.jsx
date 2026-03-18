import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
      const response = await fetch('http://localhost:5001/api/auth/login', {
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
        role: data.user.role,
        class: data.user.class,
        subjects: data.user.subjects,
        isClassMaster: data.user.isClassMaster,
        isSuperUser: data.user.isSuperUser || false,
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

  const register = async (formData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5001/api/auth/register', {
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

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Call backend logout endpoint if token exists
      if (token) {
        try {
          await fetch('http://localhost:5001/api/auth/logout', {
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
  };

  // Perform logout with optional message
  const performLogout = async (message) => {
    if (message) {
      setError(message);
    }
    await logout();
  };

  // Extend session when user is still active
  const extendSession = () => {
    setShowSessionWarning(false);
    // Reset activity by simulating an activity event
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
    
    // Dispatch custom event to trigger reset
    window.dispatchEvent(new Event('mousedown'));
  };

  const value = React.useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !isLoggedOut,
    isLoggedOut,
    isOnline,
    showSessionWarning,
    extendSession,
    performLogout
  }), [user, loading, error, isLoggedOut, isOnline, showSessionWarning]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
