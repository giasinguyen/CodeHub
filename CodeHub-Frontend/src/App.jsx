import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SnippetProvider } from "./contexts/SnippetContext";
import { Layout } from "./components/layout";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import ThemeHelper from "./components/ThemeHelper";
import {  Home,
  Snippets,
  SnippetDetail,
  CreateSnippet,
  MySnippets,
  Favorites,
  Profile,
  Developers,
  Trending,
  TagPage,
  Settings,
  Notifications,
  Login,
  Register,  Recent,
  Search,
  HelpCenter,
  ReportBug,
  Feedback,
  Community,
  TermsOfService,
  PrivacyPolicy,
  CookiePolicy,
  Licenses,
} from "./pages";
import { About, Blog, Careers, Contact } from "./pages/company";
import "./App.css";

// Initialize theme on app load
const initializeTheme = () => {
  const savedSettings = localStorage.getItem("userSettings");
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      const appearance = parsed.appearance;

      if (appearance) {
        const root = document.documentElement;
        const body = document.body;

        // Apply theme
        if (appearance.theme === "light") {
          root.classList.remove("dark", "auto");
          root.classList.add("light");
          body.classList.remove("dark", "auto");
          body.classList.add("light");
        } else if (appearance.theme === "dark") {
          root.classList.remove("light", "auto");
          root.classList.add("dark");
          body.classList.remove("light", "auto");
          body.classList.add("dark");
        } else {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          root.classList.remove("light", "dark");
          root.classList.add("auto", prefersDark ? "dark" : "light");
          body.classList.remove("light", "dark");
          body.classList.add("auto", prefersDark ? "dark" : "light");
        }

        // Apply other appearance settings
        if (appearance.fontSize) {
          const fontSizeMap = {
            small: "14px",
            medium: "16px",
            large: "18px",
          };
          root.style.fontSize = fontSizeMap[appearance.fontSize];
        }

        if (appearance.compactMode) {
          root.classList.add("compact-mode");
        }

        if (appearance.highContrast) {
          root.classList.add("high-contrast");
        }

        if (!appearance.animationsEnabled) {
          root.classList.add("reduce-motion");
        }
      }
    } catch (error) {
      console.error("Error loading saved theme settings:", error);
    }
  }
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/snippets"
        element={
          <Layout>
            <Snippets />
          </Layout>
        }
      />{" "}
      <Route
        path="/snippets/:id"
        element={
          <Layout>
            <SnippetDetail />
          </Layout>
        }
      />
      <Route
        path="/developers"
        element={
          <Layout>
            <Developers />
          </Layout>
        }
      />
      <Route
        path="/trending"
        element={
          <Layout>
            <Trending />
          </Layout>
        }
      />{" "}
      <Route
        path="/tags/:tagName"
        element={
          <Layout>
            <TagPage />
          </Layout>
        }
      />      <Route
        path="/recent"
        element={
          <Layout>
            <Recent />
          </Layout>
        }
      />      <Route
        path="/search"
        element={
          <Layout>
            <Search />
          </Layout>
        }
      />
      {/* Auth Routes - Only accessible when not logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Layout>
              <Login />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Layout>
              <Register />
            </Layout>
          </PublicRoute>
        }
      />

      {/* Company Pages */}
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/blog"
        element={
          <Layout>
            <Blog />
          </Layout>
        }
      />
      <Route
        path="/careers"
        element={
          <Layout>
            <Careers />
          </Layout>
        }
      />      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />

      {/* Support Pages */}
      <Route
        path="/support"
        element={
          <Layout>
            <HelpCenter />
          </Layout>
        }
      />
      <Route
        path="/support/help"
        element={
          <Layout>
            <HelpCenter />
          </Layout>
        }
      />
      <Route
        path="/support/report-bug"
        element={
          <Layout>
            <ReportBug />
          </Layout>
        }
      />
      <Route
        path="/support/feedback"
        element={
          <Layout>
            <Feedback />
          </Layout>
        }
      />      <Route
        path="/support/community"
        element={
          <Layout>
            <Community />
          </Layout>
        }
      />

      {/* Legal Pages */}
      <Route
        path="/legal/terms-of-service"
        element={
          <Layout>
            <TermsOfService />
          </Layout>
        }
      />
      <Route
        path="/legal/privacy-policy"
        element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        }
      />
      <Route
        path="/legal/cookie-policy"
        element={
          <Layout>
            <CookiePolicy />
          </Layout>
        }
      />
      <Route
        path="/legal/licenses"
        element={
          <Layout>
            <Licenses />
          </Layout>
        }
      />

      {/* Protected Routes - Only accessible when logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <div className="min-h-screen bg-slate-900 p-8">
                <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-white mb-8">
                    Dashboard
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">
                        My Snippets
                      </h2>
                      <p className="text-slate-400">
                        Manage your code snippets
                      </p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Bookmarks
                      </h2>
                      <p className="text-slate-400">View saved snippets</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Analytics
                      </h2>
                      <p className="text-slate-400">Track your activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateSnippet />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-snippets"
        element={
          <ProtectedRoute>
            <Layout>
              <MySnippets />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Layout>
              <Favorites />
            </Layout>
          </ProtectedRoute>
        }
      />{" "}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:username"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-300 mb-4">
                  Page Not Found
                </h2>
                <p className="text-slate-400 mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
                >
                  Go Back
                </button>
                <a
                  href="/"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeHelper />
      <Router>
        <AuthProvider>
          <SnippetProvider>
            <ScrollToTop />
            <AppRoutes />
          </SnippetProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
