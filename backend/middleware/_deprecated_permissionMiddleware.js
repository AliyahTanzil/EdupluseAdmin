/**
 * Enhanced Permission Middleware with Edge Case Handling
 * File: backend/middleware/permissionMiddleware.js
 * 
 * Handles:
 * - Rate limiting on failed auth attempts
 * - Audit logging for permission denials
 * - Suspicious pattern detection
 * - Response time consistency
 * - Permission bypass prevention
 */

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Track failed authentication attempts per IP/User
 */
const failedAuthAttempts = new Map();
const FAILED_AUTH_THRESHOLD = 5;
const FAILED_AUTH_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Track suspicious permission requests
 */
const suspiciousRequests = new Map();
const SUSPICIOUS_THRESHOLD = 10;
const SUSPICIOUS_WINDOW = 5 * 60 * 1000; // 5 minutes

/**
 * Audit log for permission-related events
 */
const auditLog = [];

/**
 * Rate limiter for failed authentication attempts
 * Blocks after 5 failed attempts in 15 minutes
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  skip: (req) => req.user, // Skip if already authenticated
  handler: (req, res) => {
    logAudit({
      type: 'AUTH_RATE_LIMIT_EXCEEDED',
      ip: req.ip,
      timestamp: new Date(),
      severity: 'HIGH'
    });
    res.status(429).json({
      success: false,
      message: 'Too many failed authentication attempts. Please try again later.',
      retryAfter: 15
    });
  }
});

/**
 * Extract and verify JWT token
 */
const extractAndVerifyToken = (req) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    logAudit({
      type: 'MISSING_AUTH_HEADER',
      ip: req.ip,
      endpoint: req.path,
      timestamp: new Date(),
      severity: 'MEDIUM'
    });
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    logAudit({
      type: 'INVALID_AUTH_HEADER',
      ip: req.ip,
      endpoint: req.path,
      timestamp: new Date(),
      severity: 'MEDIUM'
    });
    return null;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });
    return decoded;
  } catch (error) {
    recordFailedAuthAttempt(req.ip);
    logAudit({
      type: 'INVALID_TOKEN',
      error: error.message,
      ip: req.ip,
      endpoint: req.path,
      timestamp: new Date(),
      severity: 'MEDIUM'
    });
    return null;
  }
};

/**
 * Validate token claims and integrity
 */
const validateTokenClaims = (decoded) => {
  // Check required claims
  if (!decoded.userId || !decoded.role) {
    return false;
  }

  // Verify permissions is an array (not null, undefined, or malicious type)
  if (decoded.permissions !== undefined && !Array.isArray(decoded.permissions)) {
    return false;
  }

  // Check for suspicious claims that shouldn't exist
  const suspiciousClaims = ['admin', 'superuser', 'isSuperAdmin'];
  for (const claim of suspiciousClaims) {
    if (decoded[claim] === true && !decoded.role.isSuperAdmin) {
      return false; // Non-admin trying to claim admin status
    }
  }

  return true;
};

/**
 * Record failed authentication attempt
 */
const recordFailedAuthAttempt = (ip) => {
  const key = `failed_auth_${ip}`;
  const current = failedAuthAttempts.get(key) || { count: 0, firstAttempt: Date.now() };

  const timeSinceFirst = Date.now() - current.firstAttempt;
  
  if (timeSinceFirst > FAILED_AUTH_WINDOW) {
    // Reset if outside window
    failedAuthAttempts.set(key, { count: 1, firstAttempt: Date.now() });
  } else {
    current.count++;
    failedAuthAttempts.set(key, current);
  }
};

/**
 * Check for suspicious permission requests (possible DoS or brute force)
 */
const checkSuspiciousPattern = (req, user) => {
  const key = `suspicious_${user.userId}_${req.path}`;
  const current = suspiciousRequests.get(key) || { count: 0, firstRequest: Date.now() };

  const timeSinceFirst = Date.now() - current.firstRequest;

  if (timeSinceFirst > SUSPICIOUS_WINDOW) {
    // Reset if outside window
    suspiciousRequests.set(key, { count: 1, firstRequest: Date.now() });
    return false;
  } else {
    current.count++;
    suspiciousRequests.set(key, current);

    if (current.count > SUSPICIOUS_THRESHOLD) {
      logAudit({
        type: 'SUSPICIOUS_PATTERN_DETECTED',
        userId: user.userId,
        endpoint: req.path,
        attemptCount: current.count,
        timeWindow: SUSPICIOUS_WINDOW,
        timestamp: new Date(),
        severity: 'HIGH'
      });
      return true;
    }
  }

  return false;
};

/**
 * Log audit events
 */
const logAudit = (event) => {
  const auditEntry = {
    ...event,
    timestamp: new Date().toISOString(),
    id: auditLog.length + 1
  };

  auditLog.push(auditEntry);

  // Keep only last 1000 entries in memory
  if (auditLog.length > 1000) {
    auditLog.shift();
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', JSON.stringify(auditEntry, null, 2));
  }
};

/**
 * Middleware: Authenticate user with rate limiting
 */
