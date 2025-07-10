import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { toast } from 'react-hot-toast';

// Request cache to prevent duplicate requests
const requestCache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
      case 429:
        // Rate limit exceeded - show a less intrusive message
        console.warn('Rate limit exceeded, please wait before making more requests');
        toast.error('Too many requests. Please wait a moment before trying again.');
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

// Helper function to create cache key
const createCacheKey = (method, url, params) => {
  return `${method.toUpperCase()}:${url}:${JSON.stringify(params || {})}`;
};

// Cached GET request to prevent duplicate calls
const cachedGet = (url, config = {}) => {
  const cacheKey = createCacheKey('GET', url, config.params);
  const now = Date.now();
  
  // Check if we have a cached request
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    
    // If the cached request is still valid, return it
    if (now - cached.timestamp < CACHE_DURATION) {
      console.log('🔄 [CACHE HIT]', cacheKey);
      return cached.promise;
    }
    
    // Remove expired cache
    requestCache.delete(cacheKey);
  }
  
  // Make new request and cache it
  const promise = apiClient.get(url, config)
    .finally(() => {
      // Remove from cache after request completes
      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, CACHE_DURATION);
    });
  
  requestCache.set(cacheKey, {
    promise,
    timestamp: now
  });
  
  console.log('📦 [CACHE SET]', cacheKey);
  return promise;
};

// API methods
export const api = {
  // Generic methods
  get: cachedGet,
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
  },  // Get available languages
  getLanguages: () => {
    const url = '/snippets/languages';
    console.log('🌐 [API] GET Languages:', url);
    return api.get(url);
  },
  
  // Get languages with count statistics
  getLanguageStats: () => {
    const url = '/snippets/languages/stats';
    console.log('🌐 [API] GET Language Stats:', url);
    return api.get(url);
  },
  // Get snippets by tag
  getSnippetsByTag: (tagName, page = 0, size = 20) => {
    const url = `/snippets?tag=${tagName}&page=${page}&size=${size}`;
    console.log('🌐 [API] GET Snippets by Tag:', url);
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
  
  // Update comment
  updateComment: (snippetId, commentId, commentData) => 
    api.put(`/snippets/${snippetId}/comments/${commentId}`, commentData),
    
  // Delete comment
  deleteComment: (snippetId, commentId) => 
    api.delete(`/snippets/${snippetId}/comments/${commentId}`),
  
  // Comment like operations
  toggleCommentLike: (snippetId, commentId) => api.post(`/snippets/${snippetId}/comments/${commentId}/like`),
  getCommentLikeStatus: (snippetId, commentId) => api.get(`/snippets/${snippetId}/comments/${commentId}/like-status`),
  
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
  
  // Get user by username
  getUserByUsername: (username) => api.get(`/users/username/${encodeURIComponent(username)}`),
  
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
  
  // Update user profile
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  
  // Change password
  changePassword: (passwordData) => api.put('/users/profile/password', passwordData),
    // Upload avatar
  uploadAvatar: (formData) => api.postFormData('/users/profile/avatar', formData),
};

