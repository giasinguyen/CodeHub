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
        {/* Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative">
          <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-700 overflow-hidden">
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
                <label className="absolute bottom-2 right-2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer transition-colors disabled:opacity-50">
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

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white truncate">
                  {user.fullName || user.username}
                </h1>
                {user.isVerified && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </div>
                )}
              </div>

              <p className="text-xl text-slate-400 mb-2">@{user.username}</p>

              {user.bio && (
                <p className="text-slate-300 mb-4 max-w-2xl">{user.bio}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>

                {user.email && isOwnProfile && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(user.githubUrl || user.twitterUrl || user.linkedinUrl) && (
                <div className="flex items-center space-x-3 mt-4">
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}

                  {user.twitterUrl && (
                    <a
                      href={user.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}

                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {" "}
            {isOwnProfile ? (
              <Button
                variant="outline"
                className="flex items-center space-x-2"
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

                <Button variant="ghost">Message</Button>
              </>
            )}
          </div>
        </div>{" "}
        {/* Followers/Following */}
        <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-slate-700">
          <button
            onClick={() => onOpenFollowModal && onOpenFollowModal("followers")}
            className="text-center hover:bg-slate-800/50 rounded-lg p-2 transition-colors group"
          >
            <div className="text-2xl font-bold text-white group-hover:text-cyan-400">
              {statsLoading ? "..." : followersCount}
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300">
              Followers
            </div>
          </button>
          <button
            onClick={() => onOpenFollowModal && onOpenFollowModal("following")}
            className="text-center hover:bg-slate-800/50 rounded-lg p-2 transition-colors group"
          >
            <div className="text-2xl font-bold text-white group-hover:text-cyan-400">
              {statsLoading ? "..." : followingCount}
            </div>
            <div className="text-sm text-slate-400 group-hover:text-slate-300">
              Following
            </div>
          </button>
          <Link to={"/my-snippets"}>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {statsLoading ? "..." : snippetsCount}
              </div>
              <div className="text-sm text-slate-400">Snippets</div>
            </div>{" "}
          </Link>
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
