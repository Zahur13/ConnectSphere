import { MessageCircle } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import { useNavigate } from "react-router-dom";

const ChatBubble = () => {
  const { unreadCount } = useChat();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/messages")}
      className="relative p-2 text-gray-600 transition-colors hover:text-gray-900"
    >
      <MessageCircle className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatBubble;
