import db from "../storage/db";
import authService from "../auth/authService";
import Notification from "../../models/Notification";

class NotificationService {
  constructor() {
    this.initNotifications();
  }

  initNotifications() {
    if (!localStorage.getItem("notifications")) {
      localStorage.setItem("notifications", JSON.stringify([]));
    }
  }

  createNotification(data) {
    const notification = new Notification(data);
    const notifications = this.getAllNotifications();
    notifications.push(notification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Trigger custom event for real-time updates
    window.dispatchEvent(
      new CustomEvent("newNotification", { detail: notification })
    );

    return notification;
  }

  getAllNotifications() {
    const data = localStorage.getItem("notifications");
    return data ? JSON.parse(data) : [];
  }

  getUserNotifications(userId) {
    const notifications = this.getAllNotifications();
    return notifications
      .filter((n) => n.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getUnreadCount(userId) {
    const notifications = this.getUserNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  }

  markAsRead(notificationId) {
    const notifications = this.getAllNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);

    if (index !== -1) {
      notifications[index].read = true;
      localStorage.setItem("notifications", JSON.stringify(notifications));
      return notifications[index];
    }
    return null;
  }

  markAllAsRead(userId) {
    const notifications = this.getAllNotifications();
    const updated = notifications.map((n) => {
      if (n.toUserId === userId && !n.read) {
        n.read = true;
      }
      return n;
    });
    localStorage.setItem("notifications", JSON.stringify(updated));
  }

  deleteNotification(notificationId) {
    const notifications = this.getAllNotifications();
    const filtered = notifications.filter((n) => n.id !== notificationId);
    localStorage.setItem("notifications", JSON.stringify(filtered));
  }

  clearAllNotifications(userId) {
    const notifications = this.getAllNotifications();
    const filtered = notifications.filter((n) => n.toUserId !== userId);
    localStorage.setItem("notifications", JSON.stringify(filtered));
  }

  // Notification creators
  notifyFollow(fromUserId, toUserId) {
    if (fromUserId === toUserId) return; // Don't notify self

    const fromUser = db.getById("users", fromUserId);
    if (!fromUser) return;

    this.createNotification({
      type: "follow",
      fromUserId,
      toUserId,
      message: `${fromUser.name} started following you`,
    });
  }

  notifyLike(fromUserId, postId) {
    const post = db.getById("posts", postId);
    if (!post || post.userId === fromUserId) return; // Don't notify self

    const fromUser = db.getById("users", fromUserId);
    if (!fromUser) return;

    this.createNotification({
      type: "like",
      fromUserId,
      toUserId: post.userId,
      postId,
      message: `${fromUser.name} liked your post`,
    });
  }

  notifyComment(fromUserId, postId, commentId) {
    const post = db.getById("posts", postId);
    if (!post || post.userId === fromUserId) return; // Don't notify self

    const fromUser = db.getById("users", fromUserId);
    if (!fromUser) return;

    this.createNotification({
      type: "comment",
      fromUserId,
      toUserId: post.userId,
      postId,
      commentId,
      message: `${fromUser.name} commented on your post`,
    });
  }

  notifyNewPost(fromUserId) {
    const fromUser = db.getById("users", fromUserId);
    if (!fromUser) return;

    // Notify all followers
    fromUser.followers.forEach((followerId) => {
      this.createNotification({
        type: "post",
        fromUserId,
        toUserId: followerId,
        message: `${fromUser.name} shared a new post`,
      });
    });
  }

  // Get enriched notifications with user data
  getEnrichedNotifications(userId) {
    const notifications = this.getUserNotifications(userId);

    return notifications.map((notification) => {
      const fromUser = db.getById("users", notification.fromUserId);
      const post = notification.postId
        ? db.getById("posts", notification.postId)
        : null;

      return {
        ...notification,
        fromUser: fromUser
          ? {
              id: fromUser.id,
              name: fromUser.name,
              username: fromUser.username,
              profilePicture: fromUser.profilePicture,
            }
          : null,
        post: post
          ? {
              id: post.id,
              content:
                post.content.substring(0, 50) +
                (post.content.length > 50 ? "..." : ""),
            }
          : null,
      };
    });
  }
}

export default new NotificationService();
