import { useState, useRef, useEffect } from "react";
import {
  Send,
  MoreVertical,
  Circle,
  Smile,
  Image,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import EmojiPicker from "./EmojiPicker";

const ChatWindow = ({ chat, onBack }) => {
  const { user } = useAuth();
  const { messages, sendMessage, setTyping, deleteMessage, loadMessages } =
    useChat();
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (chat) {
      loadMessages(chat.id);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!newMessage.trim() || !chat) return;

    try {
      await sendMessage(chat.id, newMessage.trim());
      setNewMessage("");
      setTyping(chat.id, false);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      setTyping(chat.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(chat.id, false);
    }, 1000);
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Delete this message?")) {
      try {
        await deleteMessage(messageId);
        setSelectedMessage(null);
      } catch (error) {
        alert("Cannot delete this message");
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  if (!chat) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-gray-200 rounded-full">
            <Send className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Your Messages
          </h3>
          <p className="text-gray-500">Send private messages to your friends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Link
            to={`/profile/${chat.otherUser?.username}`}
            className="flex items-center space-x-3 transition-opacity hover:opacity-80"
          >
            <div className="relative">
              <img
                src={chat.otherUser?.profilePicture}
                alt={chat.otherUser?.name}
                className="object-cover w-10 h-10 rounded-full"
              />
              {chat.otherUser?.isOnline && (
                <Circle className="absolute right-0 bottom-0 w-3 h-3 text-green-500 fill-current" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {chat.otherUser?.name}
              </p>
              <p className="text-xs text-gray-500">
                {chat.otherUser?.isOnline ? "Active now" : "Offline"}
              </p>
            </div>
          </Link>
        </div>

        <button className="p-2 rounded-lg transition-colors hover:bg-gray-100">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  isSender ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`relative group ${
                    isSender
                      ? "text-white bg-primary-600"
                      : "text-gray-900 bg-gray-100"
                  } rounded-2xl px-4 py-2`}
                  onClick={() =>
                    setSelectedMessage(
                      message.id === selectedMessage ? null : message.id
                    )
                  }
                >
                  <p className="break-words">{message.content}</p>

                  {selectedMessage === message.id && (
                    <div className="absolute top-0 right-0 ml-2 transform translate-x-full">
                      <div className="p-1 bg-white rounded-lg border border-gray-200 shadow-lg">
                        {isSender && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-1 rounded transition-colors hover:bg-gray-100"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  {formatDistanceToNow(new Date(message.createdAt), {
                    addSuffix: true,
                  })}
                  {isSender && message.read && " • Read"}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <Image className="w-5 h-5 text-gray-500" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>

            {showEmojis && (
              <div className="absolute left-0 bottom-full mb-2">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`p-2 rounded-lg transition-colors ${
              newMessage.trim()
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
