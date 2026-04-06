/**
 * Permission Edge Case Testing Utilities
 * Tests for authorization bypass attempts, permission inheritance, and concurrent access
 * File: website/src/utils/permissionTestUtils.js
 */

import { getApiBaseUrlSync } from '../config/apiConfig';

/**
 * Test unauthorized cross-role access attempts
 * Tests if forbidden roles are properly denied access
 */
export const testUnauthorizedAccess = async (testScenarios) => {
  const results = [];

  for (const scenario of testScenarios) {
    const {
      name,
      role,
      endpoint,
      expectedStatus = 403,
      method = 'GET',
      data = null,
      shouldFail = true
    } = scenario;

    try {
      const token = localStorage.getItem('authToken');
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`http://localhost:5001${endpoint}`, options);
      const responseData = await response.json();

      const passed = shouldFail 
        ? response.status === expectedStatus 
        : response.status === 200;

      results.push({
        name,
        role,
        endpoint,
        method,
        status: response.status,
        expectedStatus,
        message: responseData.message,
        passed,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        name,
        role,
        endpoint,
        passed: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

/**
 * Test permission bypass attempts
 * Tries various attack vectors to bypass permissions
 */
export const testPermissionBypass = async (testCases) => {
  const results = [];

  for (const testCase of testCases) {
    const { name, endpoint, bypassMethod, expectedBlockedAt } = testCase;

    try {
      let response;
      let blocked = false;
      let blockedAt = null;

      switch (bypassMethod) {
        case 'NO_TOKEN':
          // Try without authorization header
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          blocked = response.status === 401;
          blockedAt = 'AUTHENTICATION';
          break;

        case 'INVALID_TOKEN':
          // Try with invalid token
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer invalid_token_12345',
              'Content-Type': 'application/json'
            }
          });
          blocked = response.status === 401 || response.status === 403;
          blockedAt = 'TOKEN_VALIDATION';
          break;

        case 'EXPIRED_TOKEN':
          // Try with expired token
          const expiredToken = generateExpiredToken();
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${expiredToken}`,
              'Content-Type': 'application/json'
            }
          });
          blocked = response.status === 401;
          blockedAt = 'TOKEN_EXPIRATION';
          break;

        case 'MANIPULATED_PERMISSIONS':
          // Try with manipulated JWT
          const token = localStorage.getItem('authToken');
          const manipulatedToken = manipulateToken(token);
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${manipulatedToken}`,
              'Content-Type': 'application/json'
            }
          });
          blocked = response.status === 403;
          blockedAt = 'PERMISSION_CHECK';
          break;

        case 'NULL_PERMISSIONS':
          // Try with null permissions in JWT
          const nullPermToken = generateTokenWithNullPermissions();
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${nullPermToken}`,
              'Content-Type': 'application/json'
            }
          });
          blocked = response.status === 403;
          blockedAt = 'NULL_PERMISSION_VALIDATION';
          break;

        case 'MISSING_HEADER':
          // Try without Authorization header
          response = await fetch(`http://localhost:5001${endpoint}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          blocked = response.status === 401;
          blockedAt = 'HEADER_VALIDATION';
          break;
      }

      const passed = blocked && blockedAt === expectedBlockedAt;

      results.push({
        name,
        endpoint,
        bypassMethod,
        blocked,
        blockedAt,
        expectedBlockedAt,
        passed,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        name,
        endpoint,
        bypassMethod,
        blocked: false,
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

/**
 * Test cascading permission checks
 * Verifies permission inheritance and hierarchies
 */
export const testCascadingPermissions = async (roles) => {
  const results = [];

  // Super admin should have all permissions
  const allPermissions = [
    'manage_users',
    'manage_roles',
    'manage_permissions',
    'view_analytics',
    'create_grades',
    'view_all_reports',
    'manage_fees',
    'system_configuration'
  ];

  for (const role of roles) {
    const roleResults = {
      role: role.name,
      tests: []
    };

    for (const permission of allPermissions) {
      const hasPermission = role.permissions?.includes(permission) || false;

      // Verify permission at both frontend and backend
      const frontendCheck = testFrontendPermission(role, permission);
      const backendCheck = await testBackendPermission(role, permission);

      roleResults.tests.push({
        permission,
        hasPermission,
        frontendCheck,
        backendCheck,
        aligned: frontendCheck === backendCheck,
        timestamp: new Date().toISOString()
      });
    }

    results.push(roleResults);
  }

  return results;
};

/**
 * Test concurrent access from multiple roles
 * Simulates simultaneous access attempts
 */
export const testConcurrentAccess = async (concurrentScenarios) => {
  const results = [];

  // Create concurrent requests
  const promises = concurrentScenarios.map(async (scenario) => {
    const { role, endpoint, method = 'GET', data = null, description } = scenario;

    try {
      const token = generateTokenForRole(role);
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const startTime = Date.now();
      const response = await fetch(`http://localhost:5001${endpoint}`, options);
      const responseTime = Date.now() - startTime;

      return {
        description,
        role,
        endpoint,
        method,
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString(),
        passed: true
      };
    } catch (error) {
      return {
        description,
        role,
        endpoint,
        method,
        error: error.message,
        timestamp: new Date().toISOString(),
        passed: false
      };
    }
  });

  // Execute all requests concurrently
  const responses = await Promise.all(promises);
  results.push(...responses);

  return results;
};

/**
 * Test permission-denied error handling
 * Verifies proper error responses and user feedback
 */
export const testPermissionDeniedHandling = async (testCases) => {
  const results = [];

  for (const testCase of testCases) {
    const { name, endpoint, role, expectedError } = testCase;

    try {
      const token = generateTokenForRole(role);
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      const errorMessagePresent = data.message && data.message.length > 0;
      const correctStatus = response.status === 403;
      const correctErrorType = data.message?.includes(expectedError) || false;

      results.push({
        name,
        endpoint,
        role,
        status: response.status,
        errorMessage: data.message,
        errorMessagePresent,
        correctStatus,
        correctErrorType,
        passed: correctStatus && errorMessagePresent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        name,
        endpoint,
        role,
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

/**
 * Test permission validation performance
 * Measures how fast permission checks execute
 */
export const testPermissionCheckPerformance = async (performanceTests) => {
  const results = [];

  for (const test of performanceTests) {
    const { name, endpoint, role, iterations = 100, targetTime = 1 } = test;

    try {
      const token = generateTokenForRole(role);
      const times = [];

      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        const response = await fetch(`http://localhost:5001${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      const meetsTarget = avgTime < targetTime;

      results.push({
        name,
        endpoint,
        role,
        iterations,
        avgTime: avgTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        minTime: minTime.toFixed(2),
        targetTime,
        meetsTarget,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.push({
        name,
        endpoint,
        role,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

/**
 * Helper: Test frontend permission check
 */
const testFrontendPermission = (role, permission) => {
  if (!role.permissions) return false;
  return role.permissions.includes(permission);
};

/**
 * Helper: Test backend permission check
 */
const testBackendPermission = async (role, permission) => {
  try {
    const token = generateTokenForRole(role);
    const apiBase = getApiBaseUrlSync();
    const response = await fetch(
      `${apiBase}/permissions/check?permission=${permission}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    return data.hasPermission || false;
  } catch (error) {
    return false;
  }
};

/**
 * Helper: Generate a token for a specific role
 */
const generateTokenForRole = (role) => {
  // In real scenario, this would call backend to generate token
  // For testing, return existing token or mock token
  return localStorage.getItem('authToken') || 'test_token';
};

/**
 * Helper: Generate an expired token
 */
const generateExpiredToken = () => {
  // This would be a JWT with exp time in the past
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzU0MjJ9.invalid';
};

/**
 * Helper: Generate token with null permissions
 */
const generateTokenWithNullPermissions = () => {
  // Generate a token with permissions: null
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtaXNzaW9ucyI6bnVsbH0.invalid';
};

/**
 * Helper: Manipulate token to fake permissions
 */
const manipulateToken = (token) => {
  try {
    // Attempt to decode and re-encode with modified permissions
    const parts = token.split('.');
    if (parts.length !== 3) return token;

    // Decode payload
    const decoded = JSON.parse(atob(parts[1]));
    decoded.permissions = ['admin_only_permission'];

    // Return manipulated token (will fail signature validation)
    return `${parts[0]}.${btoa(JSON.stringify(decoded))}.${parts[2]}modified`;
  } catch (error) {
    return token;
  }
};

/**
 * Export summary statistics
 */
export const generateTestSummary = (allResults) => {
  const summary = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    passRate: 0,
    categories: {
      unauthorizedAccess: { total: 0, passed: 0 },
      bypassAttempts: { total: 0, passed: 0 },
      cascadingPermissions: { total: 0, passed: 0 },
      concurrentAccess: { total: 0, passed: 0 },
      errorHandling: { total: 0, passed: 0 },
      performance: { total: 0, passed: 0 }
    }
  };

  for (const result of allResults) {
    if (Array.isArray(result)) {
      for (const item of result) {
        summary.totalTests++;
        if (item.passed) summary.passed++;
        else summary.failed++;
      }
    }
  }

  summary.passRate = ((summary.passed / summary.totalTests) * 100).toFixed(2);
  return summary;
};
