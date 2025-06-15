import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usersAPI, authAPI } from "../services/api";
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
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("snippets");

  const isOwnProfile = !userId || userId === currentUser?.id?.toString();
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (isOwnProfile) {
          // Load current user's profile
          response = await authAPI.getCurrentUser();
        } else {
          // Validate that userId is numeric
          const numericUserId = parseInt(userId);
          if (isNaN(numericUserId)) {
            setError(
              "Invalid user ID. User profiles must be accessed by numeric ID."
            );
            return;
          }

          // Load specific user's profile
          response = await usersAPI.getUserById(numericUserId);
        }

        setUser(response.data);
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
    };

    if (currentUser || userId) {
      loadUserProfile();
    }
  }, [userId, currentUser, isOwnProfile]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
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
