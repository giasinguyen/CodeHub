import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Users } from 'lucide-react';
import { Button } from '../ui';
import { userFollowAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import rateLimiter from '../../utils/rateLimiter';

const FollowButton = ({ 
  userId, 
  username,
  initialIsFollowing = false,
  onFollowChange,
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [followStats, setFollowStats] = useState({
    followerCount: 0,
    followingCount: 0  });
  
  // Load follow status on mount and when userId changes
  useEffect(() => {
    const loadFollowStatus = async () => {
      if (!isAuthenticated || !userId || currentUser?.id === userId) {
        setLoading(false);
        return;
      }
      
      // Check rate limit
      if (!rateLimiter.isAllowed('follow-status', userId)) {
        console.warn('Rate limit exceeded for follow status check');
        setIsFollowing(initialIsFollowing);
        setLoading(false);
        return;
      }
      
      try {
        const response = await userFollowAPI.getFollowStatus(userId);
        setIsFollowing(response.data.isFollowing);
        setFollowStats({
          followerCount: response.data.followerCount,
          followingCount: response.data.followingCount
        });
      } catch (error) {
        console.error('Error loading follow status:', error);
        // Fallback to initial state if API call fails
        setIsFollowing(initialIsFollowing);
        
        // Don't show error toast for rate limiting - it's too noisy
        if (error.response?.status !== 429) {
          console.warn('Failed to load follow status:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(loadFollowStatus, 100);
    
    return () => clearTimeout(timeoutId);
  }, [userId, isAuthenticated, currentUser?.id, initialIsFollowing]);

  // Don't show follow button for current user or when not authenticated
  if (!isAuthenticated || currentUser?.id === userId) {
    return null;
  }

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      await userFollowAPI.toggleFollow(userId);
      const newIsFollowing = !isFollowing;
      
      setIsFollowing(newIsFollowing);
      
      // Update follower count optimistically
      setFollowStats(prev => ({
        ...prev,
        followerCount: prev.followerCount + (newIsFollowing ? 1 : -1)
      }));

      // Show success message
      const message = newIsFollowing 
        ? `You are now following ${username}` 
        : `You unfollowed ${username}`;
      toast.success(message);

      // Notify parent component
      if (onFollowChange) {
        onFollowChange(newIsFollowing, followStats.followerCount + (newIsFollowing ? 1 : -1));
      }

    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={loading}
      size={size}
      variant={isFollowing ? 'secondary' : variant}
      className={`${className} ${isFollowing ? 'hover:bg-red-500 hover:text-white' : ''}`}
    >
      {loading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
