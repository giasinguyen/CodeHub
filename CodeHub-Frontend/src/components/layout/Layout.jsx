import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ThemeToggle from '../ui/ThemeToggle';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Don't show sidebar on auth pages
  const isAuthPage = location.pathname.startsWith('/auth') || 
                     location.pathname === '/login' || 
                     location.pathname === '/register';

  // Don't show layout on full-screen pages
  const isFullScreenPage = location.pathname.includes('/embed') || 
                           location.pathname.includes('/preview');

  if (isFullScreenPage) {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1">
        {/* Sidebar - Only show on non-auth pages */}
        {!isAuthPage && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="lg:hidden">
                <div 
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 z-50 w-64">
                  <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Content */}
        <main className={`
          flex-1 
          ${!isAuthPage ? 'lg:ml-0' : ''} 
          transition-all duration-300 ease-in-out
        `}>
          <div className="min-h-[calc(100vh-64px)]">
            {children}
          </div>
        </main>
      </div>      {/* Footer */}
      <Footer />
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default Layout;
