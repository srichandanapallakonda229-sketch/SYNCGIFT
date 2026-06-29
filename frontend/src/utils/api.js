const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://syncgift.onrender.com/api';

async function request(endpoint, method = 'GET', body = null, customHeaders = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  // Automatically attach authenticated user header if available in localStorage
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('syncgifts_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.id) {
          headers['x-user-id'] = user.id;
        }
      } catch (e) {
        console.error('Error parsing auth user from localStorage', e);
      }
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Attempt parsing JSON
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = (data && data.error) || response.statusText || 'API Request failed';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

const api = {
  get: (endpoint, headers = {}) => request(endpoint, 'GET', null, headers),
  post: (endpoint, body, headers = {}) => request(endpoint, 'POST', body, headers),
  put: (endpoint, body, headers = {}) => request(endpoint, 'PUT', body, headers),
  delete: (endpoint, headers = {}) => request(endpoint, 'DELETE', null, headers),
  BASE_URL
};

export default api;
export { BASE_URL };
