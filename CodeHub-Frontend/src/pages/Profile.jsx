import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI, authAPI, userFollowAPI } from "../services/api";
import toast from "react-hot-toast";
import { Loading } from "../components/ui";
import {
  ProfileHeader,
  ProfileStats,
  ProfileTabs,
  ProfileSnippets,
  ProfileActivity,
} from "../components/profile";

const Profile = () => {
  const { userId, username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("snippets");
  const [initialIsFollowing, setInitialIsFollowing] = useState(undefined);
  const [followStatusLoaded, setFollowStatusLoaded] = useState(false);
  
  
  // Determine if this is own profile
  const isOwnProfile = !userId && !username;

  // Debug logging
  useEffect(() => {
    console.log('Profile: State update - user:', user?.username, 'isOwnProfile:', isOwnProfile, 'initialIsFollowing:', initialIsFollowing, 'followStatusLoaded:', followStatusLoaded);
    if (followStatusLoaded && initialIsFollowing === undefined) {
      console.warn('⚠️ Profile: followStatusLoaded is true but initialIsFollowing is undefined - this should not happen!');
    }
  }, [user, initialIsFollowing, isOwnProfile, followStatusLoaded]);  useEffect(() => {
    console.log('🔄 Profile: useEffect triggered - userId:', userId, 'username:', username, 'currentUser:', currentUser?.id);
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // Reset follow status when loading new profile
        setFollowStatusLoaded(false);
        setInitialIsFollowing(undefined);

        let response;
        if (isOwnProfile) {
          // Load current user's profile
          response = await authAPI.getCurrentUser();
        } else if (username) {
          // Load user by username
          try {
            response = await usersAPI.getUserByUsername(username);
          } catch (error) {
            if (error.response?.status === 404) {
              setError(`User "@${username}" not found.`);
              return;
            }
            throw error;
          }
        } else if (userId) {
          // Load user by ID
          const numericUserId = parseInt(userId);
          if (isNaN(numericUserId)) {
            setError("Invalid user ID. User profiles must be accessed by numeric ID.");
            return;
          }
          response = await usersAPI.getUserById(numericUserId);
        } else {
          // Load current user if no parameters
          response = await authAPI.getCurrentUser();
        }

        const userData = response.data;
        setUser(userData);

        // Load initial follow status if not own profile and user is authenticated
        console.log('Profile: Checking follow status conditions:');
        console.log('  - isOwnProfile:', isOwnProfile);
        console.log('  - currentUser:', !!currentUser, currentUser?.id);
        console.log('  - userData.id:', userData.id);
        console.log('  - userData.id !== currentUser.id:', userData.id !== currentUser?.id);
        
        if (!isOwnProfile && currentUser && userData.id !== currentUser.id) {
          console.log('Profile: Loading follow status for user:', userData.id, 'current user:', currentUser.id);
          try {
            const followResponse = await userFollowAPI.getFollowStatus(userData.id);
            console.log('Profile: Initial follow status API response:', followResponse);
            console.log('Profile: Response data:', followResponse.data);
            console.log('Profile: Response data keys:', Object.keys(followResponse.data || {}));
            console.log('Profile: isFollowing value:', followResponse.data?.isFollowing, 'type:', typeof followResponse.data?.isFollowing);
            console.log('Profile: following value:', followResponse.data?.following, 'type:', typeof followResponse.data?.following);
            
            // Check if response has valid isFollowing or following field
            const followingValue = followResponse.data?.isFollowing ?? followResponse.data?.following;
            if (followResponse.data && typeof followingValue === 'boolean') {
              console.log('Profile: Setting initialIsFollowing to:', followingValue);
              setInitialIsFollowing(followingValue);
              console.log('Profile: Set followStatusLoaded to true');
              setFollowStatusLoaded(true);
            } else {
              console.error('Profile: API response missing or invalid follow field:', followResponse.data);
              console.log('Profile: Setting initialIsFollowing to false (invalid response)');
              setInitialIsFollowing(false);
              console.log('Profile: Set followStatusLoaded to true (invalid response case)');
              setFollowStatusLoaded(true);
            }
          } catch (error) {
            console.error('Profile: Failed to load initial follow status:', error);
            // Don't show error, just use default false
            console.log('Profile: Setting initialIsFollowing to false (error fallback)');
            setInitialIsFollowing(false);
            console.log('Profile: Set followStatusLoaded to true (error case)');
            setFollowStatusLoaded(true);
          }
        } else {
          // For own profile or when not authenticated, set to false
          console.log('Profile: Own profile or not authenticated, setting initialIsFollowing to false');
          console.log('  - Reason: isOwnProfile=' + isOwnProfile + ', currentUser=' + !!currentUser + ', sameUser=' + (userData.id === currentUser?.id));
          setInitialIsFollowing(false);
          console.log('Profile: Set followStatusLoaded to true (own profile case)');
          setFollowStatusLoaded(true);
        }

      } catch (error) {
        console.error("Failed to load user profile:", error);

        if (error.response?.status === 404) {
          setError("User not found.");
        } else if (error.response?.status === 400) {
          setError("Invalid user ID format.");
        } else {
          setError("Failed to load profile. Please try again.");
        }

        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };    if (currentUser || userId || username) {
      console.log('🚀 Profile: Calling loadUserProfile - currentUser:', !!currentUser, 'userId:', userId, 'username:', username);
      loadUserProfile();
    } else {
      console.log('⏭️ Profile: Skipping loadUserProfile - no user info');
    }
    // isOwnProfile is derived from userId and username, so it's included for completeness
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, username, currentUser]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

  // Handle follow state change and update initialIsFollowing for consistency
  const handleFollowStateChange = (isFollowing, newFollowerCount) => {
    console.log('Profile: Follow state changed from FollowButton:', isFollowing, 'new count:', newFollowerCount);
    console.log('Profile: Updating initialIsFollowing from', initialIsFollowing, 'to', isFollowing);
    setInitialIsFollowing(isFollowing);
  };

  if (loading) {
    return <Loading type="spinner" size="lg" text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Profile Not Found
              </h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                User Not Found
              </h2>
              <p className="text-slate-400 mb-6">
                The user you're looking for doesn't exist.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onUserUpdate={handleUserUpdate}
          setUser={setUser}
          initialIsFollowing={initialIsFollowing}
          followStatusLoaded={followStatusLoaded}
          onFollowStateChange={handleFollowStateChange}
        />
        {/* Profile Stats */}
        <ProfileStats user={user} /> {/* Profile Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />{" "}
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "snippets" && (
            <ProfileSnippets userId={user.id} isOwnProfile={isOwnProfile} />
          )}

          {activeTab === "activity" && (
            <ProfileActivity userId={user.id} isOwnProfile={isOwnProfile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
