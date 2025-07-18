// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Environment
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
    // Snippets
  SNIPPETS: '/snippets',
  SNIPPET_BY_ID: (id) => `/snippets/${id}`,
  SNIPPET_VERSIONS: (id) => `/snippets/${id}/versions`,
  SNIPPET_LIKE: (id) => `/snippets/${id}/like`,
  SNIPPET_LIKE_STATUS: (id) => `/snippets/${id}/like/status`,
  SNIPPET_COMMENTS: (id) => `/snippets/${id}/comments`,
  SNIPPET_COMMENT_DELETE: (snippetId, commentId) => `/snippets/${snippetId}/comments/${commentId}`,
  
  // Favorites
  FAVORITES: '/favorites',
  FAVORITE_TOGGLE: (id) => `/snippets/${id}/favorite/toggle`,
  FAVORITE_STATUS: (id) => `/snippets/${id}/favorite/status`,
  FAVORITE_ADD: (id) => `/snippets/${id}/favorite`,
  FAVORITE_REMOVE: (id) => `/snippets/${id}/favorite`,
  FAVORITE_STATS: '/favorites/stats',
  
  // Search & Filters
  SEARCH_SNIPPETS: '/snippets/search',
  TRENDING_MOST_LIKED: '/snippets/trending/most-liked',
  TRENDING_MOST_VIEWED: '/snippets/trending/most-viewed',
  AVAILABLE_LANGUAGES: '/snippets/languages',
  AVAILABLE_TAGS: '/snippets/tags',
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_SNIPPETS: (id) => `/users/${id}/snippets`,
  CURRENT_USER_SNIPPETS: '/users/profile/snippets',
  
  // User Follow
  USER_FOLLOW: (id) => `/users/${id}/follow`,
  USER_FOLLOW_STATUS: (id) => `/users/${id}/follow/status`,
  USER_FOLLOWERS: (id) => `/users/${id}/followers`,
  USER_FOLLOWING: (id) => `/users/${id}/following`,
  CURRENT_USER_FOLLOWERS: '/users/profile/followers',
  CURRENT_USER_FOLLOWING: '/users/profile/following',
    // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_STATS: '/notifications/stats',
  NOTIFICATION_MARK_READ: (id) => `/notifications/${id}/read`,
  NOTIFICATION_MARK_ALL_READ: '/notifications/read-all',
  NOTIFICATION_DELETE: (id) => `/notifications/${id}`,
  
  // Categories
  CATEGORIES_LANGUAGES: '/categories/languages',
  CATEGORIES_TAGS: '/categories/tags',
  CATEGORIES_POPULAR: '/categories/popular',
  CATEGORIES_LANGUAGE_SNIPPETS: (language) => `/categories/languages/${language}/snippets`,
  CATEGORIES_TAG_SNIPPETS: (tag) => `/categories/tags/${tag}/snippets`,
  
  // Recently Viewed
  RECENT_SNIPPETS: '/recent/snippets',
  RECENT_RECORD_VIEW: (id) => `/recent/snippets/${id}/view`,
  RECENT_REMOVE: (id) => `/recent/snippets/${id}`,
  RECENT_CLEAR: '/recent/snippets',
};

// Theme
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'codehub_auth_token',
  USER_DATA: 'codehub_user_data',
  THEME: 'codehub_theme',
  TOKEN_EXPIRATION: 'codehub_token_expiration',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

// Popular Programming Languages
export const POPULAR_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'dart',
  'html',
  'css',
  'scss',
  'sql',
  'bash',
  'yaml',
  'json',
  'markdown',
];

