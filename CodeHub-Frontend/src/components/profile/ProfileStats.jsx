import React, { useState, useEffect } from 'react';
import { Code2, Eye, Star, GitFork, TrendingUp, Award, Calendar, Target, BarChart3 } from 'lucide-react';
import { Card, Loading } from '../ui';
import { usersAPI, activityAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProfileStats = ({ user, isOwnProfile }) => {
  const [stats, setStats] = useState({
    snippetsCount: 0,
    totalViews: 0,
    totalLikes: 0,
    totalForks: 0
  });
  const [activityData, setActivityData] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        let response;
        
        if (isOwnProfile) {
          response = await usersAPI.getCurrentUserStats();
        } else {
          response = await usersAPI.getUserStats(user.id);
        }
        
        if (response.data) {
          setStats({
            snippetsCount: response.data.snippetsCount || 0,
            totalViews: response.data.totalViews || 0,
            totalLikes: response.data.totalLikes || 0,
            totalForks: response.data.totalForks || 0
          });
        }
      } catch (error) {
        console.error('Failed to load user stats:', error);
        if (error.response?.status !== 404) {
          toast.error('Failed to load statistics');
        }
        // Use fallback values from user object
        setStats({
          snippetsCount: user?.snippetsCount || 0,
          totalViews: user?.totalViews || 0,
          totalLikes: user?.totalLikes || 0,
          totalForks: user?.totalForks || 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user?.id, user?.snippetsCount, user?.totalViews, user?.totalLikes, user?.totalForks, isOwnProfile]);

  // Load activity data for the chart
  useEffect(() => {
    const loadActivityData = async () => {
      if (!user?.id) return;
      
      try {
        setActivityLoading(true);
        let response;
        
        if (isOwnProfile) {
          response = await activityAPI.getCurrentUserActivities('all', 0, 365); // Last year
        } else {
          response = await activityAPI.getUserActivities(user.id, 'all', 0, 365);
        }
        
        if (response.data && response.data.content) {
          // Process activity data for the last 52 weeks
          const activities = response.data.content;
          const weeklyData = processActivityData(activities);
          setActivityData(weeklyData);
        } else {
          // No activities, set empty data
          setActivityData(createEmptyActivityData());
        }
      } catch (error) {
        console.error('Failed to load activity data:', error);
        // Set empty data on error instead of mock data
        setActivityData(createEmptyActivityData());
        if (error.response?.status !== 404) {
          toast.error('Failed to load activity data');
        }
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivityData();
  }, [user?.id, isOwnProfile]);

  // Calculate achievements based on real stats
  useEffect(() => {
    const calculateAchievements = () => {
      const accountAge = user?.createdAt ? new Date() - new Date(user.createdAt) : 0;
      const accountAgeYears = accountAge / (365 * 24 * 60 * 60 * 1000);
      
      const newAchievements = [
        {
          title: 'First Steps',
          description: 'Created your first snippet',
          icon: Code2,
          unlocked: stats.snippetsCount >= 1,
          color: 'text-blue-400',
          progress: Math.min(stats.snippetsCount * 100, 100)
        },
        {
          title: 'Rising Star',
          description: 'Received 10+ likes',
          icon: Star,
          unlocked: stats.totalLikes >= 10,
          color: 'text-yellow-400',
          progress: Math.min((stats.totalLikes / 10) * 100, 100)
        },
        {
          title: 'Popular Creator',
          description: 'Snippet liked by 100+ users',
          icon: TrendingUp,
          unlocked: stats.totalLikes >= 100,
          color: 'text-orange-400',
          progress: Math.min((stats.totalLikes / 100) * 100, 100)
        },
        {
          title: 'Code Master',
          description: 'Created 50+ snippets',
          icon: Award,
          unlocked: stats.snippetsCount >= 50,
          color: 'text-purple-400',
          progress: Math.min((stats.snippetsCount / 50) * 100, 100)
        },
        {
          title: 'Community Favorite',
          description: 'Total views exceed 10,000',
          icon: Target,
          unlocked: stats.totalViews >= 10000,
          color: 'text-pink-400',
          progress: Math.min((stats.totalViews / 10000) * 100, 100)
        },
        {
          title: 'Veteran',
          description: 'Member for 1+ year',
          icon: Calendar,
          unlocked: accountAgeYears >= 1,
          color: 'text-indigo-400',
          progress: Math.min(accountAgeYears * 100, 100)
        }
      ];
      
      // Sort achievements: unlocked first, then by progress
      newAchievements.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        if (a.unlocked && b.unlocked) return 0;
        return b.progress - a.progress;
      });
      
      setAchievements(newAchievements);
    };

    if (user && !loading) {
      calculateAchievements();
    }
  }, [stats, user, loading]);

  const processActivityData = (activities) => {
    // Group activities by week for the last 52 weeks
    const weeks = [];
    const now = new Date();
    
    for (let i = 51; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      weeks.push({
        week: i,
        count: weekActivities.length,
        intensity: Math.min(weekActivities.length / 5, 1) // Normalize to 0-1
      });
    }
    
    return weeks;
  };

  const createEmptyActivityData = () => {
    return Array.from({ length: 52 }, (_, i) => ({
      week: i,
      count: 0,
      intensity: 0
    }));
  };

  const statItems = [
    {
      label: 'Total Snippets',
      value: stats.snippetsCount,
      icon: Code2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes,
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Total Forks',
      value: stats.totalForks,
      icon: GitFork,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loading size="sm" />
              <span className="ml-2 text-slate-400">Loading statistics...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((stat, index) => {
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

              {/* Activity Chart */}
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Activity Overview
                </h4>
                {activityLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading size="sm" />
                    <span className="ml-2 text-slate-400">Loading activity data...</span>
                  </div>
                ) : (
                  <>
                    <div className="h-24 flex items-end space-x-1">
                      {activityData.map((week, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-all hover:opacity-80 ${
                            week.intensity > 0.7 
                              ? 'bg-cyan-400' 
                              : week.intensity > 0.4 
                                ? 'bg-cyan-500' 
                                : week.intensity > 0.1
                                  ? 'bg-cyan-600/60'
                                  : 'bg-slate-700'
                          }`}
                          style={{ height: `${Math.max(week.intensity * 100, 8)}%` }}
                          title={`Week ${52 - i}: ${week.count} activities`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Activity over the last year • Total: {activityData.reduce((sum, week) => sum + week.count, 0)} activities
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Achievements */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-white">Achievements</h3>
        </Card.Header>
        <Card.Content className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loading size="sm" />
              <span className="ml-2 text-slate-400">Loading achievements...</span>
            </div>
          ) : (
            achievements.map((achievement, index) => {
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
                    {/* Progress bar for locked achievements */}
                    {!achievement.unlocked && achievement.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div 
                            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {Math.round(achievement.progress)}% complete
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">
                      Unlocked
                    </div>
                  )}
                </div>
              );
            })
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ProfileStats;
