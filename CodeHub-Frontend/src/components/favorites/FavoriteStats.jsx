import React from 'react';
import { Heart, TrendingUp, Eye, Star, BarChart3, Activity } from 'lucide-react';
import { Card } from '../ui';

const FavoriteStats = ({ stats }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTopLanguages = () => {
    const languages = Object.entries(stats.byLanguage || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    return languages;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Favorites */}
      <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-300 text-sm font-medium uppercase tracking-wider">
                Total Favorites
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {formatNumber(stats.totalFavorites)}
              </p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-full">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* This Week */}
      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-300 text-sm font-medium uppercase tracking-wider">
                This Week
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {formatNumber(stats.thisWeek)}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Total Views */}
      <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-300 text-sm font-medium uppercase tracking-wider">
                Total Views
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {formatNumber(stats.totalViews)}
              </p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-full">
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Total Likes */}
      <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-300 text-sm font-medium uppercase tracking-wider">
                Total Likes
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {formatNumber(stats.totalLikes)}
              </p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-full">
              <Star className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Top Languages */}
      {getTopLanguages().length > 0 && (
        <Card className="md:col-span-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-amber-300 text-sm font-medium uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Top Languages</span>
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {getTopLanguages().map(([language, count], index) => (
                <div key={language} className="text-center">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-amber-300 text-sm truncate">{language}</div>
                  <div className="text-xs text-amber-400/70">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border-indigo-500/30">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-indigo-300 text-sm font-medium uppercase tracking-wider">
                Recent Activity
              </h3>
              <p className="text-3xl font-bold text-white mt-2">
                {formatNumber(stats.recentActivity)}
              </p>
              <p className="text-indigo-400 text-xs mt-1">
                Favorites added this week
              </p>
            </div>
            <div className="bg-indigo-500/20 p-3 rounded-full">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default FavoriteStats;
