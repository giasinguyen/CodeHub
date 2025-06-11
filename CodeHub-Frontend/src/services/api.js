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
    console.log('🚀 [API REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ [API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [API RESPONSE]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ [API RESPONSE ERROR]', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    
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

// Upload API methods
export const uploadAPI = {
  // Upload avatar
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.postFormData('/upload/avatar', formData);
  },
  
  // Upload cover photo
  uploadCoverPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.postFormData('/upload/cover', formData);
  },
  
  // Upload general image
  uploadImage: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.postFormData('/upload/image', formData);
  },
  
  // Delete image
  deleteImage: (imageUrl) => api.delete(`/upload/image?imageUrl=${encodeURIComponent(imageUrl)}`),
};

// Snippets API methods
export const snippetsAPI = {
  // Get all snippets with pagination
  getSnippets: (page = 0, size = 10, sort = 'createdAt,desc') => {
    const url = `/snippets?page=${page}&size=${size}&sort=${sort}`;
    console.log('🌐 [API] GET Snippets:', url);
    return api.get(url);
  },
  
  // Get snippet by ID
  getSnippetById: (id) => {
    const url = `/snippets/${id}`;
    console.log('🌐 [API] GET Snippet by ID:', url);
    return api.get(url);
  },
  
  // Search snippets
  searchSnippets: (query, page = 0, size = 10) => {
    const url = `/snippets/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    console.log('🌐 [API] Search Snippets:', url);
    return api.get(url);
  },
    // Get trending snippets
  getTrendingSnippets: (type = 'most-liked', page = 0, size = 10) => {
    const url = `/snippets/trending/${type}?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Trending Snippets:', url);
    return api.get(url);
  },

  // Get available languages
  getLanguages: () => {
    const url = '/snippets/languages';
    console.log('🌐 [API] GET Languages:', url);
    return api.get(url);
  },
  
  // Create new snippet
  createSnippet: (snippetData) => {
    console.log('🌐 [API] POST Create Snippet:', snippetData);
    // Remove authorId as it's not needed - backend gets it from auth context
    const { authorId: _authorId, ...snippetPayload } = snippetData;
    return api.post('/snippets', snippetPayload);
  },
  // Update snippet
  updateSnippet: (id, snippetData) => {
    const formData = new FormData();
    const { authorId: _authorId, ...snippetPayload } = snippetData;
    formData.append('snippet', JSON.stringify(snippetPayload));
    return api.putFormData(`/snippets/${id}`, formData);
  },
  
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
  
  // Get current user profile
  getCurrentUser: () => api.get('/users/profile'),
  
  // Search users by username
  searchByUsername: (username) => api.get(`/users/search?username=${encodeURIComponent(username)}`),
  
  // Get user snippets
  getUserSnippets: (id, page = 0, size = 10) => 
    api.get(`/users/${id}/snippets?page=${page}&size=${size}`),  // Get current user snippets
  getCurrentUserSnippets: (page = 0, size = 10) => 
    api.get(`/users/profile/snippets?page=${page}&size=${size}`),
  
  // Get user statistics
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  
  // Get current user statistics
  getCurrentUserStats: () => api.get('/users/profile/stats'),
};

// Activity API methods
export const activityAPI = {
  // Get current user activities
  getCurrentUserActivities: (filter = 'all', page = 0, size = 10) =>
    api.get(`/activities/me?filter=${filter}&page=${page}&size=${size}`),
  
  // Get user activities by ID
  getUserActivities: (userId, filter = 'all', page = 0, size = 10) =>
    api.get(`/activities/user/${userId}?filter=${filter}&page=${page}&size=${size}`),
};

