import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/api/userService";
import postService from "../services/api/postService";
import ProfileHeader from "../components/profile/ProfileHeader";
import PostCard from "../components/posts/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userData = await userService.getUserByUsername(username);
      if (userData) {
        setProfile(userData);
        const userPosts = await postService.getUserPosts(userData.id);
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="mb-8">
        <ProfileHeader
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>

      {/* User Posts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeleted}
              onUpdate={loadProfile}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
