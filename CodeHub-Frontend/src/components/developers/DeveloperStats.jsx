import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Code, GitBranch, Star, TrendingUp, Globe, 
  Clock, Award, Target, Zap, BarChart3, PieChart 
} from 'lucide-react';
import { Card } from '../ui';

const DeveloperStats = ({ developers, loading }) => {
  const [viewMode, setViewMode] = useState('overview');

  const viewModes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'locations', label: 'Locations', icon: Globe },
    { id: 'experience', label: 'Experience', icon: Award }
  ];

  // Calculate stats from developers data
  const calculateStats = () => {
    if (!developers || developers.length === 0) {
      return {
        total: 0,
        active: 0,
        newThisWeek: 0,
        totalProjects: 0,
        totalContributions: 0,
        avgRating: 0,
        topSkills: [],
        topLocations: [],
        experienceLevels: {}
      };
    }

    const stats = {
      total: developers.length,
      active: developers.filter(d => d.isActive !== false).length,
      newThisWeek: developers.filter(d => {
        const joinDate = new Date(d.joinedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return joinDate > weekAgo;
      }).length,
      totalProjects: developers.reduce((sum, d) => sum + (d.projects || 0), 0),
      totalContributions: developers.reduce((sum, d) => sum + (d.contributions || 0), 0),
      avgRating: developers.reduce((sum, d) => sum + (parseFloat(d.rating) || 4.5), 0) / developers.length
    };

    // Top skills analysis
    const skillCounts = {};
    developers.forEach(d => {
      d.skills?.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    stats.topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count, percentage: (count / developers.length * 100).toFixed(1) }));

    // Top locations analysis
    const locationCounts = {};
    developers.forEach(d => {
      if (d.location) {
        locationCounts[d.location] = (locationCounts[d.location] || 0) + 1;
      }
    });
    stats.topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([location, count]) => ({ location, count, percentage: (count / developers.length * 100).toFixed(1) }));

    // Experience levels
    const expLevels = { junior: 0, mid: 0, senior: 0, lead: 0 };
    developers.forEach(d => {
      const exp = parseInt(d.experience) || 0;
      if (exp <= 2) expLevels.junior++;
      else if (exp <= 5) expLevels.mid++;
      else if (exp <= 10) expLevels.senior++;
      else expLevels.lead++;
    });
    stats.experienceLevels = expLevels;

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Card className="bg-slate-800/50">
        <Card.Content className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded"></div>
              ))}
            </div>
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
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Developer Analytics</h3>
              <p className="text-slate-400 text-sm">Community insights and trends</p>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex space-x-1 mb-6 bg-slate-700/30 p-1 rounded-lg">
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                  viewMode === mode.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Stats */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 text-center"
              >
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Total Developers</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 text-center"
              >
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.active.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Active This Month</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 text-center"
              >
                <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.totalProjects.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Total Projects</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 text-center"
              >
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.avgRating.toFixed(1)}</div>
                <div className="text-slate-400 text-sm">Average Rating</div>
              </motion.div>
            </div>

            {/* Growth Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">New This Week</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.newThisWeek}</div>
                <div className="text-green-400 text-sm">+12% from last week</div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Total Contributions</span>
                  <GitBranch className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">{stats.totalContributions.toLocaleString()}</div>
                <div className="text-blue-400 text-sm">+8% this month</div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Avg. Response Time</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white">2.4h</div>
                <div className="text-purple-400 text-sm">-15% faster</div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Distribution */}
        {viewMode === 'skills' && (
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Top Skills Distribution</h4>
            {stats.topSkills.map((item, index) => (
              <motion.div
                key={item.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 font-medium w-6">#{index + 1}</span>
                  <span className="text-white font-medium">{item.skill}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-sm w-12">{item.count}</span>
                  <span className="text-blue-400 text-sm w-12">{item.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Locations Distribution */}
        {viewMode === 'locations' && (
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Developer Locations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.topLocations.map((item, index) => (
                <motion.div
                  key={item.location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">{item.location}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{item.count}</div>
                    <div className="text-slate-400 text-sm">{item.percentage}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Levels */}
        {viewMode === 'experience' && (
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Experience Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.experienceLevels).map(([level, count], index) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/30 rounded-xl p-4 text-center"
                >
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{count}</div>
                  <div className="text-slate-400 text-sm capitalize">{level}</div>
                  <div className="text-blue-400 text-xs">
                    {((count / stats.total) * 100).toFixed(1)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default DeveloperStats;
