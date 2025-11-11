import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/api/userService";
import EditProfileModal from "./EditProfileModal";

const ProfileHeader = ({ profile: initialProfile, onProfileUpdate }) => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isOwnProfile = user?.id === profile?.id;

  useEffect(() => {
    if (user && profile) {
      // Check if current user is following this profile
      const following = userService.isFollowing(profile.id);
      setIsFollowing(following);
      setFollowersCount(profile.followersCount || 0);
    }
  }, [user, profile]);

  const handleFollowToggle = async () => {
    if (!user) {
      alert("Please login to follow users");
      return;
    }

    try {
      const followed = await userService.toggleFollow(profile.id);
      setIsFollowing(followed);
      setFollowersCount((prev) => (followed ? prev + 1 : prev - 1));

      // Get updated user data
      const updatedCurrentUser = userService.getUserById(user.id);
      updateUser(updatedCurrentUser);

      // Update profile data
      const updatedProfile = userService.getUserById(profile.id);
      setProfile(updatedProfile);

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.message || "Failed to follow/unfollow user");
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const updatedProfile = await userService.updateProfile(
        profile.id,
        updatedData
      );

      // Update local state
      const enrichedProfile = userService.getUserById(profile.id);
      setProfile(enrichedProfile);

      // Update auth context if it's the current user
      if (isOwnProfile) {
        updateUser(updatedProfile);
      }

      if (onProfileUpdate) {
        onProfileUpdate(enrichedProfile);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600">
          {profile.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col -mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              {/* Profile Picture */}
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="object-cover w-32 h-32 bg-white rounded-full border-4 border-white"
              />

              {/* Name and Username */}
              <div className="mt-4 sm:mt-0 sm:pb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-500">@{profile.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 sm:pb-4">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-secondary"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFollowing
                      ? "text-gray-800 bg-gray-200 hover:bg-gray-300"
                      : "text-white bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && <p className="mt-4 text-gray-700">{profile.bio}</p>}

          {/* Stats */}
          <div className="flex items-center pt-6 mt-6 space-x-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.postsCount || 0}
              </p>
              <p className="text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {followersCount}
              </p>
              <p className="text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.followingCount || 0}
              </p>
              <p className="text-gray-500">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default ProfileHeader;
