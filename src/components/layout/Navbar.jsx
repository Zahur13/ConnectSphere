import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  PlusSquare,
  Search,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/api/userService";
import CreatePostModal from "../posts/CreatePostModal";
import NotificationDropdown from "../notifications/NotificationDropdown";
import ChatBubble from "../chat/ChatBubble";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        const results = userService.searchUsers(searchQuery);
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSelect = (username) => {
    navigate(`/profile/${username}`);
    setSearchQuery("");
    setShowSearchResults(false);
    searchInputRef.current?.blur();
  };

  const handlePostCreated = () => {
    setShowCreatePost(false);
    // Refresh the feed if on home page
    if (window.location.pathname === "/") {
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-6xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-primary-600">
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">
                ConnectSphere
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 mx-4 max-w-md" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                {/* Clear search button */}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 top-1/2 text-gray-400 transform -translate-y-1/2 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="overflow-y-auto absolute top-full mt-2 w-full max-h-96 bg-white rounded-lg border border-gray-200 shadow-lg">
                    <div className="py-2">
                      {searchResults.map((searchUser) => (
                        <button
                          key={searchUser.id}
                          onClick={() =>
                            handleSearchSelect(searchUser.username)
                          }
                          className="flex items-center px-4 py-2 space-x-3 w-full transition-colors hover:bg-gray-50"
                        >
                          <img
                            src={searchUser.profilePicture}
                            alt={searchUser.name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">
                              {searchUser.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{searchUser.username}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results message */}
                {showSearchResults &&
                  searchQuery &&
                  searchResults.length === 0 && (
                    <div className="absolute top-full p-4 mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                      <p className="text-center text-gray-500">
                        No users found
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link
                to="/"
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                <Home className="w-6 h-6" />
              </Link>

              <button
                onClick={() => setShowCreatePost(true)}
                className="text-gray-600 transition-colors hover:text-gray-900"
              >
                <PlusSquare className="w-6 h-6" />
              </button>

              {/* Add Chat Bubble here */}
              <ChatBubble />

              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2"
                >
                  <img
                    src={user?.profilePicture}
                    alt={user?.name}
                    className="object-cover w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 py-2 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg animate-slide-up">
                    <Link
                      to={`/profile/${user?.username}`}
                      className="flex items-center px-4 py-2 transition-colors hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="mr-3 w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 transition-colors hover:bg-gray-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="mr-3 w-4 h-4" />
                      <span>Settings</span>
                    </Link>

                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 w-full text-red-600 transition-colors hover:bg-gray-50"
                    >
                      <LogOut className="mr-3 w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </>
  );
};

export default Navbar;
