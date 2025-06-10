import React from 'react';
import { Star, Award, Crown, Trophy } from 'lucide-react';

const ReputationBadge = ({ reputation, level, size = 'md' }) => {
  const getReputationLevel = (rep) => {
    if (rep >= 10000) return { level: 'Legendary', icon: Crown, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-500/20' };
    if (rep >= 5000) return { level: 'Expert', icon: Trophy, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-500/20' };
    if (rep >= 1000) return { level: 'Advanced', icon: Award, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-500/20' };
    if (rep >= 100) return { level: 'Intermediate', icon: Star, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-500/20' };
    return { level: 'Beginner', icon: Star, color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-500/20' };
  };

  const getLevelByName = (levelName) => {
    const levelMap = {
      'legendary': { level: 'Legendary', icon: Crown, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-500/20' },
      'expert': { level: 'Expert', icon: Trophy, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-500/20' },
      'advanced': { level: 'Advanced', icon: Award, color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-500/20' },
      'intermediate': { level: 'Intermediate', icon: Star, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-500/20' },
      'beginner': { level: 'Beginner', icon: Star, color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-500/20' }
    };
    return levelMap[levelName?.toLowerCase()] || levelMap['beginner'];
  };

  // Use level prop if provided, otherwise calculate from reputation
  const reputationData = level ? getLevelByName(level) : getReputationLevel(reputation || 0);
  const Icon = reputationData.icon;

  const sizeClasses = {
    'sm': 'text-xs px-1.5 py-0.5',
    'md': 'text-xs px-2 py-1',
    'lg': 'text-sm px-3 py-1.5'
  };

  const iconSizes = {
    'sm': 'w-2.5 h-2.5',
    'md': 'w-3 h-3',
    'lg': 'w-4 h-4'
  };

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full font-medium ${reputationData.bgColor} border border-opacity-30 ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
      <span className={`bg-gradient-to-r ${reputationData.color} bg-clip-text text-transparent`}>
        {reputationData.level}
      </span>      {reputation && typeof reputation === 'number' && (
        <span className="text-slate-400">({reputation.toLocaleString()})</span>
      )}
    </div>
  );
};

export default ReputationBadge;
