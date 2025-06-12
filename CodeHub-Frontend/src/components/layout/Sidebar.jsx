import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  ChevronRight,
  Globe,
  Database,
  Smartphone,
  Server,
  Brain,
  Gamepad,
  Palette,
  Terminal,
  Layers,
} from "lucide-react";

const Sidebar = ({ className = "" }) => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({
    frontend: false,
    backend: false,
    mobile: false,
    database: false,
    devops: false,
    languages: true, // Default expanded
  });

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Comprehensive categories with icons and colors
  const categoryGroups = {
    languages: {
      title: "Programming Languages",
      icon: Code2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      items: [
        { label: "JavaScript", path: "/tags/javascript", color: "#f7df1e" },
        { label: "TypeScript", path: "/tags/typescript", color: "#3178c6" },
        { label: "Python", path: "/tags/python", color: "#3776ab" },
        { label: "Java", path: "/tags/java", color: "#ed8b00" },
        { label: "C++", path: "/tags/cpp", color: "#00599c" },
        { label: "C#", path: "/tags/csharp", color: "#239120" },
        { label: "Go", path: "/tags/go", color: "#00add8" },
        { label: "Rust", path: "/tags/rust", color: "#000000" },
        { label: "PHP", path: "/tags/php", color: "#777bb4" },
        { label: "Ruby", path: "/tags/ruby", color: "#cc342d" },
        { label: "Swift", path: "/tags/swift", color: "#fa7343" },
        { label: "Kotlin", path: "/tags/kotlin", color: "#7f52ff" },
      ]
    },
    frontend: {
      title: "Frontend Technologies",
      icon: Globe,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      items: [
        { label: "React", path: "/tags/react", color: "#61dafb" },
        { label: "Vue.js", path: "/tags/vue", color: "#4fc08d" },
        { label: "Angular", path: "/tags/angular", color: "#dd0031" },
        { label: "Svelte", path: "/tags/svelte", color: "#ff3e00" },
        { label: "Next.js", path: "/tags/nextjs", color: "#000000" },
        { label: "Nuxt.js", path: "/tags/nuxtjs", color: "#00dc82" },
        { label: "HTML", path: "/tags/html", color: "#e34f26" },
        { label: "CSS", path: "/tags/css", color: "#1572b6" },
        { label: "Sass/SCSS", path: "/tags/sass", color: "#cc6699" },
        { label: "Tailwind CSS", path: "/tags/tailwind", color: "#06b6d4" },
      ]
    },
    backend: {
      title: "Backend & APIs",
      icon: Server,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      items: [
        { label: "Node.js", path: "/tags/nodejs", color: "#339933" },
        { label: "Express.js", path: "/tags/express", color: "#000000" },
        { label: "NestJS", path: "/tags/nestjs", color: "#e0234e" },
        { label: "Django", path: "/tags/django", color: "#092e20" },
        { label: "Flask", path: "/tags/flask", color: "#000000" },
        { label: "FastAPI", path: "/tags/fastapi", color: "#009688" },
        { label: "Spring Boot", path: "/tags/spring", color: "#6db33f" },
        { label: "Laravel", path: "/tags/laravel", color: "#ff2d20" },
        { label: "Ruby on Rails", path: "/tags/rails", color: "#cc0000" },
        { label: "ASP.NET", path: "/tags/aspnet", color: "#512bd4" },
      ]
    },
    mobile: {
      title: "Mobile Development",
      icon: Smartphone,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      items: [
        { label: "React Native", path: "/tags/react-native", color: "#61dafb" },
        { label: "Flutter", path: "/tags/flutter", color: "#02569b" },
        { label: "iOS", path: "/tags/ios", color: "#000000" },
        { label: "Android", path: "/tags/android", color: "#3ddc84" },
        { label: "Xamarin", path: "/tags/xamarin", color: "#3498db" },
        { label: "Ionic", path: "/tags/ionic", color: "#3880ff" },
      ]
    },
    database: {
      title: "Databases & Storage",
      icon: Database,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      items: [
        { label: "MySQL", path: "/tags/mysql", color: "#00618a" },
        { label: "PostgreSQL", path: "/tags/postgresql", color: "#336791" },
        { label: "MongoDB", path: "/tags/mongodb", color: "#4db33d" },
        { label: "Redis", path: "/tags/redis", color: "#d82c20" },
        { label: "SQLite", path: "/tags/sqlite", color: "#003b57" },
        { label: "Firebase", path: "/tags/firebase", color: "#ffca28" },
        { label: "Supabase", path: "/tags/supabase", color: "#3ecf8e" },
      ]
    },
    devops: {
      title: "DevOps & Tools",
      icon: Terminal,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      items: [
        { label: "Docker", path: "/tags/docker", color: "#0db7ed" },
        { label: "Kubernetes", path: "/tags/kubernetes", color: "#326ce5" },
        { label: "AWS", path: "/tags/aws", color: "#ff9900" },
        { label: "Azure", path: "/tags/azure", color: "#0078d4" },
        { label: "Google Cloud", path: "/tags/gcp", color: "#4285f4" },
        { label: "Git", path: "/tags/git", color: "#f05032" },
        { label: "CI/CD", path: "/tags/cicd", color: "#2088ff" },
        { label: "Terraform", path: "/tags/terraform", color: "#623ce4" },
      ]
    },
  };

  const menuItems = [{
      section: "Explore",
      items: [
        { icon: Home, label: "Home", path: "/" },
        { icon: Code2, label: "Code Snippets", path: "/snippets" },
        { icon: Users, label: "Developers", path: "/developers" },
        { icon: TrendingUp, label: "Trending", path: "/trending" },
      ],
    },    {
      section: "Collection",
      items: [
        { icon: BookOpen, label: "My Snippets", path: "/my-snippets" },
        { icon: Star, label: "Favorites", path: "/favorites" },
        { icon: Clock, label: "Recent", path: "/recent" },
      ],
    },
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  return (
    <aside
      className={`w-64 bg-slate-900/50 border-r border-slate-700 ${className}`}
    >
      <div className="h-full overflow-y-auto py-6">
        <div className="px-4 space-y-8">
          {/* Regular Menu Items */}
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
                        ${
                          isActive
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r"
                          layoutId="sidebar-indicator"
                        />
                      )}

                      <item.icon
                        className={`
                        w-5 h-5 transition-colors
                        ${
                          isActive
                            ? "text-cyan-400"
                            : "text-slate-400 group-hover:text-white"
                        }
                      `}
                      />

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

          {/* Enhanced Categories Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {Object.entries(categoryGroups).map(([categoryKey, category]) => {
                const Icon = category.icon;
                const isExpanded = expandedCategories[categoryKey];
                
                return (
                  <div key={categoryKey} className="space-y-1">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg
                        transition-all duration-200 group
                        ${category.bgColor} ${category.borderColor} border
                        hover:bg-opacity-80
                      `}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${category.color}`} />
                        <span className={`text-sm font-medium ${category.color}`}>
                          {category.title}
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className={`w-4 h-4 ${category.color}`} />
                      </motion.div>
                    </button>

                    {/* Category Items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 space-y-1 overflow-hidden"
                        >
                          {category.items.map((item, itemIndex) => {
                            const isActive = isActivePath(item.path);
                            return (
                              <Link
                                key={itemIndex}
                                to={item.path}
                                className={`
                                  relative flex items-center space-x-3 px-3 py-2 rounded-lg
                                  transition-all duration-200 group
                                  ${
                                    isActive
                                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                                  }
                                `}
                              >
                                {isActive && (
                                  <motion.div
                                    className="absolute left-0 w-1 h-4 bg-cyan-400 rounded-r"
                                    layoutId="sidebar-category-indicator"
                                  />
                                )}

                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />

                                <span className="text-sm">{item.label}</span>

                                {isActive && (
                                  <motion.div
                                    className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>        </div>

        {/* Pro Tip Section */}
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

        {/* Settings */}
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
