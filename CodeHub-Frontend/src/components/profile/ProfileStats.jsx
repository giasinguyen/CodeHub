import React from 'react';
import { Code2, Eye, Star, GitFork, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import { Card } from '../ui';

const ProfileStats = ({ user }) => {
  const stats = [
    {
      label: 'Total Snippets',
      value: user.snippetsCount || 0,
      icon: Code2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Total Views',
      value: user.totalViews || 0,
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Likes',
      value: user.totalLikes || 0,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Forks',
      value: user.totalForks || 0,
      icon: GitFork,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ];

  const achievements = [
    {
      title: 'Popular Creator',
      description: 'Snippet liked by 100+ users',
      icon: TrendingUp,
      unlocked: user.totalLikes >= 100,
      color: 'text-orange-400'
    },
    {
      title: 'Code Master',
      description: 'Created 50+ snippets',
      icon: Award,
      unlocked: user.snippetsCount >= 50,
      color: 'text-purple-400'
    },
    {
      title: 'Community Favorite',
      description: 'Total views exceed 10,000',
      icon: Target,
      unlocked: user.totalViews >= 10000,
      color: 'text-pink-400'
    },
    {
      title: 'Veteran',
      description: 'Member for 1+ year',
      icon: Calendar,
      unlocked: new Date() - new Date(user.createdAt) > 365 * 24 * 60 * 60 * 1000,
      color: 'text-indigo-400'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Statistics */}
      <Card className="lg:col-span-2">
        <Card.Header>
          <h3 className="text-lg font-semibold text-white">Statistics</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-sm text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Chart Placeholder */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Activity Overview</h4>
            <div className="h-24 flex items-end space-x-1">
              {Array.from({ length: 52 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${
                    Math.random() > 0.7 
                      ? 'bg-cyan-500' 
                      : Math.random() > 0.4 
                        ? 'bg-cyan-600/60' 
                        : 'bg-slate-700'
                  }`}
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Activity over the last year
            </p>
          </div>
        </Card.Content>
      </Card>

      {/* Achievements */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
        </Card.Header>
        <Card.Content className="space-y-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                  achievement.unlocked
                    ? 'bg-slate-800/50 border border-slate-600'
                    : 'bg-slate-800/20 border border-slate-700/50 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-slate-700' : 'bg-slate-800'
                }`}>
                  <Icon className={`w-4 h-4 ${achievement.unlocked ? achievement.color : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                    {achievement.title}
                  </div>
                  <div className={`text-sm ${achievement.unlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                    Unlocked
                  </div>
                )}
              </div>
            );
          })}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ProfileStats;
