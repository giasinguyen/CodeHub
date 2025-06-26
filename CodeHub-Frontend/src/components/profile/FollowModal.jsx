import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Users } from 'lucide-react';
import { Button, Avatar } from '../ui';
import { userFollowAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FollowModal = ({ 
  isOpen, 
  onClose, 
  userId, 
  initialTab = 'followers', // 'followers' or 'following'
  title = 'Followers'
}) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followingUsers, setFollowingUsers] = useState(new Set()); // Track who current user follows

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      loadFollowData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTab, userId]);

  const loadFollowData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load both followers and following
      const [followersResponse, followingResponse] = await Promise.all([
        userFollowAPI.getUserFollowers(userId, 0, 50),
        userFollowAPI.getUserFollowing(userId, 0, 50)
      ]);

      setFollowers(followersResponse.data.content || []);
      setFollowing(followingResponse.data.content || []);

      // If current user is authenticated, check which users they follow
      if (isAuthenticated && currentUser) {
        const allUsers = [
          ...(followersResponse.data.content || []),
          ...(followingResponse.data.content || [])
        ];
        const uniqueUserIds = [...new Set(allUsers.map(user => user.id))];
        
        // Check follow status for each user
        const followStatuses = await Promise.all(
          uniqueUserIds.map(async (id) => {
            if (id === currentUser.id) return { id, isFollowing: false };
            try {
              const response = await userFollowAPI.getFollowStatus(id);
              return { 
                id, 
                isFollowing: response.data.isFollowing || response.data.following || false 
              };
            } catch {
              return { id, isFollowing: false };
            }
          })
        );

        const followingSet = new Set(
          followStatuses
            .filter(status => status.isFollowing)
            .map(status => status.id)
        );
        setFollowingUsers(followingSet);
      }
    } catch (error) {
      console.error('Failed to load follow data:', error);
      toast.error('Failed to load follow data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow users');
      return;
    }

    try {
      await userFollowAPI.toggleFollow(targetUserId);
      
      // Update local state
      setFollowingUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(targetUserId)) {
          newSet.delete(targetUserId);
          toast.success('User unfollowed');
        } else {
          newSet.add(targetUserId);
          toast.success('User followed');
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleUserClick = (username) => {
    navigate(`/users/${username}`);
    onClose();
  };

  const renderUser = (user) => (
    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-700/50 rounded-lg transition-colors">
      <div 
        className="flex items-center space-x-3 flex-1 cursor-pointer min-w-0"
        onClick={() => handleUserClick(user.username)}
      >
        <Avatar
          src={user.avatarUrl}
          alt={user.username}
          fallback={user.username?.charAt(0)?.toUpperCase() || 'U'}
          size="md"
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate text-sm sm:text-base">
            {user.fullName || user.username}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm truncate">@{user.username}</p>
          {user.bio && (
            <p className="text-slate-300 text-xs mt-1 line-clamp-2 hidden sm:block">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Follow Button */}
      {isAuthenticated && currentUser?.id !== user.id && (
        <Button
          size="sm"
          variant={followingUsers.has(user.id) ? 'secondary' : 'primary'}
          onClick={() => handleFollowToggle(user.id)}
          className={`ml-3 flex-shrink-0 text-xs sm:text-sm ${followingUsers.has(user.id) ? 'hover:bg-red-500 hover:text-white' : ''}`}
        >
          {followingUsers.has(user.id) ? (
            <>
              <UserMinus className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Unfollow</span>
              <span className="sm:hidden">Unfollow</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Follow</span>
              <span className="sm:hidden">Follow</span>
            </>
          )}
        </Button>
      )}
    </div>
  );

  if (!isOpen) return null;

  const currentList = activeTab === 'followers' ? followers : following;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-xl w-full max-w-md max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 flex-shrink-0">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'followers'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'following'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Following ({following.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
              <span className="ml-2 text-slate-400">Loading...</span>
            </div>
          ) : currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Users className="w-12 h-12 mb-3" />
              <p className="text-center px-4">
                {activeTab === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'
                }
              </p>
            </div>
          ) : (
            <div 
              className="h-full overflow-y-auto scrollbar-thin" 
              style={{ 
                maxHeight: 'calc(95vh - 180px)',
                scrollBehavior: 'smooth'
              }}
            >
              <div className="p-2 space-y-1">
                {currentList.map(renderUser)}
              </div>
              {/* Fade effect at bottom */}
              <div className="h-4 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
