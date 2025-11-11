import { useState } from "react";
import { Search, MessageSquarePlus, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import NewChatModal from "./NewChatModal";

const ChatList = ({ onSelectChat }) => {
  const { chats, activeChat, setActiveChat, unreadCount } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  const filteredChats = chats.filter(
    (chat) =>
      chat.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    if (onSelectChat) {
      onSelectChat(chat);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            title="New message"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 pr-3 pl-9 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto flex-1">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquarePlus className="mx-auto mb-3 w-12 h-12 text-gray-300" />
            <p className="text-gray-500">No messages yet</p>
            <button
              onClick={() => setShowNewChat(true)}
              className="mt-3 font-medium text-primary-600 hover:text-primary-700"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`w-full p-4 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${
                activeChat?.id === chat.id
                  ? "bg-primary-50 border-l-4 border-primary-500"
                  : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={chat.otherUser?.profilePicture}
                  alt={chat.otherUser?.name}
                  className="object-cover w-12 h-12 rounded-full"
                />
                {chat.otherUser?.isOnline && (
                  <Circle className="absolute right-0 bottom-0 w-3 h-3 text-green-500 fill-current" />
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {chat.otherUser?.name}
                  </p>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(
                        new Date(chat.lastMessage.createdAt),
                        {
                          addSuffix: false,
                        }
                      )}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p
                    className={`text-sm truncate ${
                      chat.unreadCount > 0
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {chat.lastMessage ? (
                      <>
                        {chat.lastMessage.senderId === user?.id && "You: "}
                        {chat.lastMessage.content}
                      </>
                    ) : (
                      "Start a conversation"
                    )}
                  </p>

                  {chat.unreadCount > 0 && (
                    <span className="flex justify-center items-center w-5 h-5 text-xs text-white rounded-full bg-primary-600">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onStartChat={(chat) => {
            setShowNewChat(false);
            handleChatSelect(chat);
          }}
        />
      )}
    </div>
  );
};

export default ChatList;
