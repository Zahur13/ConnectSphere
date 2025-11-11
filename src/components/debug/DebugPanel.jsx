// src/components/debug/DebugPanel.jsx
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { Bug, X } from "lucide-react";

const DebugPanel = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  const showData = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = JSON.parse(
      localStorage.getItem("current_user") || "{}"
    );

    console.log("=== DEBUG DATA ===");
    console.log("Current User:", currentUser);
    console.log("Auth Context User:", user);
    console.log("All Users:", users);
    console.log("Posts:", JSON.parse(localStorage.getItem("posts") || "[]"));
  };

  const fixUserData = () => {
    // Fix any users missing usernames
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const fixed = users.map((u) => {
      if (!u.username && u.email) {
        u.username = u.email.split("@")[0].toLowerCase();
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(fixed));

    // Fix current user
    const currentUser = JSON.parse(
      localStorage.getItem("current_user") || "{}"
    );
    if (currentUser.id && !currentUser.username && currentUser.email) {
      currentUser.username = currentUser.email.split("@")[0].toLowerCase();
      localStorage.setItem("current_user", JSON.stringify(currentUser));
    }

    alert("User data fixed! Please refresh the page.");
    window.location.reload();
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed right-4 bottom-4 z-50 p-3 text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
        title="Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 w-80 bg-white rounded-lg border border-gray-200 shadow-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Debug Panel</h3>
        <button onClick={() => setShow(false)}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm">
          <p>
            <strong>Username:</strong> {user?.username || "Not set"}
          </p>
          <p>
            <strong>User ID:</strong> {user?.id || "Not set"}
          </p>
          <p>
            <strong>Name:</strong> {user?.name || "Not set"}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={showData}
            className="px-3 py-2 w-full text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Log Debug Data to Console
          </button>

          <button
            onClick={fixUserData}
            className="px-3 py-2 w-full text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            Fix User Data Issues
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/register";
            }}
            className="px-3 py-2 w-full text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
