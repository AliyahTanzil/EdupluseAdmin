/**
 * API Configuration with Automatic Backend Port Detection
 * Detects which port the backend is running on
 */

let cachedApiUrl = null;

/**
 * Try to detect backend port by attempting connections to common ports
 */
export async function detectBackendPort() {
  if (cachedApiUrl) return cachedApiUrl;

  const commonPorts = [5001, 5002, 5003, 5004, 5005, 3001, 3002, 8000];
  const baseUrl = `${window.location.protocol}//${window.location.hostname}`;

  for (const port of commonPorts) {
    try {
      const testUrl = `${baseUrl}:${port}/api/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      const response = await fetch(testUrl, {
        signal: controller.signal,
        method: 'GET',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        cachedApiUrl = `${baseUrl}:${port}/api`;
        console.log(`✓ Backend detected on port ${port}`);
        return cachedApiUrl;
      }
    } catch (error) {
      // Port not available, try next
      continue;
    }
  }

  // Fallback to environment variable or default
  cachedApiUrl =
    import.meta.env.VITE_API_URL || `${baseUrl}:5001/api`;
  console.warn(
    `⚠ Backend auto-detection failed, using default: ${cachedApiUrl}`
  );
  return cachedApiUrl;
}

/**
 * Get API URL with caching
 */
export async function getApiUrl() {
  if (cachedApiUrl) return cachedApiUrl;
  return await detectBackendPort();
}

/**
 * Reset cache (useful for testing)
 */
export function resetApiCache() {
  cachedApiUrl = null;
}
