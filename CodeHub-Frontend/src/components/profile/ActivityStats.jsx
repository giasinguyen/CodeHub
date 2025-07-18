import React from 'react';
import { Code2, Star, MessageCircle, User, TrendingUp, Heart } from 'lucide-react';
import { Card } from '../ui';

const ActivityStats = ({ activities, isOwnProfile }) => {
  const getActivityStats = () => {
    const stats = {
      snippetsCreated: 0,
      likesGiven: 0,
      favoritesAdded: 0,
      commentsAdded: 0,
      profileUpdates: 0,
      totalActivity: activities.length
    };

    activities.forEach(activity => {
      switch (activity.type) {
        case 'SNIPPET_CREATED':
        case 'SNIPPET_UPDATED':
          stats.snippetsCreated++;
          break;
        case 'SNIPPET_LIKED':
          stats.likesGiven++;
          break;
        case 'SNIPPET_FAVORITED':
          stats.favoritesAdded++;
          break;
        case 'COMMENT_ADDED':
          stats.commentsAdded++;
          break;
        case 'PROFILE_UPDATED':
          stats.profileUpdates++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const stats = getActivityStats();

  const statItems = [
    {
      label: 'Snippets',
      value: stats.snippetsCreated,
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      color: 'text-cyan-400'
    },
    {
      label: 'Likes Given',
      value: stats.likesGiven,
      icon: <Star className="w-5 h-5 text-yellow-400" />,
      color: 'text-yellow-400'
    },
    {
      label: 'Favorites',
      value: stats.favoritesAdded,
      icon: <Heart className="w-5 h-5 text-red-400" />,
      color: 'text-red-400'
    },
    {
      label: 'Comments',
      value: stats.commentsAdded,
      icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400'
    },
    {
      label: 'Profile Updates',
      value: stats.profileUpdates,
      icon: <User className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400'
    }
  ];

  return (
    <Card className="mb-6">
      <Card.Content className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {isOwnProfile ? 'Your Activity Stats' : 'Activity Stats'}
          </h3>
          <div className="flex items-center space-x-2 text-slate-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              {stats.totalActivity} total activities
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statItems.map((item, index) => (
            <div 
              key={index}
              className="text-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <div className={`text-2xl font-bold ${item.color} mb-1`}>
                {item.value}
              </div>
              <div className="text-sm text-slate-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {stats.totalActivity === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              {isOwnProfile ? 'No activity yet' : 'This user has no activity yet'}
            </div>
            <div className="text-sm text-slate-500">
              {isOwnProfile 
                ? 'Start creating snippets and interacting with the community!'
                : 'Check back later for updates.'
              }
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default ActivityStats;