// User Follow API methods
export const userFollowAPI = {
  // Toggle follow user
  toggleFollow: (userId) => {
    console.log('🌐 [API] Toggle Follow User:', userId);
    return api.post(API_ENDPOINTS.USER_FOLLOW(userId));
  },
  
  // Unfollow user
  unfollowUser: (userId) => {
    console.log('🌐 [API] Unfollow User:', userId);
    return api.delete(API_ENDPOINTS.USER_FOLLOW(userId));
  },
  
  // Get follow status
  getFollowStatus: (userId) => {
    console.log('🌐 [API] Get Follow Status:', userId);
    return api.get(API_ENDPOINTS.USER_FOLLOW_STATUS(userId));
  },
  
  // Get user followers
  getUserFollowers: (userId, page = 0, size = 20) => {
    const url = `${API_ENDPOINTS.USER_FOLLOWERS(userId)}?page=${page}&size=${size}`;
    console.log('🌐 [API] Get User Followers:', url);
    return api.get(url);
  },
  
  // Get user following
  getUserFollowing: (userId, page = 0, size = 20) => {
    const url = `${API_ENDPOINTS.USER_FOLLOWING(userId)}?page=${page}&size=${size}`;
    console.log('🌐 [API] Get User Following:', url);
    return api.get(url);
  },
  
  // Get current user followers
  getCurrentUserFollowers: (page = 0, size = 20) => {
    const url = `${API_ENDPOINTS.CURRENT_USER_FOLLOWERS}?page=${page}&size=${size}`;
    console.log('🌐 [API] Get Current User Followers:', url);
    return api.get(url);
  },
  
  // Get current user following
  getCurrentUserFollowing: (page = 0, size = 20) => {
    const url = `${API_ENDPOINTS.CURRENT_USER_FOLLOWING}?page=${page}&size=${size}`;
    console.log('🌐 [API] Get Current User Following:', url);
    return api.get(url);
  }
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

// Favorites API methods
export const favoritesAPI = {
  // Get user's favorites
  getUserFavorites: (page = 0, size = 20) => 
    api.get(`${API_ENDPOINTS.FAVORITES}?page=${page}&size=${size}`),
  
  // Add snippet to favorites
  addFavorite: (snippetId, notes = null) => 
    api.post(API_ENDPOINTS.FAVORITE_ADD(snippetId), { notes }),
  
  // Remove snippet from favorites
  removeFavorite: (snippetId) => 
    api.delete(API_ENDPOINTS.FAVORITE_REMOVE(snippetId)),
  
  // Toggle favorite status
  toggleFavorite: (snippetId, notes = null) =>
    api.post(API_ENDPOINTS.FAVORITE_TOGGLE(snippetId), { notes }),
  
  // Get favorite status
  getFavoriteStatus: (snippetId) => 
    api.get(API_ENDPOINTS.FAVORITE_STATUS(snippetId)),
  
  // Get favorites statistics
  getFavoriteStats: () => 
    api.get(API_ENDPOINTS.FAVORITE_STATS),
  
  // Bulk operations (keeping these for compatibility)
  bulkAddFavorites: (snippetIds) =>
    api.post('/favorites/bulk/add', { snippetIds }),
  
  bulkRemoveFavorites: (snippetIds) =>
    api.post('/favorites/bulk/remove', { snippetIds })
};

// Notifications API methods
export const notificationsAPI = {
  // Get notifications with pagination and filter
  getNotifications: (page = 0, size = 20, filter = 'all') => {
    const url = `${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&size=${size}&filter=${filter}`;
    console.log('🌐 [API] GET Notifications:', url);
    return api.get(url);
  },

  // Get notification statistics
  getStats: () => {
    const url = API_ENDPOINTS.NOTIFICATION_STATS;
    console.log('🌐 [API] GET Notification Stats:', url);
    return api.get(url);
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    const url = API_ENDPOINTS.NOTIFICATION_MARK_READ(notificationId);
    console.log('🌐 [API] Mark as Read:', url);
    return api.put(url);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    const url = API_ENDPOINTS.NOTIFICATION_MARK_ALL_READ;
    console.log('🌐 [API] Mark All as Read:', url);
    return api.put(url);
  },
  // Delete notification
  deleteNotification: (notificationId) => {
    const url = API_ENDPOINTS.NOTIFICATION_DELETE(notificationId);    console.log('🌐 [API] Delete Notification:', url);
    return api.delete(url);
  }
};

// ============================
// CATEGORIES API
// ============================
export const categoriesAPI = {
  // Get language statistics
  getLanguageStats: () => {
    const url = API_ENDPOINTS.CATEGORIES_LANGUAGES;
    console.log('🌐 [API] Get Language Stats:', url);
    return api.get(url);
  },

  // Get tag statistics
  getTagStats: () => {
    const url = API_ENDPOINTS.CATEGORIES_TAGS;
    console.log('🌐 [API] Get Tag Stats:', url);
    return api.get(url);
  },

  // Get popular categories
  getPopularCategories: () => {
    const url = API_ENDPOINTS.CATEGORIES_POPULAR;
    console.log('🌐 [API] Get Popular Categories:', url);
    return api.get(url);
  },

  // Get snippets by language
  getSnippetsByLanguage: (language, page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') => {
    const url = API_ENDPOINTS.CATEGORIES_LANGUAGE_SNIPPETS(language);
    console.log('🌐 [API] Get Snippets by Language:', { language, page, size, sortBy, sortDir });
    return api.get(url, {
      params: { page, size, sortBy, sortDir }
    });
  },

  // Get snippets by tag
  getSnippetsByTag: (tag, page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') => {
    const url = API_ENDPOINTS.CATEGORIES_TAG_SNIPPETS(tag);
    console.log('🌐 [API] Get Snippets by Tag:', { tag, page, size, sortBy, sortDir });
    return api.get(url, {
      params: { page, size, sortBy, sortDir }
    });
  }
};

// ============================
// RECENTLY VIEWED API
// ============================
export const recentAPI = {
  // Get recently viewed snippets
  getRecentlyViewed: (page = 0, size = 12) => {
    const url = API_ENDPOINTS.RECENT_SNIPPETS;
    console.log('🌐 [API] Get Recently Viewed:', { page, size });
    return api.get(url, {
      params: { page, size }
    });
  },

  // Record snippet view
  recordView: (snippetId) => {
    const url = API_ENDPOINTS.RECENT_RECORD_VIEW(snippetId);
    console.log('🌐 [API] Record Snippet View:', snippetId);
    return api.post(url);
  },

  // Remove from recently viewed
  removeFromRecent: (snippetId) => {
    const url = API_ENDPOINTS.RECENT_REMOVE(snippetId);
    console.log('🌐 [API] Remove from Recent:', snippetId);
    return api.delete(url);
  },

  // Clear all recently viewed
  clearAll: () => {
    const url = API_ENDPOINTS.RECENT_CLEAR;
    console.log('🌐 [API] Clear All Recent');
    return api.delete(url);
  }
};

// Chat API
export const chatAPI = {
  // Create private chat room
  createPrivateChat: (participantUserId) => {
    console.log('🌐 [API] Create Private Chat:', { participantUserId });
    return apiClient.post('/chat/rooms', { participantUserId });
  },

  // Get user's chat rooms
  getChatRooms: (page = 0, size = 20) => {
    console.log('🌐 [API] Get Chat Rooms:', { page, size });
    return apiClient.get('/chat/rooms', {
      params: { page, size }
    });
  },

  // Get specific chat room
  getChatRoom: (chatId) => {
    console.log('🌐 [API] Get Chat Room:', chatId);
    return apiClient.get(`/chat/rooms/${chatId}`);
  },

  // Get chat messages
  getChatMessages: (chatId, page = 0, size = 50) => {
    console.log('🌐 [API] Get Chat Messages:', { chatId, page, size });
    return apiClient.get(`/chat/rooms/${chatId}/messages`, {
      params: { page, size }
    });
  },

  // Send message (REST fallback)
  sendMessage: (messageData) => {
    console.log('🌐 [API] Send Message:', messageData);
    return apiClient.post('/chat/messages', messageData);
  },

  // Mark messages as read
  markAsRead: (chatId) => {
    console.log('🌐 [API] Mark As Read:', chatId);
    console.log('🌐 [API] Making PUT request to:', `/chat/rooms/${chatId}/read`);
    return apiClient.put(`/chat/rooms/${chatId}/read`).then(response => {
      console.log('✅ [API] Mark As Read Response:', response);
      return response;
    }).catch(error => {
      console.error('❌ [API] Mark As Read Error:', error);
      throw error;
    });
  },

  // Search chat rooms
  searchChatRooms: (searchTerm) => {
    console.log('🌐 [API] Search Chat Rooms:', searchTerm);
    return apiClient.get('/chat/rooms/search', {
      params: { q: searchTerm }
    });
  }
};

// ============================
// CHAT HISTORY API
// ============================
export const chatHistoryAPI = {
  // Get all conversations
  getConversations: (page = 0, size = 20) => {
    const url = `/chat/history/conversations?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Conversations:', url);
    return api.get(url);
  },

  // Get conversation history with specific user
  getConversationHistory: (username) => {
    const url = `/chat/history/conversations/${encodeURIComponent(username)}`;
    console.log('🌐 [API] GET Conversation History:', url);
    return api.get(url);
  },

  // Get conversation messages with specific user
  getConversationMessages: (username, page = 0, size = 50) => {
    const url = `/chat/history/conversations/${encodeURIComponent(username)}/messages?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Conversation Messages:', url);
    return api.get(url);
  },

  // Get messages by chat room ID
  getMessagesByChatId: (chatId, page = 0, size = 50) => {
    const url = `/chat/history/chatrooms/${encodeURIComponent(chatId)}/messages?page=${page}&size=${size}`;
    console.log('🌐 [API] GET Messages by Chat ID:', url);
    return api.get(url);
  },

  // Search messages across all conversations
  searchMessages: (searchTerm, page = 0, size = 20) => {
    const url = `/chat/history/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`;
    console.log('🌐 [API] Search Messages:', url);
    return api.get(url);
  },

  // Get chat statistics
  getChatStats: () => {
    const url = '/chat/history/stats';
    console.log('🌐 [API] GET Chat Stats:', url);
    return api.get(url).then(response => {
      console.log('✅ [API] Chat Stats Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Chat Stats Error:', error);
      throw error;
    });
  },

  // Debug unread messages
  debugUnreadMessages: (chatId) => {
    const url = `/chat/debug/unread/${chatId}`;
    console.log('🐛 [API] Debug Unread Messages:', url);
    return apiClient.get(url);
  }
};

export default apiClient;
export { apiClient };
