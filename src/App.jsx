import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import DiscoverPage from "./pages/DiscoverPage";
import SettingsPage from "./pages/SettingsPage";
import DebugPanel from "./components/debug/DebugPanel";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationsPage from "./pages/NotificationsPage";
import { ChatProvider } from "./contexts/ChatContext";
import MessagesPage from "./pages/MessagePage";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ChatProvider>
          <Router>
            {process.env.NODE_ENV === "development" && <DebugPanel />}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <HomePage />
                    </>
                  }
                />
                <Route
                  path="/profile/:username"
                  element={
                    <>
                      <Navbar />
                      <ProfilePage />
                    </>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <>
                      <Navbar />
                      <DiscoverPage />
                    </>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <>
                      <Navbar />
                      <DiscoverPage />
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <Navbar />
                      <SettingsPage />
                    </>
                  }
                />
              </Route>
              <Route
                path="/messages"
                element={
                  <>
                    <Navbar />
                    <MessagesPage />
                  </>
                }
              />
            </Routes>
          </Router>
        </ChatProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
