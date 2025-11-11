import { useState } from "react";
import { useChat } from "../contexts/ChatContext";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";

const MessagesPage = () => {
  const { activeChat } = useChat();
  const [showChatWindow, setShowChatWindow] = useState(false);

  const handleSelectChat = (chat) => {
    setShowChatWindow(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-7xl h-full bg-white shadow-sm">
        <div className="flex h-full">
          {/* Chat List - Hidden on mobile when chat is open */}
          <div
            className={`${
              showChatWindow ? "hidden lg:block" : "block"
            } w-full lg:w-96 border-r border-gray-200`}
          >
            <ChatList onSelectChat={handleSelectChat} />
          </div>

          {/* Chat Window - Full width on mobile */}
          <div
            className={`${
              !showChatWindow ? "hidden lg:block" : "block"
            } flex-1`}
          >
            <ChatWindow
              chat={activeChat}
              onBack={() => setShowChatWindow(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
