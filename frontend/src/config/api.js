// Retrieve backend base URL from Vite environment variables with fallback
const rawBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL 
).replace(/\/+$/, '');

// Base URL for the backend server (e.g. http://localhost:4000)
export const BACKEND_URL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl.slice(0, -4)
  : rawBaseUrl;

// Base URL for API endpoints (e.g. http://localhost:4000/api)
export const API_BASE_URL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl}/api`;

export default API_BASE_URL;

