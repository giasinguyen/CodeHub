import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Code2,
  Users,
  TrendingUp,
  BookOpen,
  Star,
  Clock,
  Tag,
  Settings,
} from 'lucide-react';

const Sidebar = ({ className = '' }) => {
  const location = useLocation();
  const menuItems = [
    {
      section: 'Explore',
      items: [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Code2, label: 'Code Snippets', path: '/snippets' },
        { icon: Users, label: 'Developers', path: '/users' },
        { icon: TrendingUp, label: 'Trending', path: '/trending' },
      ],
    },
    {
      section: 'Collection',
      items: [
        { icon: BookOpen, label: 'My Snippets', path: '/my-snippets' },
        { icon: Star, label: 'Favorites', path: '/favorites' },
        { icon: Clock, label: 'Recent', path: '/recent' },
      ],
    },
    {
      section: 'Categories',
      items: [
        { icon: Tag, label: 'JavaScript', path: '/tags/javascript' },
        { icon: Tag, label: 'Python', path: '/tags/python' },
        { icon: Tag, label: 'React', path: '/tags/react' },
        { icon: Tag, label: 'Node.js', path: '/tags/nodejs' },
        { icon: Tag, label: 'CSS', path: '/tags/css' },
      ],
    },
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`w-64 bg-slate-900/50 border-r border-slate-700 ${className}`}>
      <div className="h-full overflow-y-auto py-6">
        <div className="px-4 space-y-8">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {section.section}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className={`
                        relative flex items-center space-x-3 px-3 py-2 rounded-lg
                        transition-all duration-200 group
                        ${isActive
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r"
                          layoutId="sidebar-indicator"
                        />
                      )}
                      
                      <item.icon className={`
                        w-5 h-5 transition-colors
                        ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'}
                      `} />
                      
                      <span className="text-sm font-medium">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>        {/* Quick Actions */}
        <div className="px-4 mt-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Share useful code snippets to build a strong developer community!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Create new snippet →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 mt-8 pt-8 border-t border-slate-700">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
