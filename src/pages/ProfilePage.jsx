import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import userService from "../services/api/userService";
import postService from "../services/api/postService";
import ProfileHeader from "../components/profile/ProfileHeader";
import PostCard from "../components/posts/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading profile for username:", username);

      // Try to get user data
      const userData = await userService.getUserByUsername(username);

      if (!userData) {
        // If user not found, show error
        setError(`User "@${username}" not found`);
        setProfile(null);
        setPosts([]);
      } else {
        // User found, load their data
        setProfile(userData);

        // Load user's posts
        const userPosts = await postService.getUserPosts(userData.id);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile({
      ...profile,
      ...updatedProfile,
    });
  };

  const handlePostUpdate = () => {
    loadProfile(); // Reload the entire profile to get updated data
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Error state - User not found
  if (error || !profile) {
    return (
      <div className="flex justify-center items-center px-4 min-h-screen bg-gray-50">
        <div className="w-full max-w-md">
          <div className="p-8 text-center bg-white rounded-lg shadow-md">
            <div className="mb-4">
              <AlertCircle className="mx-auto w-16 h-16 text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              {error || "User not found"}
            </h2>
            <p className="mb-6 text-gray-500">
              The user you're looking for doesn't exist or may have been
              removed.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="flex justify-center items-center px-4 py-2 space-x-2 w-full text-gray-800 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 w-full text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate("/discover")}
                className="px-4 py-2 w-full rounded-lg border transition-colors border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                Discover People
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Profile found
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {profile.id === currentUser?.id ? "Your Posts" : "Posts"}
          </h2>

          {posts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <p className="text-gray-500">
                {profile.id === currentUser?.id
                  ? "You haven't posted anything yet. Create your first post!"
                  : `${profile.name} hasn't posted anything yet.`}
              </p>
              {profile.id === currentUser?.id && (
                <button
                  onClick={() => navigate("/")}
                  className="inline-block mt-4 btn-primary"
                >
                  Create Post
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
