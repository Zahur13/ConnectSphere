import db from "../storage/db";
import authService from "../auth/authService";
import userService from "./userService";
import { Message, Chat } from "../../models/Chat";

class ChatService {
  constructor() {
    this.initChats();
    this.initTypingStatus();
  }

  initChats() {
    if (!localStorage.getItem("chats")) {
      localStorage.setItem("chats", JSON.stringify([]));
    }
    if (!localStorage.getItem("messages")) {
      localStorage.setItem("messages", JSON.stringify([]));
    }
  }

  initTypingStatus() {
    if (!localStorage.getItem("typingStatus")) {
      localStorage.setItem("typingStatus", JSON.stringify({}));
    }
  }

  // Get all chats
  getAllChats() {
    const data = localStorage.getItem("chats");
    return data ? JSON.parse(data) : [];
  }

  // Get all messages
  getAllMessages() {
    const data = localStorage.getItem("messages");
    return data ? JSON.parse(data) : [];
  }

  // Check if users can chat (must be following each other or user follows target)
  canChat(userId1, userId2) {
    const user1 = db.getById("users", userId1);
    const user2 = db.getById("users", userId2);

    if (!user1 || !user2) return false;

    // Check if user1 follows user2 or they follow each other
    const user1FollowsUser2 = user1.following?.includes(userId2) || false;
    const user2FollowsUser1 = user2.following?.includes(userId1) || false;

    return user1FollowsUser2; // Only need to follow to initiate chat
  }

  // Get or create chat between two users
  getOrCreateChat(userId1, userId2) {
    if (!this.canChat(userId1, userId2)) {
      throw new Error("You can only chat with users you follow");
    }

    const chats = this.getAllChats();

    // Check if chat already exists
    const existingChat = chats.find(
      (chat) =>
        chat.participants.includes(userId1) &&
        chat.participants.includes(userId2)
    );

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const newChat = new Chat({
      participants: [userId1, userId2],
      unreadCount: { [userId1]: 0, [userId2]: 0 },
    });

    chats.push(newChat);
    localStorage.setItem("chats", JSON.stringify(chats));

    return newChat;
  }

  // Get user's chats
  getUserChats(userId) {
    const chats = this.getAllChats();
    const userChats = chats.filter((chat) =>
      chat.participants.includes(userId)
    );

    // Enrich with user data and last message
    return userChats
      .map((chat) => {
        const otherUserId = chat.participants.find((id) => id !== userId);
        const otherUser = db.getById("users", otherUserId);
        const messages = this.getChatMessages(chat.id);
        const lastMessage = messages[messages.length - 1];

        return {
          ...chat,
          otherUser: otherUser
            ? {
                id: otherUser.id,
                name: otherUser.name,
                username: otherUser.username,
                profilePicture: otherUser.profilePicture,
                isOnline: this.isUserOnline(otherUser.id),
              }
            : null,
          lastMessage: lastMessage || null,
          unreadCount: chat.unreadCount?.[userId] || 0,
        };
      })
      .sort((a, b) => {
        // Sort by last message time
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
      });
  }

  // Get messages for a chat
  getChatMessages(chatId) {
    const messages = this.getAllMessages();
    return messages
      .filter((msg) => msg.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // Send message
  sendMessage(chatId, content, type = "text") {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const chats = this.getAllChats();
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) throw new Error("Chat not found");

    const otherUserId = chat.participants.find((id) => id !== currentUser.id);

    const message = new Message({
      chatId,
      senderId: currentUser.id,
      receiverId: otherUserId,
      content,
      type,
    });

    // Save message
    const messages = this.getAllMessages();
    messages.push(message);
    localStorage.setItem("messages", JSON.stringify(messages));

    // Update chat's last message and unread count
    const chatIndex = chats.findIndex((c) => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].lastMessage = message;
      chats[chatIndex].lastMessageTime = message.createdAt;
      chats[chatIndex].updatedAt = new Date().toISOString();

      // Increment unread count for receiver
      if (!chats[chatIndex].unreadCount) {
        chats[chatIndex].unreadCount = {};
      }
      chats[chatIndex].unreadCount[otherUserId] =
        (chats[chatIndex].unreadCount[otherUserId] || 0) + 1;

      localStorage.setItem("chats", JSON.stringify(chats));
    }

    // Trigger real-time update
    window.dispatchEvent(
      new CustomEvent("newMessage", {
        detail: { message, chatId, receiverId: otherUserId },
      })
    );

    return message;
  }

