const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/security');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info from token payload to request
 * No database lookup needed - all user info is in the JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7);

    // Check token blacklist (A-9 fix)
    try {
      const authRoutes = require('../routes/auth');
      if (authRoutes.isTokenBlacklisted && authRoutes.isTokenBlacklisted(token)) {
        return res.status(401).json({
          success: false,
          error: 'Token has been revoked',
        });
      }
    } catch (e) {
      // Auth routes not loaded yet, skip blacklist check
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info from JWT payload directly (no DB lookup needed)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.name || decoded.fullName,
      name: decoded.name || decoded.fullName,
      role: decoded.role,
      userType: decoded.userType,
      schoolType: decoded.schoolType,
      roleId: decoded.roleId,
      adminType: decoded.adminType || null,
      assignedSchools: decoded.assignedSchools || [],
      isSuperUser: decoded.isSuperUser || false,
      teacherType: decoded.teacherType || null,
      schoolLevel: decoded.schoolLevel || null,
      permissions: decoded.permissions || [],
    };

    // Add token expiry info
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    req.tokenExpiresIn = expiresIn;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Permission Middleware
 * Checks if user has required permissions
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Super users and CEO admins have all permissions
    if (req.user.isSuperUser || req.user.adminType === 'ceo') {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const hasPermission = perms.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Role Middleware
 * Checks if user has required role
 */
const requireRole = (requiredRoles) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  // Normalize to lowercase for comparison
  const normalizedRoles = roles.map(r => r.toLowerCase());
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Check against both role and adminType (case-insensitive)
    const userRole = (req.user.role || '').toLowerCase();
    const userAdminType = (req.user.adminType || '').toLowerCase();
    
    if (normalizedRoles.includes(userRole) || normalizedRoles.includes(userAdminType)) {
      return next();
    }

    // Super users bypass role checks
    if (req.user.isSuperUser) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: 'This action requires a specific role',
    });
  };
};

// Backward compatibility exports
const authenticateToken = authMiddleware;
const authorizeRole = requireRole;

module.exports = {
  authMiddleware,
  requirePermission,
  requireRole,
  authenticateToken,
  authorizeRole,
};
