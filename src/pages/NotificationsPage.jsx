import { useState, useEffect } from "react";
import { Bell, Trash2, CheckCheck, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();
  const [filter, setFilter] = useState("all"); // all, unread, like, comment, follow, post
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter]);

  const filterNotifications = () => {
    let filtered = [...notifications];

    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter !== "all") {
      filtered = filtered.filter((n) => n.type === filter);
    }

    setFilteredNotifications(filtered);
  };

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

  const filters = [
    { value: "all", label: "All" },
    { value: "unread", label: "Unread" },
    { value: "like", label: "Likes", icon: "❤️" },
    { value: "comment", label: "Comments", icon: "💬" },
    { value: "follow", label: "Follows", icon: "👤" },
    { value: "post", label: "Posts", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary-100">
                <Bell className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-500">Stay updated with your activity</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 space-x-2 text-sm text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center px-4 py-2 space-x-2 text-sm text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto items-center pb-2 space-x-2">
            <Filter className="flex-shrink-0 w-4 h-4 text-gray-500" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === f.value
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.icon && <span className="mr-1">{f.icon}</span>}
                {f.label}
                {f.value === "unread" &&
                  notifications.filter((n) => !n.read).length > 0 && (
                    <span className="ml-1">
                      ({notifications.filter((n) => !n.read).length})
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg shadow-md">
              <Bell className="mx-auto mb-4 w-16 h-16 text-gray-300" />
              <p className="text-lg text-gray-500">No notifications to show</p>
              <p className="mt-2 text-sm text-gray-400">
                {filter !== "all"
                  ? "Try changing the filter"
                  : "Check back later for updates"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all ${
                  !notification.read
                    ? "ring-2 ring-primary-500 ring-opacity-30"
                    : ""
                }`}
              >
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => handleNotificationClick(notification)}
                  className="block p-6"
                >
                  <div className="flex items-start space-x-4">
                    {/* Avatar with icon */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={notification.fromUser?.profilePicture}
                        alt={notification.fromUser?.name}
                        className="object-cover w-12 h-12 rounded-full"
                      />
                      <span className="absolute -right-1 -bottom-1 p-1 text-lg bg-white rounded-full shadow-md">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-900">
                            <span className="font-semibold">
                              {notification.fromUser?.name}
                            </span>{" "}
                            <span className="text-gray-600">
                              {notification.type === "like" &&
                                "liked your post"}
                              {notification.type === "comment" &&
                                "commented on your post"}
                              {notification.type === "follow" &&
                                "started following you"}
                              {notification.type === "post" &&
                                "shared a new post"}
                            </span>
                          </p>

                          {notification.post && (
                            <p className="p-3 mt-2 text-gray-500 bg-gray-50 rounded-lg">
                              "{notification.post.content}"
                            </p>
                          )}

                          <div className="flex items-center mt-3 space-x-4">
                            <p className="text-sm text-gray-400">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </p>

                            {!notification.read && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
