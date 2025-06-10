import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Star, Trophy, TrendingUp, Activity } from 'lucide-react';
import { Card } from '../ui';

const CommunityStats = ({ stats }) => {
  if (!stats) return null;

  const {
    totalDevelopers = 0,
    activeDevelopers = 0,
    totalContributions = 0,
    averageReputation = 0,
    topCountries = [],
    topSkills = [],
    growthRate = 0
  } = stats;

  const statItems = [
    {
      icon: Users,
      label: 'Total Developers',
      value: totalDevelopers.toLocaleString(),
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      icon: Activity,
      label: 'Active This Month',
      value: activeDevelopers.toLocaleString(),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Code,
      label: 'Total Contributions',
      value: totalContributions.toLocaleString(),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Star,
      label: 'Average Reputation',
      value: Math.round(averageReputation).toLocaleString(),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-slate-600">
        <Card.Content className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Community Overview</h2>
              <p className="text-slate-400">Connect with our growing developer community</p>
            </div>
            {growthRate > 0 && (
              <div className="flex items-center space-x-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+{growthRate}% this month</span>
              </div>
            )}
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statItems.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl ${stat.bgColor} border border-slate-600/50`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Top Countries and Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Countries */}
            {topCountries.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  🌍 Top Countries
                </h4>
                <div className="space-y-2">
                  {topCountries.slice(0, 5).map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{country.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                            style={{ width: `${(country.count / topCountries[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-white font-medium w-8 text-right">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Skills */}
            {topSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  🚀 Popular Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topSkills.slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-300 rounded-full text-sm border border-slate-600"
                    >
                      {skill.name} ({skill.count})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default CommunityStats;
