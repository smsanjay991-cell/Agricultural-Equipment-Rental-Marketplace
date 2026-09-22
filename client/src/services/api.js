const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${SERVER_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('agrirent_token');

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...options.headers,
};

if (isFormData) {
  delete headers['Content-Type'];
  delete headers['content-type'];
} else if (!headers['Content-Type'] && !headers['content-type']) {
  headers['Content-Type'] = 'application/json';
}


  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    if (!error.status) {
      error.isNetworkError = true;
    }
    console.warn(`API call ${endpoint} error:`, error.message);
    throw error;
  }
};

export default API_BASE_URL;
