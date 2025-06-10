import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, GitFork, Code2, Eye, Calendar, TrendingUp } from 'lucide-react';
import { Card, Loading } from '../ui';

const ProfileActivity = ({ userId, isOwnProfile }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, snippets, likes, comments, follows

  useEffect(() => {
    loadActivity();
  }, [userId, filter]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement activity API endpoint
      // For now, we'll use mock data
      const mockActivities = [
        {
          id: 1,
          type: 'snippet_created',
          data: {
            snippet: {
              id: 1,
              title: 'React Custom Hook for API Calls',
              language: 'JavaScript'
            }
          },
          createdAt: '2024-12-09T10:30:00Z'
        },
        {
          id: 2,
          type: 'snippet_liked',
          data: {
            snippet: {
              id: 2,
              title: 'Python Data Validation',
              author: 'jane_doe'
            }
          },
          createdAt: '2024-12-08T15:45:00Z'
        },
        {
          id: 3,
          type: 'comment_added',
          data: {
            snippet: {
              id: 3,
              title: 'CSS Grid Layout Tips'
            },
            comment: 'Great solution! This helped me solve a similar problem.'
          },
          createdAt: '2024-12-07T09:20:00Z'
        },
        {
          id: 4,
          type: 'snippet_forked',
          data: {
            snippet: {
              id: 4,
              title: 'JWT Authentication Helper',
              author: 'dev_master'
            }
          },
          createdAt: '2024-12-06T14:15:00Z'
        },
        {
          id: 5,
          type: 'user_followed',
          data: {
            user: {
              id: 5,
              username: 'code_ninja',
              avatarUrl: null
            }
          },
          createdAt: '2024-12-05T11:30:00Z'
        }
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to load activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'snippet_created':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'snippet_liked':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'comment_added':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'snippet_forked':
        return <GitFork className="w-5 h-5 text-green-400" />;
      case 'user_followed':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      default:
        return <Eye className="w-5 h-5 text-slate-400" />;
    }
  };

  const getActivityText = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'snippet_created':
        return (
          <span>
            Created snippet <span className="font-medium text-white">"{data.snippet.title}"</span>
          </span>
        );
      case 'snippet_liked':
        return (
          <span>
            Liked <span className="font-medium text-white">"{data.snippet.title}"</span>
            {data.snippet.author && (
              <span> by <span className="text-cyan-400">@{data.snippet.author}</span></span>
            )}
          </span>
        );
      case 'comment_added':
        return (
          <span>
            Commented on <span className="font-medium text-white">"{data.snippet.title}"</span>
            {data.comment && (
              <div className="mt-2 p-2 bg-slate-800/50 rounded text-sm italic">
                "{data.comment}"
              </div>
            )}
          </span>
        );
      case 'snippet_forked':
        return (
          <span>
            Forked <span className="font-medium text-white">"{data.snippet.title}"</span>
            {data.snippet.author && (
              <span> by <span className="text-cyan-400">@{data.snippet.author}</span></span>
            )}
          </span>
        );
      case 'user_followed':
        return (
          <span>
            Started following <span className="text-cyan-400">@{data.user.username}</span>
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'snippets') return ['snippet_created', 'snippet_forked'].includes(activity.type);
    if (filter === 'likes') return activity.type === 'snippet_liked';
    if (filter === 'comments') return activity.type === 'comment_added';
    if (filter === 'follows') return activity.type === 'user_followed';
    return true;
  });

  if (loading) {
    return <Loading type="skeleton" count={5} />;
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">
          {isOwnProfile ? 'My Activity' : 'Activity'}
        </h2>

        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Activity</option>
            <option value="snippets">Snippets</option>
            <option value="likes">Likes</option>
            <option value="comments">Comments</option>
            <option value="follows">Follows</option>
          </select>
        </div>
      </div>

      {/* Activity Feed */}
      {filteredActivities.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
            <p className="text-slate-400">
              {isOwnProfile 
                ? 'Your activity will appear here as you interact with the platform.'
                : 'This user hasn\'t been active recently.'
              }
            </p>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content className="p-0">
            <div className="divide-y divide-slate-700">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start space-x-3">
                    {/* Activity Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-300">
                        {getActivityText(activity)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-500">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Load More Button */}
      {filteredActivities.length > 0 && (
        <div className="text-center">
          <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Load more activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileActivity;
