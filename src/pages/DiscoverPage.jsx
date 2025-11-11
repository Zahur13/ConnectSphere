import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/api/userService";
import db from "../services/storage/db";

const DiscoverPage = () => {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    seedDummyUsers();
  }, []);

  const seedDummyUsers = () => {
    const existingUsers = db.getAll("users");

    // Add dummy users if there are less than 10 users
    if (existingUsers.length < 10) {
      const dummyUsers = [
        {
          id: `dummy_${Date.now()}_1`,
          name: "Emma Watson",
          username: "emmawatson",
          email: "emma@example.com",
          password: btoa("password123"),
          bio: "🌟 Actress | Activist | Book lover 📚",
          profilePicture: "https://i.pravatar.cc/150?img=1",
          coverImage: "https://source.unsplash.com/random/800x200?nature",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_2`,
          name: "Chris Evans",
          username: "chrisevans",
          email: "chris@example.com",
          password: btoa("password123"),
          bio: "🎬 Actor | Director | Dog dad 🐕",
          profilePicture: "https://i.pravatar.cc/150?img=2",
          coverImage: "https://source.unsplash.com/random/800x200?city",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_3`,
          name: "Zendaya Coleman",
          username: "zendaya",
          email: "zendaya@example.com",
          password: btoa("password123"),
          bio: "✨ Actress | Singer | Fashion Icon",
          profilePicture: "https://i.pravatar.cc/150?img=3",
          coverImage: "https://source.unsplash.com/random/800x200?fashion",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_4`,
          name: "Tom Holland",
          username: "tomholland",
          email: "tom@example.com",
          password: btoa("password123"),
          bio: "🕷️ Actor | Dancer | Adventure seeker",
          profilePicture: "https://i.pravatar.cc/150?img=4",
          coverImage: "https://source.unsplash.com/random/800x200?adventure",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_5`,
          name: "Ariana Grande",
          username: "arianagrande",
          email: "ariana@example.com",
          password: btoa("password123"),
          bio: "🎵 Singer | Songwriter | Vegan 🌱",
          profilePicture: "https://i.pravatar.cc/150?img=5",
          coverImage: "https://source.unsplash.com/random/800x200?music",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_6`,
          name: "Ryan Reynolds",
          username: "ryanreynolds",
          email: "ryan@example.com",
          password: btoa("password123"),
          bio: "🎭 Actor | Producer | Professional joker",
          profilePicture: "https://i.pravatar.cc/150?img=7",
          coverImage: "https://source.unsplash.com/random/800x200?comedy",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_7`,
          name: "Billie Eilish",
          username: "billieeilish",
          email: "billie@example.com",
          password: btoa("password123"),
          bio: "🎤 Singer | Songwriter | Climate activist 🌍",
          profilePicture: "https://i.pravatar.cc/150?img=9",
          coverImage: "https://source.unsplash.com/random/800x200?abstract",
          followers: [],
          following: [],
        },
        {
          id: `dummy_${Date.now()}_8`,
          name: "Michael Jordan",
          username: "mjordan",
          email: "mj@example.com",
          password: btoa("password123"),
          bio: "🏀 Basketball Legend | Entrepreneur",
          profilePicture: "https://i.pravatar.cc/150?img=11",
          coverImage: "https://source.unsplash.com/random/800x200?basketball",
          followers: [],
          following: [],
        },
      ];

      // Add dummy users to database
      dummyUsers.forEach((dummyUser) => {
        const exists = db.findOne("users", (u) => u.email === dummyUser.email);
        if (!exists) {
          db.create("users", dummyUser);
        }
      });
    }
  };

  const loadUsers = () => {
    setLoading(true);
    try {
      const allUsers = userService.getAllUsers();
      const filteredUsers = allUsers.filter((u) => u.id !== user?.id);
      setUsers(filteredUsers);

      // Initialize following status
      const status = {};
      filteredUsers.forEach((u) => {
        status[u.id] = user?.following?.includes(u.id) || false;
      });
      setFollowingStatus(status);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const followed = await userService.toggleFollow(targetUserId);
      setFollowingStatus((prev) => ({
        ...prev,
        [targetUserId]: followed,
      }));
      refreshUser();
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.message || "Failed to follow/unfollow user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 animate-spin border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 via-primary-50">
      {/* Hero Section */}
      <div className="overflow-hidden relative text-white bg-gradient-to-r to-purple-600 from-primary-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="relative px-4 py-16 mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Discover Amazing People
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-white text-opacity-90">
              Connect with creators, thinkers, and innovators from around the
              world
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-4 py-6 mx-auto max-w-6xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-600">People to discover</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {Object.values(followingStatus).filter(Boolean).length}
              </p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {users.length -
                  Object.values(followingStatus).filter(Boolean).length}
              </p>
              <p className="text-sm text-gray-600">New connections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="px-4 py-8 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((discoveredUser, index) => (
            <div
              key={discoveredUser.id}
              className="overflow-hidden bg-white rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cover Image */}
              <div className="relative h-24 bg-gradient-to-r to-purple-400 from-primary-400">
                {discoveredUser.coverImage && (
                  <img
                    src={discoveredUser.coverImage}
                    alt="Cover"
                    className="object-cover w-full h-full"
                  />
                )}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                  <img
                    src={discoveredUser.profilePicture}
                    alt={discoveredUser.name}
                    className="object-cover w-20 h-20 rounded-full border-4 border-white"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="px-6 pt-12 pb-6 text-center">
                <Link
                  to={`/profile/${discoveredUser.username}`}
                  className="hover:underline"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {discoveredUser.name}
                  </h3>
                </Link>
                <p className="mb-2 text-sm text-gray-500">
                  @{discoveredUser.username}
                </p>

                {discoveredUser.bio && (
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {discoveredUser.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center mb-4 space-x-6 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {discoveredUser.followersCount || 0}
                    </span>
                    <span className="ml-1 text-gray-500">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      {discoveredUser.followingCount || 0}
                    </span>
                    <span className="ml-1 text-gray-500">following</span>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={() => handleFollowToggle(discoveredUser.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    followingStatus[discoveredUser.id]
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {!followingStatus[discoveredUser.id] && (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>
                    {followingStatus[discoveredUser.id]
                      ? "Following"
                      : "Follow"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
