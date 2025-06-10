import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, Loading } from '../ui';
import ActivityItem from './ActivityItem';
import ActivityStats from './ActivityStats';
import { activityAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProfileActivity = ({ userId, isOwnProfile }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, snippets, likes, comments, profile
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true);
        setActivities([]);
        setCurrentPage(0);
        
        let response;
        if (isOwnProfile || !userId) {
          response = await activityAPI.getCurrentUserActivities(filter, 0, 20);
        } else {
          response = await activityAPI.getUserActivities(userId, filter, 0, 20);
        }
        
        if (response.data) {
          const newActivities = response.data.content || [];
          setActivities(newActivities);
          setCurrentPage(0);
          setTotalPages(response.data.totalPages || 0);
          setHasMore(!response.data.last);
        }
      } catch (error) {
        console.error('❌ [ProfileActivity] Error loading activities:', error);
        setError(error.message);
        setActivities([]);
        toast.error('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, [userId, filter, isOwnProfile]);

  const loadActivity = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setActivities([]);
        setCurrentPage(0);
      }
      
      const page = loadMore ? currentPage + 1 : 0;
      
      let response;
      if (isOwnProfile || !userId) {
        response = await activityAPI.getCurrentUserActivities(filter, page, 20);
      } else {
        response = await activityAPI.getUserActivities(userId, filter, page, 20);
      }
      
      if (response.data) {
        const newActivities = response.data.content || [];
        
        if (loadMore) {
          setActivities(prev => [...prev, ...newActivities]);
          setCurrentPage(page);
        } else {
          setActivities(newActivities);
          setCurrentPage(0);
        }
        
        setTotalPages(response.data.totalPages || 0);
        setHasMore(!response.data.last);
      }
    } catch (error) {
      console.error('❌ [ProfileActivity] Error loading activities:', error);
      setError(error.message);
      if (!loadMore) {
        setActivities([]);
      }
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };
  const loadMoreActivities = () => {
    if (!loading && hasMore) {
      loadActivity(true);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'snippets') return ['SNIPPET_CREATED', 'SNIPPET_UPDATED'].includes(activity.type);
    if (filter === 'likes') return ['SNIPPET_LIKED', 'SNIPPET_UNLIKED'].includes(activity.type);
    if (filter === 'comments') return activity.type === 'COMMENT_ADDED';
    if (filter === 'profile') return activity.type === 'PROFILE_UPDATED';
    return true;
  });

  if (loading) {
    return <Loading type="skeleton" count={5} />;
  }
  return (
    <div className="space-y-6">
      {/* Activity Stats */}
      {!loading && activities.length > 0 && (
        <ActivityStats activities={activities} isOwnProfile={isOwnProfile} />
      )}

      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">
          {isOwnProfile ? 'My Activity' : 'Activity'}
        </h2>

        <div className="flex items-center space-x-2">          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Activity</option>
            <option value="snippets">Snippets</option>
            <option value="likes">Likes</option>
            <option value="comments">Comments</option>
            <option value="profile">Profile Updates</option>
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
          <Card.Content className="p-0">            <div className="divide-y divide-slate-700">
              {filteredActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </Card.Content>
        </Card>
      )}      {/* Load More Button */}
      {filteredActivities.length > 0 && hasMore && (
        <div className="text-center">
          <button 
            onClick={loadMoreActivities}
            disabled={loading}
            className="text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-slate-500"
          >
            {loading ? 'Loading...' : 'Load more activity'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileActivity;
