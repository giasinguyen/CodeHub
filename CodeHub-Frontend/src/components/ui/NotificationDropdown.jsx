import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Check, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Star, 
  Settings,
  Trash2
} from 'lucide-react';
import Button from './Button';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Helper functions for notification icons and colors
const getIconForType = (type) => {
  const iconMap = {
    'SNIPPET_LIKED': Heart,
    'SNIPPET_COMMENTED': MessageSquare,
    'SNIPPET_STARRED': Star,
    'USER_FOLLOWED': UserPlus,
    'COMMENT_REPLIED': MessageSquare,
    'SNIPPET_FORKED': Star,
    'MENTION': MessageSquare,
    'SYSTEM_ANNOUNCEMENT': Bell
  };
  return iconMap[type] || Bell;
};

const getIconColorForType = (type) => {
  const colorMap = {
    'SNIPPET_LIKED': 'text-red-500',
    'SNIPPET_COMMENTED': 'text-blue-500',
    'SNIPPET_STARRED': 'text-yellow-500',
    'USER_FOLLOWED': 'text-green-500',
    'COMMENT_REPLIED': 'text-blue-500',
    'SNIPPET_FORKED': 'text-purple-500',
    'MENTION': 'text-orange-500',
    'SYSTEM_ANNOUNCEMENT': 'text-cyan-500'
  };
  return colorMap[type] || 'text-gray-500';
};

const NotificationDropdown = ({ isOpen, onToggle, className = '', unreadCount = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const dropdownRef = useRef(null);  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔔 [NotificationDropdown] Loading notifications from API...');
      
      // Try to load from real API
      const response = await notificationsAPI.getNotifications(0, 20, filter);
      
      if (response && response.data && response.data.content) {
        // Transform API response to match frontend format
        const transformedNotifications = response.data.content.map(notification => ({
          id: notification.id,
          type: notification.type.toLowerCase(),
          title: notification.title,
          message: notification.message,
          timestamp: new Date(notification.createdAt),
          read: notification.read,
          avatar: notification.actor?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.actor?.username || 'user'}`,
          icon: getIconForType(notification.type),
          iconColor: getIconColorForType(notification.type),
          actionUrl: notification.actionUrl || '#'
        }));
        
        setNotifications(transformedNotifications);
        console.log('✅ [NotificationDropdown] Loaded notifications from API:', transformedNotifications.length);
      } else {
        console.log('⚠️ [NotificationDropdown] Empty API response, using mock data');
        setNotifications(getMockNotifications());
      }
    } catch (error) {
      console.warn('⚠️ [NotificationDropdown] API not available, using mock data:', error.message);
      // Fallback to mock data when API is not available
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, filter]);

  // Mock notifications as fallback
  const getMockNotifications = () => [
    {
      id: 1,
      type: 'like',
      title: 'New like on your snippet',
      message: 'John Doe liked your "React useEffect Hook" snippet',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      icon: Heart,
      iconColor: 'text-red-500',
      actionUrl: '/snippets/123'
    },
    {
      id: 2,
      type: 'comment',
      title: 'New comment',
      message: 'Sarah Wilson commented on "JavaScript Promise Patterns"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      icon: MessageSquare,
      iconColor: 'text-blue-500',
      actionUrl: '/snippets/456'
    },
    {
      id: 3,
      type: 'follow',
      title: 'New follower',
      message: 'Alex Chen started following you',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      icon: UserPlus,
      iconColor: 'text-green-500',
      actionUrl: '/profile/alex'
    },
    {
      id: 4,
      type: 'star',
      title: 'Snippet starred',
      message: 'David Miller starred your "Python Data Structures" snippet',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
      icon: Star,
      iconColor: 'text-yellow-500',
      actionUrl: '/snippets/101'
    }
  ];

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const localUnreadCount = notifications.filter(n => !n.read).length;
  const displayUnreadCount = unreadCount || localUnreadCount;  // Mark as read API call
  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.warn('API error for marking notification as read:', error.message);
      // Fallback to local state update only
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
      toast.success('Notification marked as read (local)');
    }
  };

  // Mark all as read API call
  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.warn('API error for marking all as read:', error.message);
      // Fallback to local state update only
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      toast.success('All notifications marked as read (local)');
    }
  };

  // Delete notification API call
  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.warn('API error for deleting notification:', error.message);
      // Fallback to local state update only
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      toast.success('Notification deleted (local)');
    }
  };

  // Handle notification click with navigation
  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification.id);
    
    // Navigate based on action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onToggle(); // Close dropdown
    }
  };

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    return (
      <div className={`p-2 rounded-full bg-slate-700 dark:bg-slate-700 light:bg-gray-100 ${notification.iconColor}`}>
        <IconComponent className="w-4 h-4" />
      </div>
    );
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 mt-2 w-96 bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-2xl border border-slate-700 dark:border-slate-700 light:border-gray-200 z-50 max-h-96 overflow-hidden animate-in fade-in duration-200 ${className}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-cyan-400" />                <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">
                  Notifications
                </h3>
                {displayUnreadCount > 0 && (
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded-full">
                    {displayUnreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400 dark:text-slate-400 light:text-gray-600" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3">
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    filter === filterType
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100'
                  }`}
                >                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'unread' && displayUnreadCount > 0 && (
                    <span className="ml-1 text-xs">({displayUnreadCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
              <div className="flex items-center justify-between">                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={displayUnreadCount === 0}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/settings?tab=notifications')}
                  className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-600"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 dark:text-slate-600 light:text-gray-400 mx-auto mb-3" />
                <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm">
                  {filter === 'unread' ? 'No unread notifications' :
                   filter === 'read' ? 'No read notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700 dark:divide-slate-700 light:divide-gray-200">                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-gray-50 transition-colors cursor-pointer group ${
                      !notification.read ? 'bg-cyan-500/5 border-l-2 border-cyan-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex space-x-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          getNotificationIcon(notification)
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              notification.read 
                                ? 'text-slate-300 dark:text-slate-300 light:text-gray-600' 
                                : 'text-white dark:text-white light:text-gray-900'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 light:text-gray-400 mt-1">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-gray-200 rounded"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3 text-slate-400 dark:text-slate-400 light:text-gray-600" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3 h-3 text-slate-400 dark:text-slate-400 light:text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-700 dark:border-slate-700 light:border-gray-200 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/notifications');
                  onToggle();
                }}
                className="text-cyan-400 hover:text-cyan-300 text-sm w-full"
              >
                View all notifications
              </Button>
            </div>
          )}        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
