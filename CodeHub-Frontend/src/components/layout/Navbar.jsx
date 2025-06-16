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
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { notificationsAPI } from "../../services/api";
import { Button, Input, NotificationDropdown } from "../ui";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug: Log user data to see what's available
  useEffect(() => {
    if (user) {
      console.log('🔍 [Navbar] Current user data:', {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        avatar: user.avatar,
        fullName: user.fullName,
        allUserData: user
      });
    }
  }, [user]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  // Load unread notifications count from API
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (isAuthenticated && user) {
        try {
          console.log('🔔 [Navbar] Loading unread count from API...');
          const response = await notificationsAPI.getStats();
          
          if (response && response.data) {
            setUnreadCount(response.data.unreadCount || 0);
            console.log('✅ [Navbar] Loaded unread count:', response.data.unreadCount);
          } else {
            console.log('⚠️ [Navbar] Empty API response, using mock count');
            setUnreadCount(3); // Mock fallback
          }
        } catch (error) {
          console.warn('⚠️ [Navbar] API not available for unread count, using mock:', error.message);
          setUnreadCount(3); // Mock fallback when API is not available
        }
      } else {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
    
    // Optionally, poll for updates every minute
    const interval = setInterval(loadUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white dark:text-white light:text-gray-900 pr-4">
              CodeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg transition-colors ${
                  isActivePath(item.path)
                    ? "text-cyan-400"
                    : "text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900"
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="text"
                placeholder="Search code snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                iconPosition="left"
                className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-gray-100 border-slate-600 dark:border-slate-600 light:border-gray-300 focus:border-cyan-500"
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  {" "}
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 transition-colors relative"
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
                </div>{" "}
                {/* Create Snippet Button */}
                <Link
                  to="/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Snippet</span>
                </Link>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 transition-colors"
                  >                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-500/20">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username || user.email || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.warn("Failed to load user avatar:", user.avatarUrl);
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
                           user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="text-white dark:text-white light:text-gray-900 text-sm font-medium">
                        {user?.username}
                      </span>
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
            ) : (              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 dark:border-slate-700 light:border-gray-200 py-4">
              {/* Mobile Search */}
              <div className="px-4 pb-4">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder="Search code snippets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={Search}
                    iconPosition="left"
                    className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-gray-100 border-slate-600 dark:border-slate-600 light:border-gray-300 focus:border-cyan-500"
                  />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActivePath(item.path)
                        ? "text-cyan-400 bg-cyan-500/10"
                        : "text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}{" "}
                {isAuthenticated && (
                  <>
                    {/* Mobile Notifications */}
                    <button
                      onClick={() => {
                        setIsNotificationOpen(!isNotificationOpen);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 rounded-lg"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </button>

                    {/* Mobile Create Snippet */}
                    <Link
                      to="/create"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Snippet</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-gray-100 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
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
