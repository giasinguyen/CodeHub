import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // New functions for activity management
  const viewActivityDetails = (activity) => {
    const details = {
      id: activity.id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      userUsername: activity.userUsername,
      userEmail: activity.userEmail,
      ipAddress: activity.ipAddress,
      userAgent: activity.userAgent,
      details: activity.details
    };

    const detailsWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    detailsWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Details - ${activity.id}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #1e293b, #334155);
              color: #e2e8f0;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
            }
            .container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: rgba(30, 41, 59, 0.8);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 30px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(148, 163, 184, 0.1);
            }
            .header { 
              border-bottom: 2px solid #334155; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
              text-align: center;
            }
            .header h1 { 
              color: #38bdf8; 
              margin: 0; 
              font-size: 28px;
              font-weight: 700;
            }
            .section { 
              margin-bottom: 25px; 
              background: rgba(51, 65, 85, 0.6);
              padding: 20px;
              border-radius: 12px;
              border: 1px solid rgba(148, 163, 184, 0.1);
            }
            .section h3 { 
              color: #06b6d4; 
              margin-top: 0; 
              margin-bottom: 15px;
              font-size: 18px;
              font-weight: 600;
            }
            .field { 
              margin-bottom: 15px; 
            }
            .field-label { 
              font-weight: 600; 
              color: #94a3b8; 
              display: inline-block; 
              width: 120px;
              font-size: 14px;
            }
            .field-value { 
              color: #e2e8f0;
              font-family: 'Courier New', monospace;
              background: rgba(15, 23, 42, 0.8);
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid rgba(148, 163, 184, 0.2);
              display: inline-block;
              min-width: 200px;
            }
            .json-container { 
              background: rgba(15, 23, 42, 0.9); 
              padding: 20px; 
              border-radius: 8px; 
              border: 1px solid rgba(148, 163, 184, 0.2);
              font-family: 'Courier New', monospace; 
              white-space: pre-wrap; 
              overflow-x: auto;
              color: #38bdf8;
              font-size: 13px;
              line-height: 1.5;
            }
            .btn { 
              background: linear-gradient(135deg, #06b6d4, #0891b2); 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              font-weight: 600;
              font-size: 14px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
            }
            .btn:hover { 
              background: linear-gradient(135deg, #0891b2, #0e7490);
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
            }
            .actions { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px;
              border-top: 1px solid #334155;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔍 Activity Details</h1>
            </div>
            
            <div class="section">
              <h3>📋 Basic Information</h3>
              <div class="field">
                <span class="field-label">ID:</span>
                <span class="field-value">${details.id || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Type:</span>
                <span class="field-value">${details.type || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Description:</span>
                <span class="field-value">${details.description || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Timestamp:</span>
                <span class="field-value">${new Date(details.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div class="section">
              <h3>👤 User Information</h3>
              <div class="field">
                <span class="field-label">Username:</span>
                <span class="field-value">${details.userUsername || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">Email:</span>
                <span class="field-value">${details.userEmail || 'N/A'}</span>
              </div>
            </div>

            <div class="section">
              <h3>🌐 Session Information</h3>
              <div class="field">
                <span class="field-label">IP Address:</span>
                <span class="field-value">${details.ipAddress || 'N/A'}</span>
              </div>
              <div class="field">
                <span class="field-label">User Agent:</span>
                <span class="field-value">${details.userAgent ? details.userAgent.substring(0, 100) + '...' : 'N/A'}</span>
              </div>
            </div>

            ${details.details ? `
            <div class="section">
              <h3>📊 Additional Details</h3>
              <div class="json-container">${typeof details.details === 'object' ? JSON.stringify(details.details, null, 2) : details.details}</div>
            </div>
            ` : ''}

            <div class="actions">
              <button class="btn" onclick="window.print()">🖨️ Print Details</button>
              <button class="btn" onclick="window.close()" style="margin-left: 10px; background: linear-gradient(135deg, #ef4444, #dc2626);">❌ Close</button>
            </div>
          </div>
        </body>
      </html>
    `);
    detailsWindow.document.close();
  };

  const exportActivities = async () => {
    try {
      toast.loading('Exporting activities...');
      
      // Get all activities (not just current page)
      const allActivitiesResponse = await adminAPI.getRecentActivities(0, 1000);
      const allActivities = allActivitiesResponse.data.content;
      
      // Prepare CSV data
      const csvHeaders = [
        'ID',
        'Type', 
        'Description',
        'Timestamp',
        'Username',
        'Email',
        'IP Address',
        'User Agent',
        'Details'
      ];
      
      const csvData = allActivities.map(activity => [
        activity.id || '',
        activity.type || '',
        activity.description || '',
        activity.timestamp || '',
        activity.userUsername || '',
        activity.userEmail || '',
        activity.ipAddress || '',
        activity.userAgent || '',
        activity.details ? (typeof activity.details === 'object' ? JSON.stringify(activity.details) : activity.details) : ''
      ]);
      
      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `codehub-activities-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Successfully exported ${allActivities.length} activities to CSV`);
      
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export activities');
      console.error('Export error:', error);
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
                                  onClick={() => navigate(`/admin/users/${user.id}`)}
                                  className="text-xs bg-cyan-600 hover:bg-cyan-700"
                                >
                                  View Details
                                </Button>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">System Activities</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">
                      Total: {activities.totalElements} activities
                    </span>
                    <Button 
                      onClick={() => exportActivities()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-sm font-medium px-4 py-2 shadow-lg transition-all duration-200"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Export Activities
                    </Button>
                    <Button
                      onClick={refreshData}
                      disabled={refreshing}
                      className="bg-slate-700 hover:bg-slate-600"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Snippet Activities</p>
                        <p className="text-white font-semibold">
                          {activities.content.filter(a => a.type?.includes('SNIPPET') || a.description?.toLowerCase().includes('snippet')).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Comment Activities</p>
                        <p className="text-white font-semibold">
                          {activities.content.filter(a => a.type?.includes('COMMENT') || a.description?.toLowerCase().includes('comment')).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">User Activities</p>
                        <p className="text-white font-semibold">
                          {activities.content.filter(a => a.type?.includes('USER') || a.description?.toLowerCase().includes('user')).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Like Activities</p>
                        <p className="text-white font-semibold">
                          {activities.content.filter(a => a.type?.includes('LIKE') || a.description?.toLowerCase().includes('like')).length}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Activity List */}
                <div className="space-y-4">
                  {activities.content.length > 0 ? (
                    activities.content.map((activity, index) => (
                      <Card key={activity.id || index} className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 p-6 hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg">
                        <div className="flex items-start space-x-5">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                               style={{
                                 background: (activity.type?.includes('SNIPPET') || activity.description?.toLowerCase().includes('snippet')) ? 'linear-gradient(135deg, #3b82f6, #1e40af)' :
                                            (activity.type?.includes('COMMENT') || activity.description?.toLowerCase().includes('comment')) ? 'linear-gradient(135deg, #10b981, #047857)' :
                                            (activity.type?.includes('LIKE') || activity.description?.toLowerCase().includes('like')) ? 'linear-gradient(135deg, #ef4444, #b91c1c)' :
                                            (activity.type?.includes('USER') || activity.description?.toLowerCase().includes('user')) ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' :
                                            'linear-gradient(135deg, #06b6d4, #0891b2)'
                               }}>
                            {(activity.type?.includes('SNIPPET') || activity.description?.toLowerCase().includes('snippet')) && <FileText className="w-7 h-7 text-white" />}
                            {(activity.type?.includes('COMMENT') || activity.description?.toLowerCase().includes('comment')) && <MessageSquare className="w-7 h-7 text-white" />}
                            {(activity.type?.includes('LIKE') || activity.description?.toLowerCase().includes('like')) && <Heart className="w-7 h-7 text-white" />}
                            {(activity.type?.includes('USER') || activity.description?.toLowerCase().includes('user')) && <Users className="w-7 h-7 text-white" />}
                            {!['snippet', 'comment', 'like', 'user'].some(type => 
                              activity.type?.toLowerCase().includes(type) || 
                              activity.description?.toLowerCase().includes(type)
                            ) && <Activity className="w-7 h-7 text-white" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg mb-3">{activity.description}</h4>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
                                  <div className="flex items-center space-x-2 bg-slate-600 px-3 py-1.5 rounded-full">
                                    <Activity className="w-4 h-4" />
                                    <span className="font-medium">{formatDate(activity.timestamp)}</span>
                                  </div>
                                  
                                  {activity.type && (
                                    <div className="flex items-center space-x-2 bg-cyan-600 px-3 py-1.5 rounded-full">
                                      <Shield className="w-4 h-4" />
                                      <span className="font-semibold">
                                        {activity.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {activity.userUsername && (
                                    <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1.5 rounded-full">
                                      <Users className="w-4 h-4" />
                                      <span className="font-medium">@{activity.userUsername}</span>
                                    </div>
                                  )}

                                  {activity.userEmail && (
                                    <div className="flex items-center space-x-2 bg-green-600 px-3 py-1.5 rounded-full">
                                      <MessageSquare className="w-4 h-4" />
                                      <span className="font-medium">{activity.userEmail}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Additional Activity Details */}
                                {activity.details && (
                                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                      <p className="text-gray-300 font-medium text-sm">Activity Details</p>
                                    </div>
                                    <pre className="text-gray-400 text-xs overflow-x-auto bg-slate-800 p-3 rounded-lg border border-slate-600">
                                      {typeof activity.details === 'object' ? 
                                        JSON.stringify(activity.details, null, 2) : 
                                        activity.details}
                                    </pre>
                                  </div>
                                )}

                                {/* IP Address and User Agent */}
                                {(activity.ipAddress || activity.userAgent) && (
                                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600 mt-3">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                      <p className="text-gray-300 font-medium text-sm">Session Information</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                      {activity.ipAddress && (
                                        <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                          <span className="text-gray-400">IP Address: </span>
                                          <span className="text-gray-300 font-mono">{activity.ipAddress}</span>
                                        </div>
                                      )}
                                      {activity.userAgent && (
                                        <div className="bg-slate-800 p-2 rounded border border-slate-600">
                                          <span className="text-gray-400">User Agent: </span>
                                          <span className="text-gray-300 font-mono">{activity.userAgent}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3 ml-6">
                                <Button 
                                  onClick={() => viewActivityDetails(activity)}
                                  className="bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-sm px-4 py-2 font-medium shadow-md transition-all duration-200"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 p-16 text-center shadow-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Activity className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">No Activities Found</h4>
                      <p className="text-gray-300 mb-6 text-lg">No system activities have been recorded yet.</p>
                      <div className="bg-slate-700 rounded-xl p-6 border border-slate-600">
                        <p className="text-gray-300 font-medium mb-4">Activities that will be tracked include:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-200">Snippet creation</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                            <MessageSquare className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-200">Comment posting</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-200">User registration</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-600 px-3 py-2 rounded-full">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-200">Content liking</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Pagination */}
                {activities.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 pt-6 border-t border-slate-700">
                    <Button
                      onClick={() => setActivityPage(Math.max(0, activityPage - 1))}
                      disabled={activityPage === 0}
                      className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-4 py-2 font-medium"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">
                        Page {activityPage + 1} of {activities.totalPages}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({activities.totalElements} total activities)
                      </span>
                    </div>
                    <Button
                      onClick={() => setActivityPage(Math.min(activities.totalPages - 1, activityPage + 1))}
                      disabled={activityPage === activities.totalPages - 1}
                      className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-4 py-2 font-medium"
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