// Developers API methods
export const developersAPI = {
  // Get all developers with filters
  getDevelopers: (params = {}) => {
    const { page = 0, size = 12, skills = [], location = '', experience = '', availability = '', sortBy = 'reputation' } = params;
    let url = `/users?page=${page}&size=${size}&sort=${sortBy}`;
    
    if (skills.length > 0) {
      url += `&skills=${skills.join(',')}`;
    }
    if (location) {
      url += `&location=${encodeURIComponent(location)}`;
    }
    if (experience) {
      url += `&experience=${experience}`;
    }
    if (availability) {
      url += `&availability=${availability}`;
    }
    
    console.log('🌐 [API] GET Developers:', url);
    return api.get(url);
  },

  // Get developer by ID
  getDeveloperById: (id) => {
    const url = `/users/${id}`;
    console.log('🌐 [API] GET Developer by ID:', url);
    return api.get(url);
  },

  // Get featured developers
  getFeaturedDevelopers: () => {
    const url = '/users/featured';
    console.log('🌐 [API] GET Featured Developers:', url);
    return api.get(url);
  },

  // Get community stats
  getCommunityStats: () => {
    const url = '/users/stats/community';
    console.log('🌐 [API] GET Community Stats:', url);
    return api.get(url);
  },

  // Get trending skills
  getTrendingSkills: () => {
    const url = '/users/skills/trending';
    console.log('🌐 [API] GET Trending Skills:', url);
    return api.get(url);
  },

  // Get leaderboard
  getLeaderboard: (type = 'reputation', limit = 10) => {
    const url = `/users/leaderboard?type=${type}&limit=${limit}`;
    console.log('🌐 [API] GET Leaderboard:', url);
    return api.get(url);
  },

  // Search developers
  searchDevelopers: (query, page = 0, size = 12) => {
    const url = `/users/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    console.log('🌐 [API] Search Developers:', url);
    return api.get(url);
  },

  // Follow/unfollow developer
  toggleFollow: (userId) => {
    const url = `/users/${userId}/follow`;
    console.log('🌐 [API] Toggle Follow:', url);
    return api.post(url);
  },

  // Get followers
  getFollowers: (userId, page = 0, size = 20) => {
    const url = `/users/${userId}/followers?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Followers:', url);
    return api.get(url);
  },
  // Get following
  getFollowing: (userId, page = 0, size = 20) => {
    const url = `/users/${userId}/following?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Following:', url);
    return api.get(url);
  }
};

// Trending API methods
export const trendingAPI = {
  // Get trending overview
  getTrendingOverview: (period = 'week') => {
    const url = `/trending/overview?period=${period}`;
    console.log('🌐 [API] GET Trending Overview:', url);
    return api.get(url);
  },

  // Get trending snippets
  getTrendingSnippets: (type = 'most-liked', period = 'week', page = 0, size = 20) => {
    const url = `/trending/snippets?type=${type}&period=${period}&page=${page}&size=${size}`;
    console.log('🌐 [API] GET Trending Snippets:', url);
    return api.get(url);
  },

  // Get trending developers
  getTrendingDevelopers: (period = 'week', limit = 15) => {
    const url = `/trending/developers?period=${period}&limit=${limit}`;
    console.log('🌐 [API] GET Trending Developers:', url);
    return api.get(url);
  },

  // Get trending skills
  getTrendingSkills: (period = 'week', limit = 15) => {
    const url = `/trending/skills?period=${period}&limit=${limit}`;
    console.log('🌐 [API] GET Trending Skills:', url);
    return api.get(url);
  },

  // Get trending languages
  getTrendingLanguages: (period = 'week', limit = 15) => {
    const url = `/trending/languages?period=${period}&limit=${limit}`;
    console.log('🌐 [API] GET Trending Languages:', url);
    return api.get(url);
  },

  // Get trending stats
  getTrendingStats: (period = 'week') => {
    const url = `/trending/stats?period=${period}`;
    console.log('🌐 [API] GET Trending Stats:', url);
    return api.get(url);
  },

  // Get trending leaderboard
  getTrendingLeaderboard: (category = 'overall', period = 'week', limit = 10) => {
    const url = `/trending/leaderboard?category=${category}&period=${period}&limit=${limit}`;
    console.log('🌐 [API] GET Trending Leaderboard:', url);
    return api.get(url);
  }
};

export default apiClient;
