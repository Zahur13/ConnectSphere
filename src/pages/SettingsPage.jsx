import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Lock,
  Mail,
  Trash2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const SettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // In a real app, this would delete the user from the database
      alert("Account deletion is disabled in demo mode");
    }
  };

  const settingSections = [
    {
      title: "Account",
      icon: User,
      items: [
        {
          label: "Edit Profile",
          icon: User,
          onClick: () => navigate(`/profile/${user?.username}`),
        },
        {
          label: "Change Password",
          icon: Lock,
          onClick: () => alert("Password change feature coming soon!"),
        },
        {
          label: "Email Settings",
          icon: Mail,
          onClick: () => alert("Email settings coming soon!"),
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        {
          label: "Privacy Settings",
          icon: Shield,
          onClick: () => alert("Privacy settings coming soon!"),
        },
        {
          label: "Blocked Users",
          icon: Shield,
          onClick: () => alert("Blocked users management coming soon!"),
        },
      ],
    },
    {
      title: "Preferences",
      icon: Palette,
      items: [
        {
          label: "Dark Mode",
          icon: darkMode ? Sun : Moon,
          toggle: true,
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-6 mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="px-4 py-6 mx-auto max-w-4xl">
        <div className="grid gap-6">
          {/* User Info Card */}
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="object-cover w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-500">@{user?.username}</p>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          {settingSections.map((section, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white rounded-lg shadow-sm"
            >
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center space-x-2">
                  <section.icon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
              </div>

              <div className="divide-y">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`px-6 py-4 ${
                      item.onClick ? "hover:bg-gray-50 cursor-pointer" : ""
                    } transition-colors`}
                    onClick={item.onClick}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700">{item.label}</span>
                      </div>

                      {item.toggle ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onChange();
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? "bg-primary-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notifications Section */}
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({ ...prev, [key]: !value }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Support</h3>
              </div>
            </div>

            <div className="divide-y">
              <button className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors hover:bg-gray-50">
                <span className="text-gray-700">Help Center</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors hover:bg-gray-50">
                <span className="text-gray-700">Terms of Service</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors hover:bg-gray-50">
                <span className="text-gray-700">Privacy Policy</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="flex justify-between items-center px-6 py-4 w-full text-left transition-colors hover:bg-gray-50">
                <span className="text-gray-700">About</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="overflow-hidden bg-white rounded-lg border-2 border-red-100 shadow-sm">
            <div className="px-6 py-4 bg-red-50">
              <h3 className="font-semibold text-red-900">Danger Zone</h3>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={handleLogout}
                className="flex justify-center items-center px-4 py-2 space-x-2 w-full text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              <button
                onClick={handleDeleteAccount}
                className="flex justify-center items-center px-4 py-2 space-x-2 w-full text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
