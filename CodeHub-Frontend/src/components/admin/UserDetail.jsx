import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Heart, 
  Eye,
  ArrowLeft,
  Edit,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Activity,
  Clock,
  Code,
  Star,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { Button, Card } from '../ui';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userSnippets, setUserSnippets] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const [userResponse, statsResponse, snippetsResponse, activitiesResponse] = await Promise.all([
        adminAPI.getUserById(userId),
        adminAPI.getUserStats(userId),
        adminAPI.getUserSnippets(userId, 0, 10),
        adminAPI.getUserActivities(userId, 0, 10)
      ]);

      setUser(userResponse.data);
      setUserStats(statsResponse.data);
      setUserSnippets(snippetsResponse.data.content || []);
      setUserActivities(activitiesResponse.data.content || []);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, loadUserData]);

  const handleUserStatusUpdate = async (enabled) => {
    try {
      await adminAPI.updateUserStatus(userId, enabled);
      toast.success(`User ${enabled ? 'enabled' : 'disabled'} successfully`);
      setUser(prev => ({ ...prev, enabled }));
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('User status update error:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'snippets', label: 'Snippets', icon: FileText },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">User Not Found</h2>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard?tab=users')} className="bg-cyan-600 hover:bg-cyan-700">
            Back to Users
          </Button>
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
              <Button
                onClick={() => navigate('/dashboard?tab=users')}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                  <p className="text-gray-400">{user.firstName} {user.lastName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => handleUserStatusUpdate(!user.enabled)}
                className={user.enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {user.enabled ? (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Disable User
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enable User
                  </>
                )}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
              <Button
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
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
            {/* User Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Join Date</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {user.enabled ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Login</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-white">
                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Statistics */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Statistics
                </h3>
                {userStats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Snippets</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.totalSnippets || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400">Comments</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.totalComments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-gray-400">Likes Given</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.totalLikes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-400">Likes Received</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.likesReceived || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Profile Views</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.profileViews || 0}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">Loading statistics...</div>
                )}
              </Card>

              {/* Account Details */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Role</label>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.roles?.includes('ADMIN') 
                          ? 'bg-red-900 text-red-300' 
                          : 'bg-blue-900 text-blue-300'
                      }`}>
                        {user.roles?.includes('ADMIN') ? 'Administrator' : 'User'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Account ID</label>
                    <div className="mt-1">
                      <span className="text-white font-mono text-sm">{user.id}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email Verified</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {user.emailVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {userActivities.length > 0 ? (
                  userActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.description}</p>
                        <p className="text-gray-400 text-xs">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No recent activity</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Snippets Tab */}
        {activeTab === 'snippets' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">User's Snippets</h3>
            <div className="grid gap-4">
              {userSnippets.length > 0 ? (
                userSnippets.map(snippet => (
                  <Card key={snippet.id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">{snippet.title}</h4>
                        <p className="text-gray-400 mb-4">{snippet.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Code className="w-4 h-4" />
                            <span>{snippet.language}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(snippet.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{snippet.likesCount || 0} likes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{snippet.viewsCount || 0} views</span>
                          </div>
                        </div>
                        {snippet.tags && snippet.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                              {snippet.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-xs">
                          View
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">This user hasn't created any snippets yet.</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Activity History</h3>
            <div className="space-y-4">
              {userActivities.length > 0 ? (
                userActivities.map((activity, index) => (
                  <Card key={index} className="bg-slate-800 border-slate-700 p-4">
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
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No activity history available.</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Security & Permissions</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Account Security</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Two-Factor Authentication</span>
                    <span className="text-red-400">Disabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Login Attempts (Last 24h)</span>
                    <span className="text-white">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Password Last Changed</span>
                    <span className="text-white">{user.passwordChangedAt ? formatDate(user.passwordChangedAt) : 'Unknown'}</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Account Actions</h4>
                <div className="space-y-3">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start">
                    Reset Password
                  </Button>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 justify-start">
                    Send Verification Email
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start">
                    View Login History
                  </Button>
                  <Button 
                    onClick={() => handleUserStatusUpdate(!user.enabled)}
                    className={`w-full justify-start ${
                      user.enabled 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {user.enabled ? 'Suspend Account' : 'Activate Account'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
