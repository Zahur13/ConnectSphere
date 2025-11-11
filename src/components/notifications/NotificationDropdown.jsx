import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      case "post":
        return "📝";
      default:
        return "🔔";
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "follow":
        return `/profile/${notification.fromUser?.username}`;
      case "like":
      case "comment":
        return `/post/${notification.postId}`;
      case "post":
        return `/profile/${notification.fromUser?.username}`;
      default:
        return "#";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 bg-white rounded-lg border border-gray-200 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto mb-3 w-12 h-12 text-gray-300" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-primary-50 bg-opacity-30" : ""
                    }`}
                  >
                    <Link
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        handleNotificationClick(notification);
                        setIsOpen(false);
                      }}
                      className="block px-4 py-3"
                    >
                      <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="relative">
                          <img
                            src={notification.fromUser?.profilePicture}
                            alt={notification.fromUser?.name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                          <span className="absolute -right-1 -bottom-1 text-sm">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">
                              {notification.fromUser?.name}
                            </span>{" "}
                            {notification.type === "like" && "liked your post"}
                            {notification.type === "comment" &&
                              "commented on your post"}
                            {notification.type === "follow" &&
                              "started following you"}
                            {notification.type === "post" &&
                              "shared a new post"}
                          </p>

                          {notification.post && (
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              "{notification.post.content}"
                            </p>
                          )}

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>

                        {/* Actions */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 rounded transition-colors hover:bg-gray-200"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </Link>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary-500"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm text-center border-t border-gray-200 text-primary-600 hover:text-primary-700 hover:bg-gray-50"
            >
              See all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
