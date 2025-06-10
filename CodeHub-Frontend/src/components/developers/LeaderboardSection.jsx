import React, { useState } from 'react';
import { 
  Trophy, Medal, Award, Star, TrendingUp, Users, 
  Code, GitBranch, MessageSquare, Heart 
} from 'lucide-react';
import { Card } from '../ui';
import { ReputationBadge } from './';

const LeaderboardSection = ({ leaderboard, loading }) => {
  const [activeCategory, setActiveCategory] = useState('overall');

  const categories = [
    { id: 'overall', label: 'Overall', icon: Trophy },
    { id: 'contributions', label: 'Contributors', icon: GitBranch },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'community', label: 'Community', icon: Users }
  ];

  // Mock data for demonstration
  const mockLeaderboard = leaderboard || [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: null,
      title: 'Full Stack Engineer',
      score: 2847,
      change: '+12',
      badge: 'gold',
      stats: { projects: 45, contributions: 1203, followers: 892 }
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      avatar: null,
      title: 'DevOps Specialist',
      score: 2651,
      change: '+8',
      badge: 'silver',
      stats: { projects: 38, contributions: 987, followers: 654 }
    },
    {
      id: 3,
      name: 'Elena Kozlov',
      avatar: null,
      title: 'Frontend Developer',
      score: 2489,
      change: '+15',
      badge: 'bronze',
      stats: { projects: 52, contributions: 856, followers: 743 }
    },
    {
      id: 4,
      name: 'James Wilson',
      avatar: null,
      title: 'Backend Engineer',
      score: 2234,
      change: '-3',
      badge: null,
      stats: { projects: 29, contributions: 734, followers: 521 }
    },
    {
      id: 5,
      name: 'Aisha Patel',
      avatar: null,
      title: 'Mobile Developer',
      score: 2156,
      change: '+6',
      badge: null,
      stats: { projects: 31, contributions: 689, followers: 445 }
    }
  ];

  const getBadgeIcon = (badge, position) => {
    if (badge === 'gold' || position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (badge === 'silver' || position === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (badge === 'bronze' || position === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <Star className="w-5 h-5 text-slate-400" />;
  };

  const getBadgeColor = (badge, position) => {
    if (badge === 'gold' || position === 1) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    if (badge === 'silver' || position === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (badge === 'bronze' || position === 3) return 'from-amber-600/20 to-amber-700/20 border-amber-600/30';
    return 'from-slate-700/20 to-slate-800/20 border-slate-700/30';
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50">
        <Card.Content className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border border-slate-700/50">
      <Card.Content className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Top Contributors</h3>
              <p className="text-slate-400 text-sm">Leading developers this month</p>
            </div>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 mb-6 bg-slate-700/30 p-1 rounded-lg">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>        {/* Leaderboard List */}
        <div className="space-y-3">
          {mockLeaderboard.map((developer, index) => (
            <div
              key={developer.id}
              className={`p-4 rounded-xl border bg-gradient-to-r ${getBadgeColor(developer.badge, index + 1)} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-center space-x-4">
                {/* Position & Badge */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getBadgeIcon(developer.badge, index + 1)}
                  </div>
                  <span className="text-2xl font-bold text-slate-400 w-6">
                    #{index + 1}
                  </span>
                </div>                {/* Avatar */}
                <img
                  src={developer.avatar || developer.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name || developer.username || developer.fullName || 'User')}&background=3b82f6&color=fff&size=48`}
                  alt={developer.name || developer.username || developer.fullName || 'User'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-600"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{developer.name || developer.fullName || developer.username}</h4>
                    <ReputationBadge level="expert" size="sm" />
                  </div>
                  <p className="text-slate-400 text-sm truncate">{developer.title || developer.location || 'Developer'}</p>
                </div>{/* Stats */}
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{developer.stats?.projects || developer.snippetCount || 0}</div>
                    <div className="text-slate-400 text-xs">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{developer.stats?.contributions || developer.totalLikes || 0}</div>
                    <div className="text-slate-400 text-xs">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{developer.stats?.followers || developer.totalViews || 0}</div>
                    <div className="text-slate-400 text-xs">Followers</div>
                  </div>
                </div>                {/* Score & Change */}
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{developer.score}</div>
                  {developer.change && (
                    <div className={`text-sm font-medium flex items-center justify-end space-x-1 ${
                      developer.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${
                        developer.change.startsWith('+') ? '' : 'rotate-180'
                      }`} />
                      <span>{developer.change}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-white">1,247</div>
              <div className="text-slate-400 text-sm">Active Developers</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">15,893</div>
              <div className="text-slate-400 text-sm">Total Contributions</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">342</div>
              <div className="text-slate-400 text-sm">Projects Completed</div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default LeaderboardSection;
