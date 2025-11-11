import db from "../storage/db";
import authService from "../auth/authService";

class PostService {
  createPost(content, image = null) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const newPost = {
      userId: user.id,
      content,
      image,
      likes: [],
      comments: [],
    };

    return db.create("posts", newPost);
  }

  getAllPosts() {
    const posts = db.getAll("posts");
    return this.enrichPosts(posts).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  getUserPosts(userId) {
    const posts = db.filter("posts", (post) => post.userId === userId);
    return this.enrichPosts(posts).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  getFeedPosts(userId) {
    const user = db.getById("users", userId);
    if (!user) return [];

    const posts = db.filter(
      "posts",
      (post) => user.following.includes(post.userId) || post.userId === userId
    );

    return this.enrichPosts(posts).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  enrichPosts(posts) {
    return posts.map((post) => {
      const user = db.getById("users", post.userId);
      const comments = this.getPostComments(post.id);

      // Ensure likes array exists
      if (!post.likes) {
        post.likes = [];
      }

      return {
        ...post,
        user: user
          ? {
              id: user.id,
              username: user.username,
              name: user.name,
              profilePicture: user.profilePicture,
            }
          : null,
        commentsData: comments,
        likesCount: post.likes.length,
        commentsCount: comments.length,
      };
    });
  }

  getPostComments(postId) {
    const comments = db.filter("comments", (c) => c.postId === postId);
    return comments
      .map((comment) => {
        const user = db.getById("users", comment.userId);
        return {
          ...comment,
          user: user
            ? {
                id: user.id,
                username: user.username,
                name: user.name,
                profilePicture: user.profilePicture,
              }
            : null,
        };
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  toggleLike(postId) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const post = db.getById("posts", postId);
    if (!post) throw new Error("Post not found");

    // Ensure likes array exists
    if (!post.likes) {
      post.likes = [];
    }

    const likes = [...post.likes];
    const userIndex = likes.indexOf(user.id);

    if (userIndex === -1) {
      likes.push(user.id);
    } else {
      likes.splice(userIndex, 1);
    }

    return db.update("posts", postId, { likes });
  }

  deletePost(postId) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const post = db.getById("posts", postId);
    if (!post) throw new Error("Post not found");

    if (post.userId !== user.id) {
      throw new Error("Unauthorized to delete this post");
    }

    // Delete associated comments
    const comments = db.filter("comments", (c) => c.postId === postId);
    comments.forEach((comment) => db.delete("comments", comment.id));

    return db.delete("posts", postId);
  }

  addComment(postId, content) {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const post = db.getById("posts", postId);
    if (!post) throw new Error("Post not found");

    const comment = db.create("comments", {
      postId,
      userId: user.id,
      content,
    });

    // Update post's comment array
    if (!post.comments) {
      post.comments = [];
    }
    const updatedComments = [...post.comments, comment.id];
    db.update("posts", postId, { comments: updatedComments });

    return comment;
  }
}

export default new PostService();
