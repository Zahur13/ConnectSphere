import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import chatService from "../services/api/chatService";

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadChats();
      updateOnlineStatus();

      // Set up real-time listeners
      const handleNewMessage = (event) => {
        if (
          event.detail.receiverId === user.id ||
          event.detail.chatId === activeChat?.id
        ) {
          loadChats();
          if (activeChat && event.detail.chatId === activeChat.id) {
            loadMessages(activeChat.id);
          }
          playMessageSound();
        }
      };

      const handleTypingStatus = (event) => {
        if (event.detail.userId !== user.id) {
          setTypingUsers((prev) => ({
            ...prev,
            [event.detail.chatId]: event.detail.isTyping
              ? event.detail.userId
              : null,
          }));
        }
      };

      window.addEventListener("newMessage", handleNewMessage);
      window.addEventListener("typingStatus", handleTypingStatus);

      // Update online status every minute
      const interval = setInterval(() => {
        updateOnlineStatus();
      }, 60000);

      return () => {
        window.removeEventListener("newMessage", handleNewMessage);
        window.removeEventListener("typingStatus", handleTypingStatus);
        clearInterval(interval);
      };
    }
  }, [user, activeChat]);

  const updateOnlineStatus = () => {
    if (user) {
      chatService.updateLastActive(user.id);
    }
  };

  const loadChats = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userChats = chatService.getUserChats(user.id);
      setChats(userChats);

      // Calculate total unread
      const total = userChats.reduce(
        (sum, chat) => sum + (chat.unreadCount || 0),
        0
      );
      setUnreadCount(total);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const chatMessages = chatService.getChatMessages(chatId);
      setMessages(chatMessages);

      // Mark messages as read
      if (user) {
        chatService.markMessagesAsRead(chatId, user.id);
        loadChats(); // Reload to update unread counts
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const startChat = async (userId) => {
    if (!user) return null;

    try {
      const chat = chatService.getOrCreateChat(user.id, userId);
      await loadChats();
      return chat;
    } catch (error) {
      console.error("Error starting chat:", error);
      throw error;
    }
  };

  const sendMessage = async (chatId, content, type = "text") => {
    if (!user) return;

    try {
      const message = chatService.sendMessage(chatId, content, type);
      await loadMessages(chatId);
      await loadChats();
      return message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const deleteMessage = async (messageId) => {
    if (!user) return;

    try {
      await chatService.deleteMessage(messageId, user.id);
      if (activeChat) {
        await loadMessages(activeChat.id);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  const setTyping = (chatId, isTyping) => {
    if (!user) return;

    chatService.setTypingStatus(chatId, user.id, isTyping);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop typing after 2 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        chatService.setTypingStatus(chatId, user.id, false);
      }, 2000);
    }
  };

  const playMessageSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    );
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const value = {
    chats,
    activeChat,
    setActiveChat,
    messages,
    unreadCount,
    typingUsers,
    isLoading,
    loadChats,
    loadMessages,
    startChat,
    sendMessage,
    deleteMessage,
    setTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
