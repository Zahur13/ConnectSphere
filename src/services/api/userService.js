import db from "../storage/db";
import authService from "../auth/authService";

class UserService {
  getAllUsers() {
    return db.getAll("users").map((user) => authService.sanitizeUser(user));
  }

  getUserByUsername(username) {
    const user = db.findOne("users", (u) => u.username === username);
    if (!user) return null;
    return this.enrichUserData(authService.sanitizeUser(user));
  }

  getUserById(userId) {
    const user = db.getById("users", userId);
    if (!user) return null;
    return this.enrichUserData(authService.sanitizeUser(user));
  }

  enrichUserData(user) {
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

    // Get fresh data from DB
    const currentUserData = db.getById("users", currentUser.id);

    // Initialize arrays if they don't exist
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
    } else {
      // Unfollow
      following.splice(followIndex, 1);
      followers.splice(followerIndex, 1);
    }

    // Update both users in database
    const updatedCurrentUser = db.update("users", currentUser.id, {
      following,
    });
    const updatedTargetUser = db.update("users", targetUserId, { followers });

    // Update current user in auth service
    const sanitizedUser = authService.sanitizeUser(updatedCurrentUser);
    localStorage.setItem("current_user", JSON.stringify(sanitizedUser));

    return followIndex === -1; // Return true if followed, false if unfollowed
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
    const users = db.getAll("users");
    const searchTerm = query.toLowerCase();

    return users
      .filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm)
      )
      .map((user) => authService.sanitizeUser(user));
  }
}

export default new UserService();
