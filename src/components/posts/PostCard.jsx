import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import postService from "../../services/api/postService";
import CommentSection from "./CommentSection";

const PostCard = ({ post: initialPost, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    // Initialize state based on post data
    const postLikes = post.likes || [];
    setLiked(user ? postLikes.includes(user.id) : false);
    setLikesCount(postLikes.length);
    setCommentsCount(post.commentsCount || 0);
  }, [post, user]);

  const isOwner = user?.id === post.userId;

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    try {
      await postService.toggleLike(post.id);
      setLiked(!liked);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

      // Update the post's likes array
      const updatedLikes = liked
        ? post.likes.filter((id) => id !== user.id)
        : [...(post.likes || []), user.id];

      setPost({ ...post, likes: updatedLikes });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post.id);
        if (onDelete) onDelete(post.id);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
    setShowMenu(false);
  };

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
    if (onUpdate) onUpdate();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest(".menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  if (!post.user) {
    return null; // Don't render if user data is missing
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md animate-fade-in">
      {/* Post Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <Link
          to={`/profile/${post.user.username}`}
          className="flex items-center space-x-3 transition-opacity hover:opacity-80"
        >
          <img
            src={post.user.profilePicture}
            alt={post.user.name}
            className="object-cover w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">{post.user.name}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="relative menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full transition-colors hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[150px]">
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 w-full text-left text-red-600 hover:bg-gray-50"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="bg-gray-100">
          <img
            src={post.image}
            alt="Post content"
            className="object-cover w-full max-h-96"
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500">
        <span>
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </span>
        <span>
          {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex justify-around items-center">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              liked
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span>Like</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center px-4 py-2 space-x-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.commentsData || []}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
};

export default PostCard;
