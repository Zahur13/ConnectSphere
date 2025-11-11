import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import postService from "../services/api/postService";
import CreatePostForm from "../components/posts/CreatePostForm";
import PostCard from "../components/posts/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import userService from "../services/api/userService";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    loadPosts();
    loadSuggestedUsers();
  }, [user]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const feedPosts = await postService.getFeedPosts(user.id);
      setPosts(feedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedUsers = () => {
    try {
      const allUsers = userService.getAllUsers();
      const suggestions = allUsers
        .filter((u) => u.id !== user?.id && !user?.following?.includes(u.id))
        .slice(0, 5);
      setSuggestedUsers(suggestions);
    } catch (error) {
      console.error("Error loading suggested users:", error);
    }
  };

  const handlePostCreated = (newPost) => {
    const enrichedPost = postService.enrichPosts([newPost])[0];
    setPosts([enrichedPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handlePostUpdated = () => {
    loadPosts();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="space-y-6 lg:col-span-2">
          {/* Create Post */}
          <div className="mb-6">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <div className="mb-4">
                <TrendingUp className="mx-auto w-16 h-16 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Welcome to ConnectSphere!
              </h3>
              <p className="mb-4 text-gray-500">
                Follow some users to see their posts in your feed.
              </p>
              <Link
                to="/discover" // Changed from /explore to /discover
                className="inline-block btn-primary"
              >
                Discover People
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdated}
              />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Users */}
          {suggestedUsers.length > 0 && (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Users className="mr-2 w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">
                  Suggested for You
                </h3>
              </div>
              <div className="space-y-3">
                {suggestedUsers.map((suggestedUser) => (
                  <Link
                    key={suggestedUser.id}
                    to={`/profile/${suggestedUser.username}`}
                    className="flex items-center p-2 space-x-3 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <img
                      src={suggestedUser.profilePicture}
                      alt={suggestedUser.name}
                      className="object-cover w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {suggestedUser.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{suggestedUser.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 font-semibold text-gray-900">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Posts</span>
                <span className="font-semibold">
                  {posts.filter((p) => p.userId === user?.id).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Following</span>
                <span className="font-semibold">
                  {user?.following?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Followers</span>
                <span className="font-semibold">
                  {user?.followers?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
