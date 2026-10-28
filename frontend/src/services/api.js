const API_BASE_URL = '/api';

const getHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('hc_token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Safe request wrapper that handles errors and transforms raw "Failed to fetch"
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    let data = {};
    try {
      data = await res.json();
    } catch {
      // response body was empty or not JSON
    }

    if (!res.ok) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
      throw new Error(
        'Unable to connect to backend server. Please make sure the backend is running on http://localhost:5000'
      );
    }
    throw err;
  }
};

export const api = {
  // Auth endpoints
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  getMe: async () => {
    return request('/auth/me', {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // User endpoints
  getAllUsers: async (search = '') => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`/users${query}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  getUserById: async (id) => {
    return request(`/users/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  updateUser: async (id, updatePayload) => {
    return request(`/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatePayload),
    });
  },

  deleteUser: async (id, password) => {
    return request(`/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });
  },
};

export default api;
