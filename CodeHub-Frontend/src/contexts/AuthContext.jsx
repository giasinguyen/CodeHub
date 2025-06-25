import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { STORAGE_KEYS } from '../constants';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  isLoading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_TOKEN: 'SET_TOKEN',
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        token: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);  // Initialize authentication
  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const tokenExpiration = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRATION);
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Check if token is expired
      if (tokenExpiration) {
        const expirationDate = new Date(tokenExpiration);
        const now = new Date();
        
        if (now > expirationDate) {
          console.log('Token expired, logging out');
          logout();
          return;
        }
      }

      // Verify token and get user info
      const response = await authAPI.getCurrentUser();
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.data,
          token,
        },
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      logout();
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.login({
        username: credentials.username,
        password: credentials.password
      });
      
      const { token, user } = response.data;

      // Store token with different expiration based on rememberMe
      if (credentials.rememberMe) {
        // Set longer expiration for remember me (30 days)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationDate.toISOString());
      } else {
        // Set shorter expiration for regular login (1 day)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRATION, expirationDate.toISOString());
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });

      toast.success('Đăng nhập thành công!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let message = 'Đăng nhập thất bại';
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        switch (status) {
          case 401:
            if (errorData?.message?.toLowerCase().includes('username') || 
                errorData?.message?.toLowerCase().includes('user not found')) {
              message = 'Tên đăng nhập không tồn tại';
            } else if (errorData?.message?.toLowerCase().includes('password') ||
                       errorData?.message?.toLowerCase().includes('invalid credentials')) {
              message = 'Mật khẩu không chính xác';
            } else {
              message = 'Thông tin đăng nhập không chính xác';
            }
            break;
          case 403:
            message = 'Tài khoản đã bị khóa hoặc chưa được kích hoạt';
            break;
          case 404:
            message = 'Tên đăng nhập không tồn tại';
            break;
          case 429:
            message = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau';
            break;
          case 500:
            message = 'Lỗi máy chủ. Vui lòng thử lại sau';
            break;
          default:
            message = errorData?.message || 'Đăng nhập thất bại';
        }
      } else if (error.request) {
        message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng';
      }
      
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        const response = await authAPI.register(userData);
      const { token, user } = response.data;

      // Store token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };  // Logout function
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRATION);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Đăng xuất thành công!');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data,
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
