/**
 * API Configuration
 * Handles dynamic backend port detection and API URL management
 */

let cachedPort = null;

/**
 * Detect backend port by trying common ports
 * @returns {Promise<number>} - The port number where backend is running
 */
async function detectBackendPort() {
  if (cachedPort) return cachedPort;
  
  const ports = [5001, 5002, 5003, 5004, 5005];
  
  for (const port of ports) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`http://localhost:${port}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ Backend found on port ${port}`);
        cachedPort = port;
        return port;
      }
    } catch (error) {
      // Port not available, continue to next
    }
  }
  
  console.warn('⚠️ Could not detect backend port, using default 5001');
  cachedPort = 5001;
  return 5001;
}

/**
 * Get the API base URL
 * First checks environment variable, then auto-detects backend port
 * @returns {Promise<string>} - The API base URL
 */
export async function getApiBaseUrl() {
  // Check environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect backend port
  const port = await detectBackendPort();
  return `http://localhost:${port}/api`;
}

/**
 * Get the API base URL synchronously with a default
 * Use this for non-critical fetches where a default is acceptable
 * @returns {string} - The API base URL or default
 */
export function getApiBaseUrlSync() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Return cached port if available
  if (cachedPort) {
    return `http://localhost:${cachedPort}/api`;
  }
  
  // Default to 5001 on first load
  return 'http://localhost:5001/api';
}

/**
 * Normalize API endpoint - removes leading/trailing slashes
 * @param {string} endpoint - The API endpoint
 * @returns {string} - Normalized endpoint
 */
export function normalizeEndpoint(endpoint) {
  return endpoint.replace(/^\/+|\/+$/g, '');
}

/**
 * Build complete API URL
 * @param {string} endpoint - The endpoint (e.g., '/auth/login' or 'auth/login')
 * @param {string} baseUrl - Optional custom base URL
 * @returns {string} - Complete API URL
 */
export function buildApiUrl(endpoint, baseUrl) {
  const base = baseUrl || getApiBaseUrlSync();
  const normalized = normalizeEndpoint(endpoint);
  return `${base}/${normalized}`;
}

/**
 * Make an API fetch request with error handling
 * @param {string} endpoint - The endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function apiFetch(endpoint, options = {}) {
  const baseUrl = await getApiBaseUrl();
  const url = buildApiUrl(endpoint, baseUrl);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  return response;
}

export default {
  detectBackendPort,
  getApiBaseUrl,
  getApiBaseUrlSync,
  normalizeEndpoint,
  buildApiUrl,
  apiFetch,
};
