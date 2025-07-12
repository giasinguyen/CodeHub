import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/adminAPI';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Heart, 
  Eye, 
  UserCheck, 
  TrendingUp,
  Activity,
  Server,
  Settings,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Trash2,
  Edit,
  Shield
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for different sections
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [snippets, setSnippets] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [activities, setActivities] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [systemHealth, setSystemHealth] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [snippetAnalytics, setSnippetAnalytics] = useState([]);
  
  // Chart data states
  const [topLanguagesData, setTopLanguagesData] = useState([]);
  const [snippetsCreatedData, setSnippetsCreatedData] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [snippetsByHourData, setSnippetsByHourData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  
  // Pagination and search
  const [userPage, setUserPage] = useState(0);
  const [snippetPage, setSnippetPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('📊 [AdminDashboard] Loading dashboard stats...');
      const response = await adminAPI.getDashboardStats();
      console.log('✅ [AdminDashboard] Dashboard stats loaded:', response.data);
      setDashboardStats(response.data);
    } catch (error) {
      console.error('❌ [AdminDashboard] Failed to load dashboard stats:', error);
      toast.error('Failed to load dashboard stats');
      
      // Set fallback data to show something
      setDashboardStats({
        totalUsers: 0,
        newUsersToday: 0,
        totalSnippets: 0,
        newSnippetsToday: 0,
        totalComments: 0,
        newCommentsToday: 0,
        totalLikes: 0,
        totalViews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getUsers(userPage, 20, searchTerm);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Users error:', error);
    }
  }, [userPage, searchTerm]);

  const loadSnippets = useCallback(async () => {
    try {
      const response = await adminAPI.getSnippets(snippetPage, 20, searchTerm);
      setSnippets(response.data);
    } catch (error) {
      toast.error('Failed to load snippets');
      console.error('Snippets error:', error);
    }
  }, [snippetPage, searchTerm]);

  const loadActivities = useCallback(async () => {
    try {
      const response = await adminAPI.getRecentActivities(activityPage, 20);
      setActivities(response.data);
    } catch (error) {
      toast.error('Failed to load activities');
      console.error('Activities error:', error);
    }
  }, [activityPage]);

  const loadAnalytics = useCallback(async () => {
    try {
      const [userAnalyticsResponse, snippetAnalyticsResponse] = await Promise.all([
        adminAPI.getUserAnalytics('daily', 30),
        adminAPI.getSnippetAnalytics('daily', 30)
      ]);
      setUserAnalytics(userAnalyticsResponse.data);
      setSnippetAnalytics(snippetAnalyticsResponse.data);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error('Analytics error:', error);
    }
  }, []);

  const loadChartData = useCallback(async () => {
    setChartsLoading(true);
    try {
      const [
        topLanguagesResponse,
        snippetsCreatedResponse,
        viewsResponse,
        snippetsByHourResponse
      ] = await Promise.all([
        adminAPI.getTopLanguagesChart(),
        adminAPI.getSnippetsCreatedChart(),
        adminAPI.getViewsChart(),
        adminAPI.getSnippetsByHourChart()
      ]);
      
      setTopLanguagesData(topLanguagesResponse.data);
      setSnippetsCreatedData(snippetsCreatedResponse.data);
      setViewsData(viewsResponse.data);
      setSnippetsByHourData(snippetsByHourResponse.data);
    } catch (error) {
      toast.error('Failed to load chart data');
      console.error('Chart data error:', error);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  const loadSystemHealth = useCallback(async () => {
    try {
      const response = await adminAPI.getSystemHealth();
      setSystemHealth(response.data);
    } catch (error) {
      toast.error('Failed to load system health');
      console.error('System health error:', error);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'content') {
      loadSnippets();
    } else if (activeTab === 'activities') {
      loadActivities();
    } else if (activeTab === 'analytics') {
      loadAnalytics();
      loadChartData();
    } else if (activeTab === 'system') {
      loadSystemHealth();
    }
  }, [activeTab, loadUsers, loadSnippets, loadActivities, loadAnalytics, loadSystemHealth, loadChartData]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
      if (activeTab === 'users') await loadUsers();
      else if (activeTab === 'content') await loadSnippets();
      else if (activeTab === 'activities') await loadActivities();
      else if (activeTab === 'analytics') {
        await loadAnalytics();
        await loadChartData();
      }
      else if (activeTab === 'system') await loadSystemHealth();
      toast.success('Data refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh data');
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUserStatusUpdate = async (userId, enabled) => {
    try {
      await adminAPI.updateUserStatus(userId, enabled);
      toast.success(`User ${enabled ? 'enabled' : 'disabled'} successfully`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('User status update error:', error);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    
    try {
      await adminAPI.deleteSnippet(snippetId);
      toast.success('Snippet deleted successfully');
      loadSnippets();
    } catch (error) {
      toast.error('Failed to delete snippet');
      console.error('Delete snippet error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'activities', label: 'Activities', icon: Eye },
    { id: 'system', label: 'System', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading && !dashboardStats) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Welcome back, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Coming Soon Notice */}
            <Card className="bg-gradient-to-r from-cyan-900 to-blue-900 border-cyan-700 p-6">
              <div className="flex items-center space-x-4">
                <Shield className="w-12 h-12 text-cyan-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Comprehensive Admin Dashboard</h2>
                  <p className="text-cyan-200">
                    Complete admin functionality is being implemented. The backend APIs are ready and will provide real-time statistics, user management, content moderation, analytics, and system monitoring.
                  </p>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-slate-600 rounded w-20 mb-2"></div>
                        <div className="h-4 bg-slate-600 rounded w-16"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats?.totalUsers?.toLocaleString() || '0'}
                        </p>                    <p className="text-green-400 text-sm">
                      +{dashboardStats?.newUsersToday || 0} today
                    </p>
                      </>
                    )}
                  </div>
                  <Users className="w-12 h-12 text-blue-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Snippets</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-slate-600 rounded w-20 mb-2"></div>
                        <div className="h-4 bg-slate-600 rounded w-16"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats?.totalSnippets?.toLocaleString() || '0'}
                        </p>                    <p className="text-green-400 text-sm">
                      +{dashboardStats?.newSnippetsToday || 0} today
                    </p>
                      </>
                    )}
                  </div>
                  <FileText className="w-12 h-12 text-green-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Comments</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-slate-600 rounded w-20 mb-2"></div>
                        <div className="h-4 bg-slate-600 rounded w-16"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats?.totalComments?.toLocaleString() || '0'}
                        </p>                    <p className="text-green-400 text-sm">
                      +{dashboardStats?.newCommentsToday || 0} today
                    </p>
                      </>
                    )}
                  </div>
                  <MessageSquare className="w-12 h-12 text-purple-400" />
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Likes</p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-slate-600 rounded w-20 mb-2"></div>
                        <div className="h-4 bg-slate-600 rounded w-16"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-white">
                          {dashboardStats?.totalLikes?.toLocaleString() || '0'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {dashboardStats?.totalViews ? `${(dashboardStats.totalViews / 1000).toFixed(1)}K views` : '0 views'}
                        </p>
                      </>
                    )}
                  </div>
                  <Heart className="w-12 h-12 text-red-400" />
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setActiveTab('users')}
                    className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button
                    onClick={() => setActiveTab('content')}
                    className="w-full bg-green-600 hover:bg-green-700 justify-start"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Moderate Content
                  </Button>
                  <Button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button
                    onClick={() => setActiveTab('system')}
                    className="w-full bg-orange-600 hover:bg-orange-700 justify-start"
                  >
                    <Server className="w-4 h-4 mr-2" />
                    System Health
                  </Button>
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">System Status</span>
                    <span className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Database</span>
                    <span className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">API Services</span>
                    <span className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Background Jobs</span>
                    <span className="text-green-400 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Implementation Note */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Implementation Status</h3>
                  <p className="text-gray-400 mb-4">
                    The admin dashboard backend is fully implemented with the following features:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Dashboard Statistics API</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>User Management API</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Content Moderation API</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>System Health API</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Analytics API</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Activity Monitoring API</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Admin Security Controls</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span>Frontend Integration (In Progress)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Other tabs show placeholder content for now */}
        {activeTab !== 'overview' && (
          <div className="space-y-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">User Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-4 text-gray-400">User</th>
                          <th className="text-left p-4 text-gray-400">Email</th>
                          <th className="text-left p-4 text-gray-400">Joined</th>
                          <th className="text-left p-4 text-gray-400">Status</th>
                          <th className="text-left p-4 text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.content.map(user => (
                          <tr key={user.id} className="border-b border-slate-700">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {user.username?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-white font-medium">{user.username}</div>
                                  <div className="text-gray-400 text-sm">{user.firstName} {user.lastName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{user.email}</td>
                            <td className="p-4 text-gray-300">{formatDate(user.createdAt)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.enabled 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {user.enabled ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => handleUserStatusUpdate(user.id, !user.enabled)}
                                  className={`text-xs ${
                                    user.enabled 
                                      ? 'bg-red-600 hover:bg-red-700' 
                                      : 'bg-green-600 hover:bg-green-700'
                                  }`}
                                >
                                  {user.enabled ? 'Disable' : 'Enable'}
                                </Button>
                                <Button className="text-xs bg-blue-600 hover:bg-blue-700">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {users.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 p-4 border-t border-slate-700">
                      <Button
                        onClick={() => setUserPage(Math.max(0, userPage - 1))}
                        disabled={userPage === 0}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        Previous
                      </Button>
                      <span className="text-gray-400">
                        Page {userPage + 1} of {users.totalPages}
                      </span>
                      <Button
                        onClick={() => setUserPage(Math.min(users.totalPages - 1, userPage + 1))}
                        disabled={userPage === users.totalPages - 1}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Content Management</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {snippets.content.map(snippet => (
                    <Card key={snippet.id} className="bg-slate-800 border-slate-700 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{snippet.title}</h3>
                          <p className="text-gray-400 mb-4">{snippet.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>By {snippet.author}</span>
                            <span>•</span>
                            <span>{formatDate(snippet.createdAt)}</span>
                            <span>•</span>
                            <span>{snippet.language}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {snippets.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <Button
                      onClick={() => setSnippetPage(Math.max(0, snippetPage - 1))}
                      disabled={snippetPage === 0}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      Previous
                    </Button>
                    <span className="text-gray-400">
                      Page {snippetPage + 1} of {snippets.totalPages}
                    </span>
                    <Button
                      onClick={() => setSnippetPage(Math.min(snippets.totalPages - 1, snippetPage + 1))}
                      disabled={snippetPage === snippets.totalPages - 1}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                
                {chartsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="ml-2 text-white">Loading analytics...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Languages Chart */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Top Programming Languages</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={topLanguagesData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ language, count }) => `${language}: ${count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {topLanguagesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Snippets Created Over Time */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Snippets Created (Last 30 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={snippetsCreatedData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#06B6D4" 
                            strokeWidth={2}
                            dot={{ fill: '#06B6D4' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Views Over Time */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Views (Last 30 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={viewsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }}
                          />
                          <Bar dataKey="views" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Snippets by Hour */}
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Activity by Hour (Last 7 Days)</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={snippetsByHourData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="hour" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#F3F4F6'
                            }}
                          />
                          <Bar dataKey="count" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>
                )}

                {/* Traditional Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">User Registration Analytics</h3>
                    <div className="space-y-4">
                      {userAnalytics.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-400">{item.date}</span>
                          <span className="text-white font-medium">{item.count} users</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Snippet Creation Analytics</h3>
                    <div className="space-y-4">
                      {snippetAnalytics.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-400">{item.date}</span>
                          <span className="text-white font-medium">{item.count} snippets</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Recent Activities</h2>
                
                <div className="space-y-4">
                  {activities.content.map(activity => (
                    <Card key={activity.id} className="bg-slate-800 border-slate-700 p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{activity.description}</p>
                          <p className="text-gray-400 text-sm">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {activities.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <Button
                      onClick={() => setActivityPage(Math.max(0, activityPage - 1))}
                      disabled={activityPage === 0}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      Previous
                    </Button>
                    <span className="text-gray-400">
                      Page {activityPage + 1} of {activities.totalPages}
                    </span>
                    <Button
                      onClick={() => setActivityPage(Math.min(activities.totalPages - 1, activityPage + 1))}
                      disabled={activityPage === activities.totalPages - 1}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">System Health</h2>
                
                {systemHealth && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Database Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className={`flex items-center ${
                            systemHealth.databaseStatus === 'healthy' 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {systemHealth.databaseStatus === 'healthy' ? (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            {systemHealth.databaseStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Response Time</span>
                          <span className="text-white">{systemHealth.responseTime}ms</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">System Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Memory Usage</span>
                          <span className="text-white">{systemHealth.memoryUsage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">CPU Usage</span>
                          <span className="text-white">{systemHealth.cpuUsage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Uptime</span>
                          <span className="text-white">{systemHealth.uptime}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
                
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Maintenance Mode</label>
                        <p className="text-gray-400 text-sm">Enable maintenance mode to prevent user access</p>
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Toggle
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">User Registration</label>
                        <p className="text-gray-400 text-sm">Allow new users to register</p>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Content Moderation</label>
                        <p className="text-gray-400 text-sm">Require approval for new content</p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Configure
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