  // Mark messages as read
  markMessagesAsRead(chatId, userId) {
    const messages = this.getAllMessages();
    const chats = this.getAllChats();

    // Mark all messages in this chat as read for this user
    let updated = false;
    messages.forEach((msg) => {
      if (msg.chatId === chatId && msg.receiverId === userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }

    // Reset unread count for this user in this chat
    const chatIndex = chats.findIndex((c) => c.id === chatId);
    if (chatIndex !== -1) {
      if (!chats[chatIndex].unreadCount) {
        chats[chatIndex].unreadCount = {};
      }
      chats[chatIndex].unreadCount[userId] = 0;
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }

  // Delete message
  deleteMessage(messageId, userId) {
    const messages = this.getAllMessages();
    const message = messages.find((m) => m.id === messageId);

    if (!message || message.senderId !== userId) {
      throw new Error("Cannot delete this message");
    }

    const filteredMessages = messages.filter((m) => m.id !== messageId);
    localStorage.setItem("messages", JSON.stringify(filteredMessages));

    return true;
  }

  // Get unread message count for user
  getUnreadCount(userId) {
    const chats = this.getUserChats(userId);
    return chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }

  // Set typing status
  setTypingStatus(chatId, userId, isTyping) {
    const typingStatus = JSON.parse(
      localStorage.getItem("typingStatus") || "{}"
    );

    if (!typingStatus[chatId]) {
      typingStatus[chatId] = {};
    }

    if (isTyping) {
      typingStatus[chatId][userId] = Date.now();
    } else {
      delete typingStatus[chatId][userId];
    }

    localStorage.setItem("typingStatus", JSON.stringify(typingStatus));

    // Trigger typing event
    window.dispatchEvent(
      new CustomEvent("typingStatus", {
        detail: { chatId, userId, isTyping },
      })
    );
  }

  // Get typing status for a chat
  getTypingStatus(chatId, excludeUserId) {
    const typingStatus = JSON.parse(
      localStorage.getItem("typingStatus") || "{}"
    );

    if (!typingStatus[chatId]) return null;

    // Clean up old typing statuses (older than 3 seconds)
    const now = Date.now();
    Object.keys(typingStatus[chatId]).forEach((userId) => {
      if (now - typingStatus[chatId][userId] > 3000) {
        delete typingStatus[chatId][userId];
      }
    });

    // Get users currently typing (excluding current user)
    const typingUsers = Object.keys(typingStatus[chatId]).filter(
      (userId) => userId !== excludeUserId
    );

    if (typingUsers.length === 0) return null;

    // Get user details
    const users = typingUsers.map((userId) => {
      const user = db.getById("users", userId);
      return user ? user.name : "Someone";
    });

    return users;
  }

  // Check if user is online (active in last 5 minutes)
  isUserOnline(userId) {
    const lastActive = localStorage.getItem(`lastActive_${userId}`);
    if (!lastActive) return false;

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return parseInt(lastActive) > fiveMinutesAgo;
  }

  // Update user's last active time
  updateLastActive(userId) {
    localStorage.setItem(`lastActive_${userId}`, Date.now().toString());
  }

  // Get available users to chat (users you follow)
  getAvailableUsers(currentUserId) {
    const currentUser = db.getById("users", currentUserId);
    if (!currentUser || !currentUser.following) return [];

    return currentUser.following
      .map((userId) => {
        const user = db.getById("users", userId);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          isOnline: this.isUserOnline(user.id),
          isMutual: user.following?.includes(currentUserId) || false,
        };
      })
      .filter(Boolean);
  }
}

export default new ChatService();
