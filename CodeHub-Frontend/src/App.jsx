import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SnippetProvider } from './contexts/SnippetContext';
import { Layout } from './components/layout';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Home, 
  Snippets, 
  SnippetDetail,
  CreateSnippet,
  Profile,
  Developers,
  Settings,
  Login, 
  Register 
} from './pages';
import './App.css';

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
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/snippets" element={<Layout><Snippets /></Layout>} />
      <Route path="/snippets/:id" element={<Layout><SnippetDetail /></Layout>} />
      <Route path="/developers" element={<Layout><Developers /></Layout>} />
      
      {/* Auth Routes - Only accessible when not logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Layout><Login /></Layout>
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Layout><Register /></Layout>
          </PublicRoute>
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
                  <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">My Snippets</h2>
                      <p className="text-slate-400">Manage your code snippets</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">Bookmarks</h2>
                      <p className="text-slate-400">View saved snippets</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <h2 className="text-xl font-semibold text-white mb-2">Analytics</h2>
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
            <Layout><CreateSnippet /></Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile/:userId" 
        element={
          <Layout><Profile /></Layout>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
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
                <h2 className="text-2xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
                <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
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

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SnippetProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SnippetProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
