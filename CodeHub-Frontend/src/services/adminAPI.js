import apiClient from './api';

// Admin API endpoints
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => {
    console.log('🌐 [API] Get Dashboard Stats');
    return apiClient.get('/admin/dashboard/stats').then(response => {
      console.log('✅ [API] Dashboard Stats Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Dashboard Stats Error:', error);
      throw error;
    });
  },

  // User Management
  getUsers: (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (search) params.append('search', search);
    
    console.log('🌐 [API] Get Users:', { page, size, search });
    return apiClient.get(`/admin/users?${params}`).then(response => {
      console.log('✅ [API] Users Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Users Error:', error);
      throw error;
    });
  },

  getUserDetails: (userId) => {
    console.log('🌐 [API] Get User Details:', userId);
    return apiClient.get(`/admin/users/${userId}`).then(response => {
      console.log('✅ [API] User Details Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User Details Error:', error);
      throw error;
    });
  },

  updateUserStatus: (userId, enabled) => {
    console.log('🌐 [API] Update User Status:', { userId, enabled });
    return apiClient.put(`/admin/users/${userId}/status?enabled=${enabled}`).then(response => {
      console.log('✅ [API] Update User Status Response:', response);
      return response;
    }).catch(error => {
      console.error('❌ [API] Update User Status Error:', error);
      throw error;
    });
  },

  // Content Moderation
  getSnippets: (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (search) params.append('search', search);
    
    console.log('🌐 [API] Get Snippets for Moderation:', { page, size, search });
    return apiClient.get(`/admin/snippets?${params}`).then(response => {
      console.log('✅ [API] Snippets Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Snippets Error:', error);
      throw error;
    });
  },

  deleteSnippet: (snippetId) => {
    console.log('🌐 [API] Delete Snippet:', snippetId);
    return apiClient.delete(`/admin/snippets/${snippetId}`).then(response => {
      console.log('✅ [API] Delete Snippet Response:', response);
      return response;
    }).catch(error => {
      console.error('❌ [API] Delete Snippet Error:', error);
      throw error;
    });
  },

  // Analytics
  getUserAnalytics: (period = 'daily', days = 30) => {
    console.log('🌐 [API] Get User Analytics:', { period, days });
    return apiClient.get(`/admin/analytics/users?period=${period}&days=${days}`).then(response => {
      console.log('✅ [API] User Analytics Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User Analytics Error:', error);
      throw error;
    });
  },

  getSnippetAnalytics: (period = 'daily', days = 30) => {
    console.log('🌐 [API] Get Snippet Analytics:', { period, days });
    return apiClient.get(`/admin/analytics/snippets?period=${period}&days=${days}`).then(response => {
      console.log('✅ [API] Snippet Analytics Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Snippet Analytics Error:', error);
      throw error;
    });
  },

  // Activities
  getRecentActivities: (page = 0, size = 20) => {
    console.log('🌐 [API] Get Recent Activities:', { page, size });
    return apiClient.get(`/admin/activities?page=${page}&size=${size}`).then(response => {
      console.log('✅ [API] Activities Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Activities Error:', error);
      throw error;
    });
  },

  // System Health
  getSystemHealth: () => {
    console.log('🌐 [API] Get System Health');
    return apiClient.get('/admin/system/health').then(response => {
      console.log('✅ [API] System Health Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] System Health Error:', error);
      throw error;
    });
  },

  // Chart Data
  getTopLanguagesChart: () => {
    console.log('🌐 [API] Get Top Languages Chart');
    return apiClient.get('/admin/charts/top-languages').then(response => {
      console.log('✅ [API] Top Languages Chart Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Top Languages Chart Error:', error);
      throw error;
    });
  },

  getSnippetsCreatedChart: () => {
    console.log('🌐 [API] Get Snippets Created Chart');
    return apiClient.get('/admin/charts/snippets-created').then(response => {
      console.log('✅ [API] Snippets Created Chart Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Snippets Created Chart Error:', error);
      throw error;
    });
  },

  getViewsChart: () => {
    console.log('🌐 [API] Get Views Chart');
    return apiClient.get('/admin/charts/views').then(response => {
      console.log('✅ [API] Views Chart Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Views Chart Error:', error);
      throw error;
    });
  },

  getSnippetsByHourChart: () => {
    console.log('🌐 [API] Get Snippets By Hour Chart');
    return apiClient.get('/admin/charts/snippets-by-hour').then(response => {
      console.log('✅ [API] Snippets By Hour Chart Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] Snippets By Hour Chart Error:', error);
      throw error;
    });
  },

  // User Detail Page
  getUserById: (userId) => {
    console.log('🌐 [API] Get User By ID:', userId);
    return apiClient.get(`/admin/users/${userId}`).then(response => {
      console.log('✅ [API] User By ID Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User By ID Error:', error);
      throw error;
    });
  },

  getUserStats: (userId) => {
    console.log('🌐 [API] Get User Stats:', userId);
    return apiClient.get(`/admin/users/${userId}/stats`).then(response => {
      console.log('✅ [API] User Stats Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User Stats Error:', error);
      throw error;
    });
  },

  getUserSnippets: (userId, page = 0, size = 20) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    console.log('🌐 [API] Get User Snippets:', { userId, page, size });
    return apiClient.get(`/admin/users/${userId}/snippets?${params}`).then(response => {
      console.log('✅ [API] User Snippets Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User Snippets Error:', error);
      throw error;
    });
  },

  getUserActivities: (userId, page = 0, size = 20) => {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    console.log('🌐 [API] Get User Activities:', { userId, page, size });
    return apiClient.get(`/admin/users/${userId}/activities?${params}`).then(response => {
      console.log('✅ [API] User Activities Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ [API] User Activities Error:', error);
      throw error;
    });
  },

  deleteUser: (userId) => {
    console.log('🌐 [API] Delete User:', userId);
    return apiClient.delete(`/admin/users/${userId}`).then(response => {
      console.log('✅ [API] Delete User Response:', response);
      return response;
    }).catch(error => {
      console.error('❌ [API] Delete User Error:', error);
      throw error;
    });
  },
};
