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
  initialIsFollowing,
  followStatusLoaded = false,
  onFollowChange,
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [followStats, setFollowStats] = useState({
    followerCount: 0,
    followingCount: 0  });
  
  // Debug logging
  useEffect(() => {
    console.log('FollowButton: State update - userId:', userId, 'isAuthenticated:', isAuthenticated, 'currentUser:', currentUser?.id, 'isFollowing:', isFollowing, 'loading:', loading, 'initialIsFollowing:', initialIsFollowing, 'followStatusLoaded:', followStatusLoaded);
  }, [userId, isAuthenticated, currentUser?.id, isFollowing, loading, initialIsFollowing, followStatusLoaded]);
  
  // Update isFollowing when initialIsFollowing from parent changes
  useEffect(() => {
    if (followStatusLoaded && initialIsFollowing !== undefined) {
      console.log('FollowButton: Updating isFollowing from parent:', initialIsFollowing);
      setIsFollowing(initialIsFollowing);
      setLoading(false);
    }
  }, [initialIsFollowing, followStatusLoaded]);
  
  // Load follow status on mount and when userId changes
  useEffect(() => {
    const loadFollowStatus = async () => {
      if (!isAuthenticated || !userId || currentUser?.id === userId) {
        console.log('FollowButton: Not loading status - authenticated:', isAuthenticated, 'userId:', userId, 'currentUserId:', currentUser?.id);
        setLoading(false);
        return;
      }
      
      console.log('FollowButton: Loading follow status for user:', userId, 'followStatusLoaded:', followStatusLoaded);
      
      // If we already have follow status from parent, don't call API
      if (followStatusLoaded) {
        console.log('FollowButton: Follow status already loaded by parent, skipping API call');
        return;
      }
      
      // Check rate limit
      if (!rateLimiter.isAllowed('follow-status', userId)) {
        console.warn('Rate limit exceeded for follow status check');
        setIsFollowing(false);
        setLoading(false);
        return;
      }
      
      try {
        const response = await userFollowAPI.getFollowStatus(userId);
        console.log('FollowButton: Follow status response:', response.data);
        setIsFollowing(response.data.isFollowing);
        setFollowStats({
          followerCount: response.data.followerCount,
          followingCount: response.data.followingCount
        });
      } catch (error) {
        console.error('FollowButton: Error loading follow status:', error);
        // Fallback to false if API call fails
        setIsFollowing(false);
        
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
  }, [userId, isAuthenticated, currentUser?.id, followStatusLoaded]);

  // Don't show follow button for current user
  if (currentUser?.id === userId) {
    return null;
  }
  
  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Button
        size={size}
        variant="outline"
        className={className}
        onClick={() => toast.error('Please log in to follow users')}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Follow
      </Button>
    );
  }

  const handleFollowToggle = async () => {
    console.log('FollowButton: Toggling follow for user:', userId, 'current state:', isFollowing);
    setLoading(true);
    try {
      const response = await userFollowAPI.toggleFollow(userId);
      console.log('FollowButton: Toggle response:', response);
      
      const newIsFollowing = !isFollowing;
      console.log('FollowButton: New follow state:', newIsFollowing);
      
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
      console.error('FollowButton: Error toggling follow:', error);
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