// Language configuration with display names and file extensions
export const LANGUAGE_CONFIG = {
  // Programming Languages
  javascript: { name: 'JavaScript', extension: 'js', category: 'language' },
  python: { name: 'Python', extension: 'py', category: 'language' },
  typescript: { name: 'TypeScript', extension: 'ts', category: 'language' },
  java: { name: 'Java', extension: 'java', category: 'language' },
  cpp: { name: 'C++', extension: 'cpp', category: 'language' },
  csharp: { name: 'C#', extension: 'cs', category: 'language' },
  go: { name: 'Go', extension: 'go', category: 'language' },
  rust: { name: 'Rust', extension: 'rs', category: 'language' },
  php: { name: 'PHP', extension: 'php', category: 'language' },
  ruby: { name: 'Ruby', extension: 'rb', category: 'language' },
  
  // Frontend & UI
  react: { name: 'React', extension: 'jsx', category: 'frontend' },
  vue: { name: 'Vue.js', extension: 'vue', category: 'frontend' },
  angular: { name: 'Angular', extension: 'ts', category: 'frontend' },
  html: { name: 'HTML', extension: 'html', category: 'frontend' },
  css: { name: 'CSS', extension: 'css', category: 'frontend' },
  tailwind: { name: 'Tailwind CSS', extension: 'css', category: 'frontend' },
  sass: { name: 'Sass', extension: 'scss', category: 'frontend' },
  nextjs: { name: 'Next.js', extension: 'jsx', category: 'frontend' },
  svelte: { name: 'Svelte', extension: 'svelte', category: 'frontend' },
  
  // Backend & API
  nodejs: { name: 'Node.js', extension: 'js', category: 'backend' },
  express: { name: 'Express', extension: 'js', category: 'backend' },
  django: { name: 'Django', extension: 'py', category: 'backend' },
  flask: { name: 'Flask', extension: 'py', category: 'backend' },
  spring: { name: 'Spring Boot', extension: 'java', category: 'backend' },
  laravel: { name: 'Laravel', extension: 'php', category: 'backend' },
  rails: { name: 'Ruby on Rails', extension: 'rb', category: 'backend' },
  aspnet: { name: 'ASP.NET', extension: 'cs', category: 'backend' },
  
  // Mobile Development
  'react-native': { name: 'React Native', extension: 'jsx', category: 'mobile' },
  flutter: { name: 'Flutter', extension: 'dart', category: 'mobile' },
  ios: { name: 'iOS', extension: 'swift', category: 'mobile' },
  android: { name: 'Android', extension: 'java', category: 'mobile' },
  xamarin: { name: 'Xamarin', extension: 'cs', category: 'mobile' },
  ionic: { name: 'Ionic', extension: 'ts', category: 'mobile' },
  
  // Databases & Storage
  mysql: { name: 'MySQL', extension: 'sql', category: 'database' },
  postgresql: { name: 'PostgreSQL', extension: 'sql', category: 'database' },
  mongodb: { name: 'MongoDB', extension: 'js', category: 'database' },
  redis: { name: 'Redis', extension: 'conf', category: 'database' },
  sqlite: { name: 'SQLite', extension: 'sql', category: 'database' },
  firebase: { name: 'Firebase', extension: 'js', category: 'database' },
  supabase: { name: 'Supabase', extension: 'js', category: 'database' },
  
  // DevOps & Tools
  docker: { name: 'Docker', extension: 'dockerfile', category: 'devops' },
  kubernetes: { name: 'Kubernetes', extension: 'yaml', category: 'devops' },
  aws: { name: 'AWS', extension: 'yaml', category: 'devops' },
  azure: { name: 'Azure', extension: 'yaml', category: 'devops' },
  gcp: { name: 'Google Cloud', extension: 'yaml', category: 'devops' },
  git: { name: 'Git', extension: 'sh', category: 'devops' },
  cicd: { name: 'CI/CD', extension: 'yaml', category: 'devops' },
};

// Get languages by category
export const getLanguagesByCategory = (category) => {
  return Object.entries(LANGUAGE_CONFIG)
    .filter(([, config]) => config.category === category)
    .map(([key, config]) => ({ key, ...config }));
};

// Get all available languages for select dropdown
export const getAllLanguages = () => {
  return Object.entries(LANGUAGE_CONFIG)
    .map(([key, config]) => ({ key, ...config }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to login to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SNIPPET_CREATED: 'Snippet created successfully!',
  SNIPPET_UPDATED: 'Snippet updated successfully!',
  SNIPPET_DELETED: 'Snippet deleted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  COMMENT_DELETED: 'Comment deleted successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
};

// Animation Durations (in ms)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (following Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};
