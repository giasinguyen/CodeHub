import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Flame, Zap, Star, 
  ArrowRight, ChevronRight, BarChart3 
} from 'lucide-react';
import { Card } from '../ui';

const TrendingSkills = ({ skills, loading }) => {
  const [timeframe, setTimeframe] = useState('week');

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' }
  ];

  // Mock trending skills data
  const mockSkills = skills || [
    {
      name: 'TypeScript',
      growth: '+23%',
      trend: 'up',
      developers: 1243,
      projects: 567,
      hotness: 'hot',
      category: 'Language'
    },
    {
      name: 'Next.js',
      growth: '+18%',
      trend: 'up',
      developers: 892,
      projects: 423,
      hotness: 'trending',
      category: 'Framework'
    },
    {
      name: 'Tailwind CSS',
      growth: '+15%',
      trend: 'up',
      developers: 1567,
      projects: 789,
      hotness: 'hot',
      category: 'CSS Framework'
    },
    {
      name: 'Docker',
      growth: '+12%',
      trend: 'up',
      developers: 743,
      projects: 234,
      hotness: 'stable',
      category: 'DevOps'
    },
    {
      name: 'GraphQL',
      growth: '+9%',
      trend: 'up',
      developers: 456,
      projects: 189,
      hotness: 'trending',
      category: 'API'
    },
    {
      name: 'Rust',
      growth: '+8%',
      trend: 'up',
      developers: 234,
      projects: 87,
      hotness: 'trending',
      category: 'Language'
    },
    {
      name: 'Svelte',
      growth: '+6%',
      trend: 'up',
      developers: 167,
      projects: 45,
      hotness: 'emerging',
      category: 'Framework'
    },
    {
      name: 'Prisma',
      growth: '+4%',
      trend: 'up',
      developers: 345,
      projects: 123,
      hotness: 'stable',
      category: 'Database'
    }
  ];

  const getHotnessIcon = (hotness) => {
    switch (hotness) {
      case 'hot': return <Flame className="w-4 h-4 text-red-500" />;
      case 'trending': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'emerging': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const getHotnessColor = (hotness) => {
    switch (hotness) {
      case 'hot': return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'trending': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'emerging': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      default: return 'from-blue-500/20 to-indigo-500/20 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50">
        <Card.Content className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-20"></div>
                </div>
                <div className="h-4 bg-slate-700 rounded w-12"></div>
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
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-600/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Trending Skills</h3>
              <p className="text-slate-400 text-sm">Most in-demand technologies</p>
            </div>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-1 mb-6 bg-slate-700/30 p-1 rounded-lg">
          {timeframes.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-2 rounded-md font-medium text-sm transition-all ${
                timeframe === tf.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Top 3 Skills - Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {mockSkills.slice(0, 3).map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border bg-gradient-to-br ${getHotnessColor(skill.hotness)} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getHotnessIcon(skill.hotness)}
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    #{index + 1}
                  </span>
                </div>
                <div className="text-green-400 font-bold text-lg">
                  {skill.growth}
                </div>
              </div>
              
              <h4 className="text-white font-semibold text-lg mb-1">{skill.name}</h4>
              <p className="text-slate-400 text-sm mb-3">{skill.category}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-white font-medium">{skill.developers}</div>
                  <div className="text-slate-400">Developers</div>
                </div>
                <div>
                  <div className="text-white font-medium">{skill.projects}</div>
                  <div className="text-slate-400">Projects</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Remaining Skills - List */}
        <div className="space-y-2">
          {mockSkills.slice(3).map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 3) * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-medium w-6">#{index + 4}</span>
                  {getHotnessIcon(skill.hotness)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">
                      {skill.category}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm">
                    {skill.developers} developers • {skill.projects} projects
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-green-400 font-semibold">
                  {skill.growth}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <BarChart3 className="w-4 h-4" />
              <span>Updated hourly based on project activity</span>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View Skill Analytics
            </button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default TrendingSkills;
