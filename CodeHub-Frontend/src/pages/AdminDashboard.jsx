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

// Import dashboard tab components
import {
  OverviewTab,
  UsersTab,
  ContentTab,
  AnalyticsTab,
  ActivitiesTab,
  SystemTab,
  SettingsTab
} from '../components/admin/dashboard';

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
  
  // Pagination and search
  const [userPage, setUserPage] = useState(0);
  const [snippetPage, setSnippetPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Analytics data
  const [chartsLoading, setChartsLoading] = useState(false);
  const [topLanguagesData, setTopLanguagesData] = useState([]);
  const [snippetsCreatedData, setSnippetsCreatedData] = useState([]);
  const [viewsData, setViewsData] = useState([]);
  const [snippetsByHourData, setSnippetsByHourData] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [snippetAnalytics, setSnippetAnalytics] = useState([]);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Define all callback functions first
  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await adminAPI.getUsers(userPage, 10, searchTerm);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [userPage, searchTerm]);

  const loadSnippets = useCallback(async () => {
    try {
      const response = await adminAPI.getSnippets(snippetPage, 10, searchTerm);
      setSnippets(response.data);
    } catch (error) {
      console.error('Error loading snippets:', error);
    }
  }, [snippetPage, searchTerm]);

  const loadActivities = useCallback(async () => {
    try {
      const response = await adminAPI.getRecentActivities(activityPage, 10);
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  }, [activityPage]);

  const loadSystemHealth = useCallback(async () => {
    try {
      const response = await adminAPI.getSystemHealth();
      setSystemHealth(response.data);
    } catch (error) {
      console.error('Error loading system health:', error);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      setChartsLoading(true);
      const [
        topLanguages,
        snippetsCreated,
        views,
        snippetsByHour,
        userStats,
        snippetStats
      ] = await Promise.all([
        adminAPI.getTopLanguagesChart(),
        adminAPI.getSnippetsCreatedChart(),
        adminAPI.getViewsChart(),
        adminAPI.getSnippetsByHourChart(),
        adminAPI.getUserAnalytics(),
        adminAPI.getSnippetAnalytics()
      ]);

      setTopLanguagesData(topLanguages.data || []);
      setSnippetsCreatedData(snippetsCreated.data || []);
      setViewsData(views.data || []);
      setSnippetsByHourData(snippetsByHour.data || []);
      setUserAnalytics(userStats.data || []);
      setSnippetAnalytics(snippetStats.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setChartsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadDashboardStats(),
        loadUsers(),
        loadSnippets(),
        loadActivities(),
        loadSystemHealth()
      ]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardStats, loadUsers, loadSnippets, loadActivities, loadSystemHealth]);

  // Load initial data
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      refreshData();
    }
  }, [user, refreshData]);

  // Load data based on active tab
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      switch (activeTab) {
        case 'overview':
          loadDashboardStats();
          break;
        case 'users':
          loadUsers();
          break;
        case 'content':
          loadSnippets();
          break;
        case 'analytics':
          loadAnalytics();
          break;
        case 'activities':
          loadActivities();
          break;
        case 'system':
          loadSystemHealth();
          break;
        default:
          break;
      }
    }
  }, [activeTab, userPage, snippetPage, activityPage, searchTerm, user?.role, loadDashboardStats, loadUsers, loadSnippets, loadAnalytics, loadActivities, loadSystemHealth]);

  const handleUserStatusUpdate = useCallback(async (userId, enabled) => {
    try {
      await adminAPI.updateUserStatus(userId, enabled);
      toast.success(`User ${enabled ? 'enabled' : 'disabled'} successfully`);
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  }, [loadUsers]);

  const handleDeleteSnippet = useCallback(async (snippetId) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await adminAPI.deleteSnippet(snippetId);
        toast.success('Snippet deleted successfully');
        loadSnippets();
      } catch (error) {
        console.error('Error deleting snippet:', error);
        toast.error('Failed to delete snippet');
      }
    }
  }, [loadSnippets]);

  const exportActivities = () => {
    try {
      const csvContent = [
        ['Timestamp', 'Type', 'Description', 'User', 'Email', 'IP Address'].join(','),
        ...activities.content.map(activity => [
          new Date(activity.timestamp).toLocaleString(),
          activity.type || 'N/A',
          `"${activity.description || 'N/A'}"`,
          activity.userUsername || 'N/A',
          activity.userEmail || 'N/A',
          activity.ipAddress || 'N/A'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `system_activities_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Activities exported successfully');
    } catch (error) {
      console.error('Error exporting activities:', error);
      toast.error('Failed to export activities');
    }
  };

  const viewActivityDetails = (activity) => {
    const detailWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activity Details - ${activity.description}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #4f46e5;
          }
          .field-label {
            font-weight: 600;
            color: #4f46e5;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .field-value {
            color: #333;
            font-size: 16px;
            word-break: break-word;
          }
          .timestamp {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            font-weight: 500;
          }
          .type-badge {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-section {
            background: #1f2937;
            color: #e5e7eb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
          }
          .close-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: 500;
            transition: transform 0.2s;
          }
          .close-btn:hover {
            transform: translateY(-2px);
          }
          .print-btn {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 20px;
            margin-right: 10px;
            font-weight: 500;
            transition: transform 0.2s;
          }
          .print-btn:hover {
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Activity Details</h1>
            <p>Comprehensive view of system activity</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Timestamp</div>
              <div class="field-value">
                <span class="timestamp">${new Date(activity.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            ${activity.type ? `
            <div class="field">
              <div class="field-label">Activity Type</div>
              <div class="field-value">
                <span class="type-badge">${activity.type.replace(/_/g, ' ')}</span>
              </div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="field-label">Description</div>
              <div class="field-value">${activity.description || 'No description available'}</div>
            </div>
            
            ${activity.userUsername ? `
            <div class="field">
              <div class="field-label">User</div>
              <div class="field-value">@${activity.userUsername}</div>
            </div>
            ` : ''}
            
            ${activity.userEmail ? `
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${activity.userEmail}</div>
            </div>
            ` : ''}
            
            ${activity.ipAddress ? `
            <div class="field">
              <div class="field-label">IP Address</div>
              <div class="field-value">${activity.ipAddress}</div>
            </div>
            ` : ''}
            
            ${activity.userAgent ? `
            <div class="field">
              <div class="field-label">User Agent</div>
              <div class="field-value">${activity.userAgent}</div>
            </div>
            ` : ''}
            
            ${activity.details ? `
            <div class="field">
              <div class="field-label">Additional Details</div>
              <div class="field-value">
                <div class="details-section">
                  <pre>${typeof activity.details === 'object' ? JSON.stringify(activity.details, null, 2) : activity.details}</pre>
                </div>
              </div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <button class="print-btn" onclick="window.print()">🖨️ Print</button>
              <button class="close-btn" onclick="window.close()">✕ Close</button>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    detailWindow.document.write(htmlContent);
    detailWindow.document.close();
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
    { id: 'activities', label: 'Activities', icon: MessageSquare },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Manage users, content, and system settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold text-cyan-400">{user.username}</p>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            dashboardStats={dashboardStats}
            loading={loading}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab !== 'overview' && (
          <div className="space-y-6">
            {activeTab === 'users' && (
              <UsersTab 
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                userPage={userPage}
                setUserPage={setUserPage}
                handleUserStatusUpdate={handleUserStatusUpdate}
                formatDate={formatDate}
                navigate={navigate}
              />
            )}

            {activeTab === 'content' && (
              <ContentTab 
                snippets={snippets}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                snippetPage={snippetPage}
                setSnippetPage={setSnippetPage}
                handleDeleteSnippet={handleDeleteSnippet}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab 
                chartsLoading={chartsLoading}
                topLanguagesData={topLanguagesData}
                snippetsCreatedData={snippetsCreatedData}
                viewsData={viewsData}
                snippetsByHourData={snippetsByHourData}
                userAnalytics={userAnalytics}
                snippetAnalytics={snippetAnalytics}
              />
            )}

            {activeTab === 'activities' && (
              <ActivitiesTab 
                activities={activities}
                activityPage={activityPage}
                setActivityPage={setActivityPage}
                exportActivities={exportActivities}
                viewActivityDetails={viewActivityDetails}
                refreshData={refreshData}
                refreshing={refreshing}
                formatDate={formatDate}
              />
            )}

            {activeTab === 'system' && (
              <SystemTab 
                systemHealth={systemHealth}
                refreshData={refreshData}
                refreshing={refreshing}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
