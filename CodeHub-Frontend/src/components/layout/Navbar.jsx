import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Code2,
  Bell,
  PlusCircle,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { notificationsAPI, chatHistoryAPI } from "../../services/api";
import { Button, Input, NotificationDropdown, MessageDropdown, SmartSearch } from "../ui";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log user data to see what's available
  useEffect(() => {
    if (user) {
      console.log("🔍 [Navbar] Current user data:", {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        avatar: user.avatar,
        fullName: user.fullName,
        allUserData: user,
      });
    }
  }, [user]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  // Load unread notifications count from API
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (isAuthenticated && user) {
        try {
          console.log("🔔 [Navbar] Loading unread count from API...");
          const response = await notificationsAPI.getStats();

          if (response && response.data) {
            setUnreadCount(response.data.unreadCount || 0);
            console.log(
              "✅ [Navbar] Loaded unread count:",
              response.data.unreadCount
            );
          } else {
            console.log("⚠️ [Navbar] Empty API response, using mock count");
            setUnreadCount(3); // Mock fallback
          }
        } catch (error) {
          console.warn(
            "⚠️ [Navbar] API not available for unread count, using mock:",
            error.message
          );
          setUnreadCount(3); // Mock fallback when API is not available
        }
      } else {
        setUnreadCount(0);
      }
    };

    const loadUnreadMessageCount = async () => {
      if (isAuthenticated && user) {
        try {
          console.log("💬 [Navbar] Loading unread message count from API...");
          const response = await chatHistoryAPI.getChatStats();

          if (response && response.data) {
            setUnreadMessageCount(response.data.unreadMessages || 0);
            console.log(
              "✅ [Navbar] Loaded unread message count:",
              response.data.unreadMessages
            );
          }
        } catch (error) {
          console.warn(
            "⚠️ [Navbar] API not available for unread message count:",
            error.message
          );
          setUnreadMessageCount(0); // No fallback for messages
        }
      } else {
        setUnreadMessageCount(0);
      }
    };

    loadUnreadCount();
    loadUnreadMessageCount();
    
    // Optionally, poll for updates every minute
    const interval = setInterval(() => {
      loadUnreadCount();
      loadUnreadMessageCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/snippets", label: "Code Snippets" },
    { path: "/developers", label: "Developers" },
    { path: "/trending", label: "Trending" },
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-sm border-b border-slate-700 dark:border-slate-700 light:border-gray-200 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2.5 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white dark:text-white light:text-gray-900">
                CodeHub
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isActivePath(item.path)
                    ? "text-cyan-400 bg-slate-800/50"
                    : "text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/30"
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>          {/* Search Bar - Smart Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <SmartSearch 
              className="w-full"
              placeholder="Search code snippets, users, tags..."
              size="lg"
              showFilters={true}
            />
          </div>{" "}
          {/* Right Section */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-3 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 transition-all duration-200 relative"
                  >
                    <Bell className="w-5 h-5" />
                    {/* Notification badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-900 dark:border-slate-900 light:border-white text-xs flex items-center justify-center text-white font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
                    unreadCount={unreadCount}
                  />
                </div>

                {/* Messages */}
                <div className="relative">
                  <button
                    onClick={() => setIsMessageOpen(!isMessageOpen)}
                    className="p-3 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 transition-all duration-200 relative"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {/* Message badge */}
                    {unreadMessageCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-2 border-slate-900 dark:border-slate-900 light:border-white text-xs flex items-center justify-center text-white font-bold">
                        {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                      </span>
                    )}
                  </button>
                  <MessageDropdown
                    isOpen={isMessageOpen}
                    onToggle={setIsMessageOpen}
                    unreadCount={unreadMessageCount}
                  />
                </div>

                {/* Create Snippet Button */}
                <Link
                  to="/create"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Snippet</span>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 transition-all duration-200"
                  >
                    {" "}
                    {/* User Avatar */}
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-500/30 hover:border-cyan-400/50 transition-colors">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username || user.email || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.warn(
                              "Failed to load user avatar:",
                              user.avatarUrl
                            );
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      {/* Fallback Avatar */}
                      <div
                        className={`w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ${
                          user?.avatarUrl ? "hidden" : "flex"
                        }`}
                      >
                        <span className="text-white text-sm font-bold">
                          {user?.username?.charAt(0)?.toUpperCase() ||
                            user?.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </span>
                      </div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <span className="text-white dark:text-white light:text-gray-900 text-sm font-medium">
                        {user?.username}
                      </span>
                      <div className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg shadow-lg border border-slate-700 dark:border-slate-700 light:border-gray-200 py-1 z-50">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Login/Register Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 font-medium rounded-xl hover:bg-slate-800/30 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="sm"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 md:hidden rounded-xl hover:bg-slate-800/30 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>{" "}
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 dark:border-slate-700 light:border-gray-200 py-6">              {/* Mobile Search */}
              <div className="px-6 pb-4">
                <SmartSearch 
                  className="w-full"
                  placeholder="Search code snippets, users, tags..."
                  size="md"
                  showFilters={false}
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2 px-6">
                {" "}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? "text-cyan-400 bg-cyan-500/15 border-l-4 border-cyan-400"
                        : "text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100"
                    }`}
                  >
                    {" "}
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    {" "}
                    {/* Mobile Notifications */}
                    <button
                      onClick={() => {
                        setIsNotificationOpen(!isNotificationOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100 rounded-xl transition-all duration-200"
                    >
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {/* Mobile Create Snippet */}
                    <Link
                      to="/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 font-medium"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Create Snippet</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 light:hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
