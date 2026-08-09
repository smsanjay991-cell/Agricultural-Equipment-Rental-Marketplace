const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
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
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`API call ${endpoint} error:`, error.message);
    throw error;
  }
};

export default API_BASE_URL;
