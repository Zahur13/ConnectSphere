import db from "../storage/db";
import authService from "../auth/authService";
import notificationService from "./notificationService";

class UserService {
  getAllUsers() {
    return db.getAll("users").map((user) => authService.sanitizeUser(user));
  }

  getUserByUsername(username) {
    if (!username) return null;

    // Get all users from localStorage
    const users = db.getAll("users");

    // Find user by username (case-insensitive)
    const user = users.find(
      (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      console.error("User not found with username:", username);
      return null;
    }

    return this.enrichUserData(authService.sanitizeUser(user));
  }

  getUserById(userId) {
    if (!userId) return null;

    const user = db.getById("users", userId);
    if (!user) {
      console.error("User not found with id:", userId);
      return null;
    }

    return this.enrichUserData(authService.sanitizeUser(user));
  }

  enrichUserData(user) {
    if (!user) return null;

    const posts = db.filter("posts", (p) => p.userId === user.id);

    // Ensure arrays exist
    if (!user.followers) user.followers = [];
    if (!user.following) user.following = [];

    return {
      ...user,
      postsCount: posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  }

  updateProfile(userId, updates) {
    const allowedUpdates = ["name", "bio", "profilePicture", "coverImage"];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const updatedUser = db.update("users", userId, filteredUpdates);
    if (updatedUser) {
      // Update the current user in auth service
      const sanitizedUser = authService.sanitizeUser(updatedUser);
      localStorage.setItem("current_user", JSON.stringify(sanitizedUser));
    }
    return authService.sanitizeUser(updatedUser);
  }

  toggleFollow(targetUserId) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    if (currentUser.id === targetUserId) {
      throw new Error("Cannot follow yourself");
    }

    const targetUser = db.getById("users", targetUserId);
    if (!targetUser) throw new Error("User not found");

    const currentUserData = db.getById("users", currentUser.id);

    if (!currentUserData.following) currentUserData.following = [];
    if (!targetUser.followers) targetUser.followers = [];

    const following = [...currentUserData.following];
    const followers = [...targetUser.followers];

    const followIndex = following.indexOf(targetUserId);
    const followerIndex = followers.indexOf(currentUser.id);

    if (followIndex === -1) {
      // Follow
      following.push(targetUserId);
      followers.push(currentUser.id);

      // Send notification for follow
      notificationService.notifyFollow(currentUser.id, targetUserId);
    } else {
      // Unfollow
      following.splice(followIndex, 1);
      followers.splice(followerIndex, 1);
    }

    const updatedCurrentUser = db.update("users", currentUser.id, {
      following,
    });
    const updatedTargetUser = db.update("users", targetUserId, { followers });

    const sanitizedUser = authService.sanitizeUser(updatedCurrentUser);
    localStorage.setItem("current_user", JSON.stringify(sanitizedUser));

    return followIndex === -1;
  }

  isFollowing(targetUserId) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return false;

    // Get fresh data from DB
    const userData = db.getById("users", currentUser.id);
    if (!userData || !userData.following) return false;

    return userData.following.includes(targetUserId);
  }

  searchUsers(query) {
    if (!query || !query.trim()) return [];

    const users = db.getAll("users");
    const currentUser = authService.getCurrentUser();
    const searchTerm = query.toLowerCase().trim();

    return users
      .filter((user) => {
        // Don't show current user in search results
        if (currentUser && user.id === currentUser.id) return false;

        // Search by name or username
        return (
          (user.username && user.username.toLowerCase().includes(searchTerm)) ||
          (user.name && user.name.toLowerCase().includes(searchTerm)) ||
          (user.email && user.email.toLowerCase().includes(searchTerm))
        );
      })
      .map((user) => authService.sanitizeUser(user))
      .slice(0, 10); // Limit to 10 results
  }
}

export default new UserService();
