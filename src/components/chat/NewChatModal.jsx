import { useState } from "react";
import { X, Search, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import chatService from "../../services/api/chatService";

const NewChatModal = ({ onClose, onStartChat }) => {
  const { user } = useAuth();
  const { startChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useState(() => {
    if (user) {
      const users = chatService.getAvailableUsers(user.id);
      setAvailableUsers(users);
    }
  }, [user]);

  const filteredUsers = availableUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = async (targetUser) => {
    setLoading(true);
    try {
      const chat = await startChat(targetUser.id);
      const enrichedChat = {
        ...chat,
        otherUser: targetUser,
      };
      onStartChat(enrichedChat);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold">New Message</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-colors hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 pr-3 pl-9 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto max-h-96">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="mx-auto mb-3 w-12 h-12 text-gray-300" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No users found"
                  : "Follow users to message them"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((targetUser) => (
                <button
                  key={targetUser.id}
                  onClick={() => handleStartChat(targetUser)}
                  disabled={loading}
                  className="flex items-center p-4 space-x-3 w-full transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  <img
                    src={targetUser.profilePicture}
                    alt={targetUser.name}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {targetUser.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      @{targetUser.username}
                      {targetUser.isMutual && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Follows you
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
