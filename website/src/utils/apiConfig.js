/**
 * D-6 fix: Re-export from canonical config/apiConfig.js to avoid triple API config.
 * This file is kept for backwards compatibility - all new code should import from config/apiConfig.js
 */
export {
  getApiBaseUrl as detectBackendPort,
  getApiBaseUrl as getApiUrl,
  getApiBaseUrlSync,
} from '../config/apiConfig.js';

export function resetApiCache() {
  // No-op: config/apiConfig.js handles caching internally
}
