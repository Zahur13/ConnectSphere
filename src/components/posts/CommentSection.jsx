import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import postService from "../../services/api/postService";

const CommentSection = ({
  postId,
  comments: initialComments,
  onCommentAdded,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await postService.addComment(postId, newComment.trim());
      const enrichedComment = {
        ...comment,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          profilePicture: user.profilePicture,
        },
      };

      setComments([enrichedComment, ...comments]);
      setNewComment("");
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100">
        <div className="flex space-x-3">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="object-cover w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="px-3 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="overflow-y-auto max-h-96">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No comments yet</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex space-x-3">
                  <Link to={`/profile/${comment.user?.username}`}>
                    <img
                      src={comment.user?.profilePicture}
                      alt={comment.user?.name}
                      className="object-cover w-8 h-8 rounded-full"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="px-3 py-2 bg-gray-100 rounded-lg">
                      <Link
                        to={`/profile/${comment.user?.username}`}
                        className="text-sm font-semibold text-gray-900 hover:underline"
                      >
                        {comment.user?.name}
                      </Link>
                      <p className="mt-1 text-gray-800">{comment.content}</p>
                    </div>
                    <p className="px-3 mt-1 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
