const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      return 'https://phonebook-mpno.onrender.com';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export const API_URL = getApiUrl();

// Centralized fetch wrapper to handle base URL, CORS credentials, 
// automatic JSON headers, JWT token authorization, and token expiration logout.
export const apiFetch = async (urlOrPath, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Resolve full URL
  let fullUrl = urlOrPath;
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    const cleanPath = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
    fullUrl = `${API_URL}${cleanPath}`;
  }

  // Setup headers
  const headers = {
    ...options.headers,
  };

  // If the body is present and not a FormData object, default to JSON
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  // Inject JWT authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set credentials for session-based request parameters
  options.credentials = options.credentials || 'include';

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Handle token expiration/invalid token (401 Unauthorized)
    if (response.status === 401) {
      localStorage.removeItem('token');
      // Dispatch a custom event to notify AuthContext to trigger logout
      window.dispatchEvent(new Event('auth-logout'));
    }

    return response;
  } catch (error) {
    console.error('API Request Network Error:', error);
    throw new Error(error.message || 'Network error occurred. Please check your internet connection.');
  }
};