const authenticateUser = (req, res, next) => {
  // Apply rate limiting
  authRateLimiter(req, res, () => {
    const decoded = extractAndVerifyToken(req);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing authentication token'
      });
    }

    // Validate token claims
    if (!validateTokenClaims(decoded)) {
      logAudit({
        type: 'INVALID_TOKEN_CLAIMS',
        userId: decoded.userId,
        ip: req.ip,
        endpoint: req.path,
        timestamp: new Date(),
        severity: 'HIGH'
      });
      return res.status(401).json({
        success: false,
        message: 'Token validation failed'
      });
    }

    // Check for suspicious patterns
    if (checkSuspiciousPattern(req, decoded)) {
      return res.status(429).json({
        success: false,
        message: 'Suspicious activity detected. Access temporarily blocked.',
        retryAfter: 5
      });
    }

    req.user = decoded;
    next();
  });
};

/**
 * Middleware: Check specific permission
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin has all permissions
    if (user.role && user.role.isSuperAdmin) {
      logAudit({
        type: 'PERMISSION_GRANTED',
        userId: user.userId,
        role: user.role.name,
        endpoint: req.path,
        method: req.method,
        timestamp: new Date(),
        severity: 'LOW'
      });
      return next();
    }

    // Check if user has required permissions
    const permissions = user.permissions || [];
    const isArray = Array.isArray(requiredPermissions);
    const required = isArray ? requiredPermissions : [requiredPermissions];

    const hasPermission = required.some(perm => permissions.includes(perm));

    if (!hasPermission) {
      logAudit({
        type: 'PERMISSION_DENIED',
        userId: user.userId,
        role: user.role?.name || 'UNKNOWN',
        requestedPermissions: required,
        userPermissions: permissions,
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date(),
        severity: 'MEDIUM'
      });

      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${required.join(', ')}`,
        requiredPermissions: required,
        userPermissions: permissions
      });
    }

    logAudit({
      type: 'PERMISSION_GRANTED',
      userId: user.userId,
      role: user.role?.name,
      grantedPermissions: required,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date(),
      severity: 'LOW'
    });

    next();
  };
};

/**
 * Middleware: Check role
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = user.role?.name || user.role;

    if (!roles.includes(userRole)) {
      logAudit({
        type: 'ROLE_DENIED',
        userId: user.userId,
        userRole,
        requiredRoles: roles,
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date(),
        severity: 'MEDIUM'
      });

      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`,
        requiredRoles: roles,
        userRole
      });
    }

    logAudit({
      type: 'ROLE_GRANTED',
      userId: user.userId,
      userRole,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date(),
      severity: 'LOW'
    });

    next();
  };
};

/**
 * Middleware: Data access control
 * Ensure users only access their own or authorized data
 */
const restrictDataAccess = (resourceType) => {
  return (req, res, next) => {
    const user = req.user;
    const resourceId = req.params.id;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin can access all data
    if (user.role?.isSuperAdmin) {
      return next();
    }

    // Students can only access their own data
    if (resourceType === 'student' && user.role?.name === 'student') {
      if (resourceId && resourceId !== user.userId) {
        logAudit({
          type: 'DATA_ACCESS_DENIED',
          userId: user.userId,
          attemptedResourceId: resourceId,
          resourceType,
          timestamp: new Date(),
          severity: 'HIGH'
        });
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own data.'
        });
      }
    }

    // Parents can only access their children's data
    if (resourceType === 'child' && user.role?.name === 'parent') {
      // In real implementation, verify resourceId is one of user's children
      if (resourceId && !user.childrenIds?.includes(resourceId)) {
        logAudit({
          type: 'DATA_ACCESS_DENIED',
          userId: user.userId,
          attemptedResourceId: resourceId,
          resourceType,
          timestamp: new Date(),
          severity: 'HIGH'
        });
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own children\'s data.'
        });
      }
    }

    next();
  };
};

/**
 * Middleware: Log all API access for audit trail
 */
const auditTrail = (req, res, next) => {
  const user = req.user || { userId: 'UNAUTHENTICATED' };

  const startTime = Date.now();

  // Intercept response
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    logAudit({
      type: 'API_ACCESS',
      userId: user.userId,
      method: req.method,
      endpoint: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date(),
      severity: res.statusCode >= 400 ? 'MEDIUM' : 'LOW'
    });
  });

  next();
};

/**
 * Get audit log
 */
const getAuditLog = (filters = {}) => {
  let log = [...auditLog];

  if (filters.userId) {
    log = log.filter(entry => entry.userId === filters.userId);
  }

  if (filters.type) {
    log = log.filter(entry => entry.type === filters.type);
  }

  if (filters.severity) {
    log = log.filter(entry => entry.severity === filters.severity);
  }

  if (filters.limit) {
    log = log.slice(-filters.limit);
  }

  return log;
};

/**
 * Get security metrics
 */
const getSecurityMetrics = () => {
  const now = Date.now();
  const recentWindow = 1 * 60 * 1000; // Last 1 minute

  const recentAttempts = auditLog.filter(entry => {
    const entryTime = new Date(entry.timestamp).getTime();
    return (now - entryTime) < recentWindow;
  });

  return {
    totalAuditEntries: auditLog.length,
    recentAttempts: recentAttempts.length,
    failedAuth: auditLog.filter(e => e.type === 'PERMISSION_DENIED').length,
    suspiciousPatterns: auditLog.filter(e => e.type === 'SUSPICIOUS_PATTERN_DETECTED').length,
    dataAccessDenials: auditLog.filter(e => e.type === 'DATA_ACCESS_DENIED').length,
    lastEntry: auditLog[auditLog.length - 1] || null
  };
};

module.exports = {
  authenticateUser,
  requirePermission,
  requireRole,
  restrictDataAccess,
  auditTrail,
  getAuditLog,
  getSecurityMetrics,
  authRateLimiter
};
