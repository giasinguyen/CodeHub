import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { toast } from 'react-hot-toast';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(error);
    }

    switch (response.status) {
      case 401:
        // Clear auth data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
        toast.error(ERROR_MESSAGES.UNAUTHORIZED);
        break;
      case 403:
        toast.error(ERROR_MESSAGES.FORBIDDEN);
        break;
      case 404:
        toast.error(ERROR_MESSAGES.NOT_FOUND);
        break;
      case 500:
        toast.error(ERROR_MESSAGES.SERVER_ERROR);
        break;
      default:
        toast.error(response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR);
    }

    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Generic methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // File upload method
  postFormData: (url, formData, config = {}) => {
    return apiClient.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
    putFormData: (url, formData, config = {}) => {
    return apiClient.put(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
};

// Auth-specific API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/profile/password', passwords),
};

// Snippets API methods
export const snippetsAPI = {
  // Get all snippets with pagination
  getSnippets: (page = 0, size = 10, sort = 'createdAt,desc') => 
    api.get(`/snippets?page=${page}&size=${size}&sort=${sort}`),
  
  // Get snippet by ID
  getSnippetById: (id) => api.get(`/snippets/${id}`),
  
  // Search snippets
  searchSnippets: (query, page = 0, size = 10) => 
    api.get(`/snippets/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`),
  
  // Get trending snippets
  getTrendingSnippets: (type = 'most-liked', page = 0, size = 10) => 
    api.get(`/snippets/trending/${type}?page=${page}&size=${size}`),
  
  // Create new snippet
  createSnippet: (snippetData) => api.post('/snippets', snippetData),
  
  // Update snippet
  updateSnippet: (id, snippetData) => api.put(`/snippets/${id}`, snippetData),
  
  // Delete snippet
  deleteSnippet: (id) => api.delete(`/snippets/${id}`),
  
  // Like/unlike snippet
  toggleLike: (id) => api.post(`/snippets/${id}/like`),
  
  // Get like status
  getLikeStatus: (id) => api.get(`/snippets/${id}/like/status`),
  
  // Get comments
  getComments: (id, page = 0, size = 10) => 
    api.get(`/snippets/${id}/comments?page=${page}&size=${size}`),
  
  // Add comment
  addComment: (id, commentData) => api.post(`/snippets/${id}/comments`, commentData),
  
  // Delete comment
  deleteComment: (snippetId, commentId) => 
    api.delete(`/snippets/${snippetId}/comments/${commentId}`),
  
  // Get available languages
  getLanguages: () => api.get('/snippets/languages'),
  
  // Get available tags
  getTags: () => api.get('/snippets/tags'),
};

// Users API methods
export const usersAPI = {
  // Get all users
  getUsers: (page = 0, size = 10) => 
    api.get(`/users?page=${page}&size=${size}`),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Get user snippets
  getUserSnippets: (id, page = 0, size = 10) => 
    api.get(`/users/${id}/snippets?page=${page}&size=${size}`),
  
  // Get current user snippets
  getCurrentUserSnippets: (page = 0, size = 10) => 
    api.get(`/users/profile/snippets?page=${page}&size=${size}`),
};

export default apiClient;
