import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Filter, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../services/api';
import { Button, Card, Loading } from '../components/ui';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ unreadCount: 0, totalCount: 0 });
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load notifications
  const loadNotifications = async (pageNum = 0, filterType = filter, append = false) => {
    if (!isAuthenticated) return;

    try {
      setLoading(pageNum === 0 ? true : false);
      
      console.log('🔔 [Notifications] Loading notifications:', { pageNum, filterType });
      
      const response = await notificationsAPI.getNotifications(pageNum, 20, filterType);
      
      if (response && response.data) {
        const transformedNotifications = response.data.content.map(notification => ({
          id: notification.id,
          type: notification.type.toLowerCase(),
          title: notification.title,
          message: notification.message,
          timestamp: new Date(notification.createdAt),
          read: notification.read,
          actor: notification.actor,
          actionUrl: notification.actionUrl || '#'
        }));

        if (append) {
          setNotifications(prev => [...prev, ...transformedNotifications]);
        } else {
          setNotifications(transformedNotifications);
        }

        setHasMore(!response.data.last);
        console.log('✅ [Notifications] Loaded notifications:', transformedNotifications.length);
      }
    } catch (error) {
      console.warn('⚠️ [Notifications] API error, using mock data:', error.message);
      // Fallback to mock data
      setNotifications(getMockNotifications());
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load notification stats
  const loadStats = async () => {
    try {
      const response = await notificationsAPI.getStats();
      if (response && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.warn('⚠️ [Notifications] Failed to load stats:', error.message);
      setStats({ unreadCount: 3, totalCount: 10, todayCount: 2, weekCount: 8 });
    }
  };  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications(0, filter);
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, isAuthenticated]); // loadNotifications recreated on every render, but we only want to run on filter/auth changes

  // Mock notifications for fallback
  const getMockNotifications = () => [
    {
      id: 1,
      type: 'snippet_liked',
      title: 'New like on your snippet',
      message: 'John Doe liked your "React useEffect Hook" snippet',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actor: {
        id: 1,
        username: 'john_doe',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
      },
      actionUrl: '/snippets/123'
    },
    {
      id: 2,
      type: 'snippet_commented',
      title: 'New comment',
      message: 'Sarah Wilson commented on "JavaScript Promise Patterns"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actor: {
        id: 2,
        username: 'sarah_wilson',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
      },
      actionUrl: '/snippets/456'
    }
  ];

  // Get icon for notification type
  const getIconForType = (type) => {
    switch (type) {
      case 'snippet_liked': return Heart;
      case 'snippet_commented': return MessageSquare;
      case 'comment_liked': return Heart;
      case 'comment_replied': return MessageSquare;
      case 'user_followed': return UserPlus;
      case 'snippet_starred': return Star;
      default: return Bell;
    }
  };

  // Get icon color for notification type
  const getIconColorForType = (type) => {
    switch (type) {
      case 'snippet_liked': return 'text-red-500';
      case 'snippet_commented': return 'text-blue-500';
      case 'comment_liked': return 'text-pink-500';
      case 'comment_replied': return 'text-green-500';
      case 'user_followed': return 'text-green-500';
      case 'snippet_starred': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setStats(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
      toast.success('Notification marked as read');
    } catch (error) {
      console.warn('API error:', error.message);
      // Fallback to local update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      toast.success('Notification marked as read (local)');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setStats(prev => ({ ...prev, unreadCount: 0 }));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.warn('API error:', error.message);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read (local)');
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.warn('API error:', error.message);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification deleted (local)');
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage, filter, true);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  // Handle notification click with navigation
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please log in</h2>
          <p className="text-slate-400">You need to be logged in to view notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Bell className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-slate-400">
                {stats.unreadCount} unread • {stats.totalCount} total
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={stats.unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6">
          {['all', 'unread', 'read'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType === 'unread' && stats.unreadCount > 0 && (
                <span className="ml-2 text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded-full">
                  {stats.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-slate-400">
              {filter === 'unread' ? 'No unread notifications' :
               filter === 'read' ? 'No read notifications' : 'No notifications yet'}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const IconComponent = getIconForType(notification.type);
              const iconColor = getIconColorForType(notification.type);
              
              return (
                <Card
                  key={notification.id}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-cyan-500/5 border-l-4 border-cyan-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex space-x-4">
                    {/* Avatar & Icon */}
                    <div className="flex-shrink-0 relative">
                      {notification.actor?.avatarUrl ? (
                        <img
                          src={notification.actor.avatarUrl}
                          alt={notification.actor.username}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                          <IconComponent className={`w-6 h-6 ${iconColor}`} />
                        </div>
                      )}
                      
                      {/* Type Icon Badge */}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700`}>
                        <IconComponent className={`w-3 h-3 ${iconColor}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            notification.read ? 'text-slate-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-8 w-8 p-0 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
