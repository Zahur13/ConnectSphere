import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import notificationService from "../services/api/notificationService";

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();

      // Listen for new notifications
      const handleNewNotification = (event) => {
        if (event.detail.toUserId === user.id) {
          loadNotifications();
          // Play notification sound (optional)
          playNotificationSound();
        }
      };

      window.addEventListener("newNotification", handleNewNotification);

      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);

      return () => {
        window.removeEventListener("newNotification", handleNewNotification);
        clearInterval(interval);
      };
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userNotifications = notificationService.getEnrichedNotifications(
        user.id
      );
      setNotifications(userNotifications);

      const unread = userNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    notificationService.markAsRead(notificationId);
    await loadNotifications();
  };

  const markAllAsRead = async () => {
    if (!user) return;
    notificationService.markAllAsRead(user.id);
    await loadNotifications();
  };

  const deleteNotification = async (notificationId) => {
    notificationService.deleteNotification(notificationId);
    await loadNotifications();
  };

  const clearAll = async () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      notificationService.clearAllNotifications(user.id);
      await loadNotifications();
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
