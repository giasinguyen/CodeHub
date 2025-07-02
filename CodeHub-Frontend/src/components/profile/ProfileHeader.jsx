import React, { useState, useEffect } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Edit3,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, FollowButton } from "../ui";
import { formatDate } from "../../utils/dateUtils";
import { uploadAPI, authAPI, usersAPI } from "../../services/api";
import { toast } from "react-hot-toast";
import EditProfileModal from "./EditProfileModal";
import rateLimiter from "../../utils/rateLimiter";
import ChatButton from "../chat/ChatButton";

const ProfileHeader = ({
  user,
  isOwnProfile,
  onUserUpdate,
  setUser,
  initialIsFollowing,
  followStatusLoaded = false,
  onFollowStateChange,
  onOpenFollowModal,
}) => {
  const [followersCount, setFollowersCount] = useState(
    user?.followersCount || 0
  );
  const [followingCount, setFollowingCount] = useState(
    user?.followingCount || 0
  );
  const [snippetsCount, setSnippetsCount] = useState(user?.snippetsCount || 0);
  const [isUploading, setIsUploading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      // Check rate limit
      if (!rateLimiter.isAllowed("user-stats", user?.id)) {
        console.warn("Rate limit exceeded for user stats");
        // Use fallback values from user object
        setFollowersCount(user?.followersCount || 0);
        setFollowingCount(user?.followingCount || 0);
        setSnippetsCount(user?.snippetsCount || 0);
        return;
      }

      try {
        setStatsLoading(true);
        let response;

        if (isOwnProfile) {
          response = await usersAPI.getCurrentUserStats();
        } else {
          response = await usersAPI.getUserStats(user.id);
        }

        const stats = response.data;
        setFollowersCount(stats.followersCount || 0);
        setFollowingCount(stats.followingCount || 0);
        setSnippetsCount(stats.snippetsCount || 0);
      } catch (error) {
        console.error("Failed to load user stats:", error);
        // Use fallback values from user object
        setFollowersCount(user?.followersCount || 0);
        setFollowingCount(user?.followingCount || 0);
        setSnippetsCount(user?.snippetsCount || 0);

        // Don't show error toast for rate limiting
        if (error.response?.status !== 429) {
          console.warn("Failed to load user stats:", error.message);
        }
      } finally {
        setStatsLoading(false);
      }
    };

    if (user?.id) {
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(loadUserStats, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [
    user?.id,
    isOwnProfile,
    user?.followersCount,
    user?.followingCount,
    user?.snippetsCount,
  ]);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  // Handle follow state change from FollowButton
  const handleFollowChange = (isFollowing, newFollowerCount) => {
    console.log(
      "ProfileHeader: Follow state changed:",
      isFollowing,
      "new count:",
      newFollowerCount
    );
    setFollowersCount(newFollowerCount);

    // Also notify parent Profile component
    if (onFollowStateChange) {
      onFollowStateChange(isFollowing, newFollowerCount);
    }
  };
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("Image size must be less than 10MB");
        return;
      }

      setIsUploading(true);

      // Upload to Cloudinary
      const response = await uploadAPI.uploadAvatar(file);
      const imageUrl = response.data.imageUrl;

      // Update user profile
      await authAPI.updateProfile({ avatarUrl: imageUrl });

      // Update local state
      setUser((prev) => ({ ...prev, avatarUrl: imageUrl }));

      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Validate file
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("Image size must be less than 10MB");
        return;
      }

      setIsUploading(true);

      // Upload to Cloudinary
      const response = await uploadAPI.uploadCoverPhoto(file);
      const imageUrl = response.data.imageUrl;

      // Update user profile
      await authAPI.updateProfile({ coverPhotoUrl: imageUrl });

      // Update local state
      setUser((prev) => ({ ...prev, coverPhotoUrl: imageUrl }));

      toast.success("Cover photo updated successfully!");
    } catch (error) {
      console.error("Failed to upload cover photo:", error);
      toast.error("Failed to upload cover photo");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <Card className="mb-6 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 relative overflow-hidden">
        {user.coverPhotoUrl ? (
          <img
            src={user.coverPhotoUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
        )}

        {isOwnProfile && (
          <label className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/30 transition-colors cursor-pointer">
            <Camera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <div className="px-6 pb-6">
        {/* Avatar and Basic Info - Improved Layout */}
        <div className="relative">
          {/* Avatar Section */}
          <div className="flex justify-center sm:justify-start -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-700 overflow-hidden shadow-2xl">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                    <span className="text-2xl font-bold text-white">
                      {user.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer transition-colors disabled:opacity-50 shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* User Info Section - Improved */}
          <div className="space-y-4">
            {/* Name and Username */}
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                      {user.fullName || user.username}
                    </h1>
                    {user.isVerified && (
                      <div className="inline-flex bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        ✓ Verified
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-slate-400 font-medium">@{user.username}</p>
                </div>

                {/* Action Buttons - Moved to top right */}
                <div className="flex items-center justify-center sm:justify-end space-x-3">
                  {isOwnProfile ? (
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-slate-800/50 border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
                      onClick={handleEditProfile}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Button>
                  ) : (
                    <>
                      <FollowButton
                        userId={user.id}
                        username={user.username}
                        initialIsFollowing={initialIsFollowing}
                        followStatusLoaded={followStatusLoaded}
                        onFollowChange={handleFollowChange}
                        size="md"
                        variant="primary"
                      />

                      <ChatButton
                        recipientId={user.id}
                        recipientUsername={user.username}
                        recipientName={user.fullName || user.username}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section - Improved */}
            {user.bio && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-200 leading-relaxed text-center sm:text-left">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Meta Info - Improved */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm">
              {user.location && (
                <div className="flex items-center space-x-2 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">{user.location}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Joined {formatDate(user.createdAt)}</span>
              </div>

              {user.email && isOwnProfile && (
                <div className="flex items-center space-x-2 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-700/50">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300">{user.email}</span>
                </div>
              )}
            </div>

            {/* Social Links - Improved */}
            {(user.githubUrl || user.twitterUrl || user.linkedinUrl) && (
              <div className="flex justify-center sm:justify-start items-center space-x-4">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
                    title="GitHub Profile"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}

                {user.twitterUrl && (
                  <a
                    href={user.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                    title="Twitter Profile"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}

                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:border-blue-600 hover:bg-blue-600/10 transition-all"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Followers/Following Stats - Improved */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <div className="flex items-center justify-center sm:justify-start space-x-8">
            <button
              onClick={() => onOpenFollowModal && onOpenFollowModal("followers")}
              className="text-center hover:bg-slate-800/30 rounded-xl p-4 transition-all group border border-transparent hover:border-slate-600"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {statsLoading ? "..." : followersCount.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                Followers
              </div>
            </button>
            
            <button
              onClick={() => onOpenFollowModal && onOpenFollowModal("following")}
              className="text-center hover:bg-slate-800/30 rounded-xl p-4 transition-all group border border-transparent hover:border-slate-600"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {statsLoading ? "..." : followingCount.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                Following
              </div>
            </button>
            
            <Link to={"/my-snippets"} className="block">
              <div className="text-center hover:bg-slate-800/30 rounded-xl p-4 transition-all group border border-transparent hover:border-slate-600">
                <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {statsLoading ? "..." : snippetsCount.toLocaleString()}
                </div>
                <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                  Snippets
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
    </Card>
  );
};

export default ProfileHeader;
