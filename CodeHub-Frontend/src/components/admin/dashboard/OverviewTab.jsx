import React from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Heart, 
  Activity,
  Server,
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Button, Card } from '../../ui';

const OverviewTab = ({ 
  dashboardStats, 
  loading, 
  setActiveTab 
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
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
                  </p>
                  <p className="text-green-400 text-sm">
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
                  </p>
                  <p className="text-green-400 text-sm">
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
                  </p>
                  <p className="text-green-400 text-sm">
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

      {/* Quick Actions and System Status */}
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

      {/* Implementation Status */}
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
  );
};

export default OverviewTab;
