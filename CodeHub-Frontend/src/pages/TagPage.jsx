import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Users,
  Code2,
  Tag,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  ArrowUp,
  ArrowDown,
  Flame,
  BookOpen,
} from "lucide-react";
import { Card, Loading, Button, Input } from "../components/ui";
import { snippetsAPI } from "../services/api";
import toast from "react-hot-toast";

// Generate mock snippets function - moved outside component
const generateMockSnippets = (tag, count, currentTag) => {
  const mockSnippets = [];
  const titles = {
    javascript: [
      "Async/Await Error Handling",
      "Debounce Function Implementation", 
      "Array Methods Cheat Sheet",
      "Promise Chain Optimization",
      "DOM Manipulation Utilities",
      "Event Delegation Pattern",
      "Closure Examples",
      "Module Pattern Implementation",
      "ES6 Destructuring Tricks",
      "Functional Programming Helpers",
      "Type Checking Utilities",
      "Performance Optimization Tips"
    ],
    react: [
      "Custom Hook for API Calls",
      "Context API Implementation",
      "Optimized Component Rendering",
      "Form Validation Hook",
      "Infinite Scroll Component",
      "Dark Mode Toggle",
      "Error Boundary Implementation",
      "Lazy Loading with Suspense",
      "State Management Patterns",
      "Component Testing Examples",
      "Performance Monitoring",
      "Accessibility Helpers"
    ],
    python: [
      "Data Analysis with Pandas",
      "Web Scraping Script",
      "API Rate Limiting",
      "File Processing Utilities",
      "Database Connection Pool",
      "Logging Configuration",
      "Decorator Patterns",
      "Context Managers",
      "List Comprehensions",
      "Error Handling Strategies",
      "Testing Frameworks",
      "Performance Profiling"
    ],
  };

  const tagTitles = titles[tag] || [
    `${currentTag.name} Utility Function`,
    `${currentTag.name} Best Practices`,
    `${currentTag.name} Code Examples`,
    `${currentTag.name} Implementation Guide`,
    `${currentTag.name} Performance Tips`,
    `${currentTag.name} Common Patterns`,
    `${currentTag.name} Error Handling`,
    `${currentTag.name} Testing Examples`,
    `${currentTag.name} Documentation`,
    `${currentTag.name} Troubleshooting`,
    `${currentTag.name} Advanced Techniques`,
    `${currentTag.name} Quick Reference`
  ];

  for (let i = 0; i < count; i++) {
    mockSnippets.push({
      id: i + 1,
      title: tagTitles[i % tagTitles.length],
      description: `Practical ${currentTag.name} code snippet demonstrating best practices and efficient implementation patterns.`,
      language: currentTag.name,
      tags: [tag, "tutorial", "example"],
      owner: {
        id: Math.floor(Math.random() * 100) + 1,
        username: `developer${Math.floor(Math.random() * 100) + 1}`,
        avatarUrl: null,
      },
      viewCount: Math.floor(Math.random() * 1000) + 50,
      likeCount: Math.floor(Math.random() * 100) + 5,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }  return mockSnippets;
};

// Tag metadata with colors and descriptions - moved outside component to avoid dependency issues
const tagMetadata = {
  // Programming Languages
  javascript: {
    name: "JavaScript",
    color: "#f7df1e",
    bgColor: "from-yellow-500/20 to-orange-500/20",
    description: "The versatile programming language for web development",
    category: "Programming Language",
    icon: Code2,
  },
  typescript: {
    name: "TypeScript",
    color: "#3178c6",
    bgColor: "from-blue-500/20 to-blue-600/20",
    description: "JavaScript with syntax for types",
    category: "Programming Language",
    icon: Code2,
  },
  python: {
    name: "Python",
    color: "#3776ab",
    bgColor: "from-blue-500/20 to-green-500/20",
    description: "High-level programming language for various applications",
    category: "Programming Language",
    icon: Code2,
  },
  java: {
    name: "Java",
    color: "#ed8b00",
    bgColor: "from-orange-500/20 to-red-500/20",
    description: "Object-oriented programming language",
    category: "Programming Language",
    icon: Code2,
  },
  cpp: {
    name: "C++",
    color: "#00599c",
    bgColor: "from-blue-600/20 to-blue-700/20",
    description: "General-purpose programming language",
    category: "Programming Language",
    icon: Code2,
  },
  csharp: {
    name: "C#",
    color: "#239120",
    bgColor: "from-green-600/20 to-purple-500/20",
    description: "Modern object-oriented programming language",
    category: "Programming Language",
    icon: Code2,
  },
  go: {
    name: "Go",
    color: "#00add8",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    description: "Open source programming language by Google",
    category: "Programming Language",
    icon: Code2,
  },
  rust: {
    name: "Rust",
    color: "#ce422b",
    bgColor: "from-orange-600/20 to-red-600/20",
    description: "Systems programming language focused on safety",
    category: "Programming Language",
    icon: Code2,
  },
  php: {
    name: "PHP",
    color: "#777bb4",
    bgColor: "from-purple-500/20 to-indigo-500/20",
    description: "Server-side scripting language",
    category: "Programming Language",
    icon: Code2,
  },
  ruby: {
    name: "Ruby",
    color: "#cc342d",
    bgColor: "from-red-500/20 to-pink-500/20",
    description: "Dynamic, open source programming language",
    category: "Programming Language",
    icon: Code2,
  },
  swift: {
    name: "Swift",
    color: "#fa7343",
    bgColor: "from-orange-500/20 to-red-500/20",
    description: "Programming language for iOS and macOS",
    category: "Programming Language",
    icon: Code2,
  },
  kotlin: {
    name: "Kotlin",
    color: "#7f52ff",
    bgColor: "from-purple-500/20 to-indigo-500/20",
    description: "Modern programming language for Android",
    category: "Programming Language",
    icon: Code2,
  },

  // Frontend Technologies
  react: {
    name: "React",
    color: "#61dafb",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    description: "JavaScript library for building user interfaces",
    category: "Frontend Framework",
    icon: Code2,
  },
  vue: {
    name: "Vue.js",
    color: "#4fc08d",
    bgColor: "from-green-500/20 to-emerald-500/20",
    description: "Progressive JavaScript framework",
    category: "Frontend Framework",
    icon: Code2,
  },
  angular: {
    name: "Angular",
    color: "#dd0031",
    bgColor: "from-red-500/20 to-pink-500/20",
    description: "Platform for building mobile and desktop web applications",
    category: "Frontend Framework",
    icon: Code2,
  },
  svelte: {
    name: "Svelte",
    color: "#ff3e00",
    bgColor: "from-orange-500/20 to-red-500/20",
    description: "Cybernetically enhanced web apps",
    category: "Frontend Framework",
    icon: Code2,
  },
  nextjs: {
    name: "Next.js",
    color: "#000000",
    bgColor: "from-slate-600/20 to-slate-700/20",
    description: "React framework for production",
    category: "Frontend Framework",
    icon: Code2,
  },
  nuxtjs: {
    name: "Nuxt.js",
    color: "#00dc82",
    bgColor: "from-emerald-500/20 to-green-500/20",
    description: "Vue.js framework for modern web development",
    category: "Frontend Framework",
    icon: Code2,
  },
  html: {
    name: "HTML",
    color: "#e34f26",
    bgColor: "from-orange-500/20 to-red-500/20",
    description: "Standard markup language for web pages",
    category: "Markup Language",
    icon: Code2,
  },
  css: {
    name: "CSS",
    color: "#1572b6",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    description: "Style sheet language for describing presentation",
    category: "Styling",
    icon: Code2,
  },
  sass: {
    name: "Sass/SCSS",
    color: "#cc6699",
    bgColor: "from-pink-500/20 to-purple-500/20",
    description: "CSS extension language",
    category: "Styling",
    icon: Code2,
  },
  tailwind: {
    name: "Tailwind CSS",
    color: "#06b6d4",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    description: "Utility-first CSS framework",
    category: "CSS Framework",
    icon: Code2,
  },

  // Backend Technologies
  nodejs: {
    name: "Node.js",
    color: "#339933",
    bgColor: "from-green-500/20 to-emerald-500/20",
    description: "JavaScript runtime built on Chrome's V8 engine",
    category: "Runtime Environment",
    icon: Code2,
  },
  express: {
    name: "Express.js",
    color: "#000000",
    bgColor: "from-slate-600/20 to-slate-700/20",
    description: "Fast, unopinionated web framework for Node.js",
    category: "Backend Framework",
    icon: Code2,
  },
  nestjs: {
    name: "NestJS",
    color: "#e0234e",
    bgColor: "from-red-500/20 to-pink-500/20",
    description: "Progressive Node.js framework",
    category: "Backend Framework",
    icon: Code2,
  },
  django: {
    name: "Django",
    color: "#092e20",
    bgColor: "from-green-800/20 to-green-900/20",
    description: "High-level Python web framework",
    category: "Backend Framework",
    icon: Code2,
  },
  flask: {
    name: "Flask",
    color: "#000000",
    bgColor: "from-slate-600/20 to-slate-700/20",
    description: "Lightweight WSGI web application framework",
    category: "Backend Framework",
    icon: Code2,
  },
  fastapi: {
    name: "FastAPI",
    color: "#009688",
    bgColor: "from-teal-500/20 to-green-500/20",
    description: "Modern, fast web framework for building APIs",
    category: "Backend Framework",
    icon: Code2,
  },
  spring: {
    name: "Spring Boot",
    color: "#6db33f",
    bgColor: "from-green-500/20 to-emerald-500/20",
    description: "Java-based framework for enterprise applications",
    category: "Backend Framework",
    icon: Code2,
  },
  laravel: {
    name: "Laravel",
    color: "#ff2d20",
    bgColor: "from-red-500/20 to-orange-500/20",
    description: "PHP web application framework",
    category: "Backend Framework",
    icon: Code2,
  },
  rails: {
    name: "Ruby on Rails",
    color: "#cc0000",
    bgColor: "from-red-600/20 to-red-700/20",
    description: "Server-side web application framework",
    category: "Backend Framework",
    icon: Code2,
  },
  aspnet: {
    name: "ASP.NET",
    color: "#512bd4",
    bgColor: "from-purple-600/20 to-indigo-600/20",
    description: "Cross-platform framework for building web apps",
    category: "Backend Framework",
    icon: Code2,
  },

  // Mobile Development
  "react-native": {
    name: "React Native",
    color: "#61dafb",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    description: "Framework for building native mobile apps",
    category: "Mobile Framework",
    icon: Code2,
  },
  flutter: {
    name: "Flutter",
    color: "#02569b",
    bgColor: "from-blue-600/20 to-blue-700/20",
    description: "UI toolkit for building native applications",
    category: "Mobile Framework",
    icon: Code2,
  },
  ios: {
    name: "iOS",
    color: "#000000",
    bgColor: "from-slate-600/20 to-slate-700/20",
    description: "Mobile operating system by Apple",
    category: "Mobile Platform",
    icon: Code2,
  },
  android: {
    name: "Android",
    color: "#3ddc84",
    bgColor: "from-green-500/20 to-emerald-500/20",
    description: "Mobile operating system by Google",
    category: "Mobile Platform",
    icon: Code2,
  },
  xamarin: {
    name: "Xamarin",
    color: "#3498db",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    description: "Cross-platform mobile development framework",
    category: "Mobile Framework",
    icon: Code2,
  },
  ionic: {
    name: "Ionic",
    color: "#3880ff",
    bgColor: "from-blue-500/20 to-indigo-500/20",
    description: "Cross-platform mobile app development framework",
    category: "Mobile Framework",
    icon: Code2,
  },

  // Databases
  mysql: {
    name: "MySQL",
    color: "#00618a",
    bgColor: "from-blue-600/20 to-blue-700/20",
    description: "Open-source relational database management system",
    category: "Database",
    icon: Code2,
  },
  postgresql: {
    name: "PostgreSQL",
    color: "#336791",
    bgColor: "from-blue-600/20 to-indigo-600/20",
    description: "Advanced open source relational database",
    category: "Database",
    icon: Code2,
  },
  mongodb: {
    name: "MongoDB",
    color: "#4db33d",
    bgColor: "from-green-500/20 to-emerald-500/20",
    description: "Document-oriented NoSQL database",
    category: "Database",
    icon: Code2,
  },
  redis: {
    name: "Redis",
    color: "#d82c20",
    bgColor: "from-red-500/20 to-red-600/20",
    description: "In-memory data structure store",
    category: "Cache/Database",
    icon: Code2,
  },
  sqlite: {
    name: "SQLite",
    color: "#003b57",
    bgColor: "from-blue-800/20 to-blue-900/20",
    description: "Self-contained SQL database engine",
    category: "Database",
    icon: Code2,
  },
  firebase: {
    name: "Firebase",
    color: "#ffca28",
    bgColor: "from-yellow-500/20 to-orange-500/20",
    description: "Backend-as-a-Service platform by Google",
    category: "Backend Service",
    icon: Code2,
  },
  supabase: {
    name: "Supabase",
    color: "#3ecf8e",
    bgColor: "from-emerald-500/20 to-green-500/20",
    description: "Open source Firebase alternative",
    category: "Backend Service",
    icon: Code2,
  },

  // DevOps & Tools
  docker: {
    name: "Docker",
    color: "#0db7ed",
    bgColor: "from-cyan-500/20 to-blue-500/20",
    description: "Platform for developing, shipping, and running applications",
    category: "DevOps Tool",
    icon: Code2,
  },
  kubernetes: {
    name: "Kubernetes",
    color: "#326ce5",
    bgColor: "from-blue-500/20 to-indigo-500/20",
    description: "Container orchestration platform",
    category: "DevOps Tool",
    icon: Code2,
  },
  aws: {
    name: "AWS",
    color: "#ff9900",
    bgColor: "from-orange-500/20 to-yellow-500/20",
    description: "Amazon Web Services cloud platform",
    category: "Cloud Platform",
    icon: Code2,
  },
  azure: {
    name: "Azure",
    color: "#0078d4",
    bgColor: "from-blue-500/20 to-blue-600/20",
    description: "Microsoft cloud computing platform",
    category: "Cloud Platform",
    icon: Code2,
  },
  gcp: {
    name: "Google Cloud",
    color: "#4285f4",
    bgColor: "from-blue-500/20 to-blue-600/20",
    description: "Google Cloud Platform",
    category: "Cloud Platform",
    icon: Code2,
  },
  git: {
    name: "Git",
    color: "#f05032",
    bgColor: "from-orange-500/20 to-red-500/20",
    description: "Distributed version control system",
    category: "Version Control",
    icon: Code2,
  },
  cicd: {
    name: "CI/CD",
    color: "#2088ff",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    description: "Continuous Integration and Continuous Deployment",
    category: "DevOps Practice",
    icon: Code2,
  },
  terraform: {
    name: "Terraform",
    color: "#623ce4",
    bgColor: "from-purple-600/20 to-indigo-600/20",
    description: "Infrastructure as Code tool",
    category: "DevOps Tool",
    icon: Code2,
  },
};

const TagPage = () => {
  const { tagName } = useParams();
  const [loading, setLoading] = useState(true);
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");
  const [tagStats, setTagStats] = useState({
    totalSnippets: 0,
    totalViews: 0,
    totalLikes: 0,
    activeUsers: 0,
    weeklyGrowth: 0,
  });
  
  // Ref to prevent multiple simultaneous API calls
  const loadingRef = useRef(false);  const loadedTagRef = useRef(null);

  const currentTag = useMemo(() => {
    return tagMetadata[tagName] || {
      name: tagName?.charAt(0).toUpperCase() + tagName?.slice(1) || "Unknown",
      color: "#64748b",
      bgColor: "from-slate-500/20 to-slate-600/20",
      description: "Explore code snippets and resources",
      category: "General",
      icon: Tag,
    };
  }, [tagName]);
  
  const loadSnippets = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingRef.current || loadedTagRef.current === tagName) {
      return;
    }
    
    try {
      loadingRef.current = true;
      setLoading(true);
      console.log(`Loading snippets for tag: ${tagName}`);
      
      const response = await snippetsAPI.getSnippetsByTag(tagName, 0, 50);
      console.log('TagPage API Response:', response.data);
      
      if (response.data) {
        // Handle paginated response - extract content array
        const snippetsData = response.data.content || response.data;
        
        if (Array.isArray(snippetsData)) {
          setSnippets(snippetsData);
          setFilteredSnippets(snippetsData);
          
          // Calculate stats from real data
          const stats = {
            totalSnippets: response.data.totalElements || snippetsData.length,
            totalViews: snippetsData.reduce((sum, snippet) => sum + (snippet.viewCount || 0), 0),
            totalLikes: snippetsData.reduce((sum, snippet) => sum + (snippet.likeCount || 0), 0),
            activeUsers: new Set(snippetsData.map(snippet => snippet.owner?.username).filter(Boolean)).size,
            weeklyGrowth: Math.floor(Math.random() * 20 + 5), // Mock growth percentage
          };
          setTagStats(stats);
          console.log('TagPage Stats:', stats);
          
          // Mark this tag as loaded
          loadedTagRef.current = tagName;
        } else {
          console.warn('Invalid snippets data format:', snippetsData);
          throw new Error('Invalid data format');
        }
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error(`Failed to load ${tagName} snippets:`, error);
      toast.error(`Failed to load ${tagName} snippets`);
        // Only use fallback if we haven't loaded this tag before
      if (loadedTagRef.current !== tagName) {
        // Get currentTag here to avoid dependency issues
        const fallbackTag = tagMetadata[tagName] || {
          name: tagName?.charAt(0).toUpperCase() + tagName?.slice(1) || "Unknown",
          color: "#64748b",
          bgColor: "from-slate-500/20 to-slate-600/20",
          description: "Explore code snippets and resources",
          category: "General",
          icon: Tag,
        };
        
        // Fallback to mock data only as last resort
        const mockSnippets = generateMockSnippets(tagName, 12, fallbackTag);
        setSnippets(mockSnippets);
        setFilteredSnippets(mockSnippets);
        
        const mockStats = {
          totalSnippets: mockSnippets.length,
          totalViews: mockSnippets.reduce((sum, snippet) => sum + snippet.viewCount, 0),
          totalLikes: mockSnippets.reduce((sum, snippet) => sum + snippet.likeCount, 0),
          activeUsers: new Set(mockSnippets.map(snippet => snippet.owner?.username).filter(Boolean)).size,
          weeklyGrowth: Math.floor(Math.random() * 20 + 5),
        };
        setTagStats(mockStats);
        
        // Mark this tag as loaded even with mock data
        loadedTagRef.current = tagName;
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [tagName]); // Removed currentTag from dependencies to prevent infinite loop

  // Filter and sort snippets
  useEffect(() => {
    let filtered = [...snippets];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort snippets
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "popularity":
          comparison = (b.likeCount + b.viewCount) - (a.likeCount + a.viewCount);
          break;
        case "views":
          comparison = b.viewCount - a.viewCount;
          break;
        case "likes":
          comparison = b.likeCount - a.likeCount;
          break;
        case "newest":
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case "updated":
          comparison = new Date(b.updatedAt) - new Date(a.updatedAt);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "desc" ? comparison : -comparison;
    });

    setFilteredSnippets(filtered);
  }, [snippets, searchTerm, sortBy, sortOrder]);
  useEffect(() => {
    // Reset loading state when tag changes
    if (loadedTagRef.current !== tagName) {
      loadedTagRef.current = null;
      setSnippets([]);
      setFilteredSnippets([]);
      loadSnippets();
    }
  }, [tagName, loadSnippets]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const Icon = currentTag.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center py-20">
          <Loading size="lg" text={`Loading ${currentTag.name} snippets...`} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r opacity-10 rounded-full blur-3xl animate-pulse" 
             style={{ background: `linear-gradient(45deg, ${currentTag.color}40, ${currentTag.color}20)` }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r opacity-10 rounded-full blur-3xl animate-pulse delay-1000"
             style={{ background: `linear-gradient(45deg, ${currentTag.color}20, ${currentTag.color}40)` }}></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}          <div className="mb-8">
            <div className={`bg-gradient-to-r ${currentTag.bgColor} border border-slate-700 rounded-2xl p-8`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: `${currentTag.color}20` }}
                  >
                    <Icon 
                      className="w-12 h-12" 
                      style={{ color: currentTag.color }}
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {currentTag.name}
                    </h1>
                    <p className="text-slate-400 text-lg mb-3">
                      {currentTag.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {currentTag.category}
                      </span>
                      <div className="flex items-center space-x-1 text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          +{tagStats.weeklyGrowth.toFixed(1)}% this week
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(tagStats.totalSnippets)}
                  </div>
                  <div className="text-slate-400 text-sm">Snippets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(tagStats.totalViews)}
                  </div>
                  <div className="text-slate-400 text-sm">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(tagStats.totalLikes)}
                  </div>
                  <div className="text-slate-400 text-sm">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(tagStats.activeUsers)}
                  </div>
                  <div className="text-slate-400 text-sm">Contributors</div>
                </div>              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <Card>
              <Card.Content className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={`Search ${currentTag.name} snippets...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={Search}
                      iconPosition="left"
                      className="bg-slate-800 border-slate-600"
                    />
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="views">Most Viewed</option>
                      <option value="likes">Most Liked</option>
                      <option value="newest">Newest</option>
                      <option value="updated">Recently Updated</option>
                    </select>

                    <button
                      onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      {sortOrder === "desc" ? (
                        <SortDesc className="w-4 h-4" />
                      ) : (
                        <SortAsc className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex items-center space-x-1 bg-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded transition-colors ${
                          viewMode === "grid"
                            ? "bg-cyan-500 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded transition-colors ${
                          viewMode === "list"
                            ? "bg-cyan-500 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <span className="text-slate-400 text-sm">
                    {filteredSnippets.length} snippets found
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </Card.Content>            </Card>
          </div>

          {/* Snippets Grid/List */}
          <div>
            {filteredSnippets.length === 0 ? (
              <Card>
                <Card.Content className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    {searchTerm ? "No snippets found" : "No snippets yet"}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {searchTerm
                      ? `No ${currentTag.name} snippets match your search "${searchTerm}"`
                      : `Be the first to share a ${currentTag.name} snippet!`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = "/create"}
                  >
                    Create New Snippet
                  </Button>
                </Card.Content>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >                {filteredSnippets.map((snippet) => (
                  <div key={snippet.id}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <Card.Header>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: currentTag.color }}
                            />
                            <span className="text-slate-400 text-sm">
                              {currentTag.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{formatNumber(snippet.viewCount)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>{formatNumber(snippet.likeCount)}</span>
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/snippets/${snippet.id}`}
                          className="block hover:text-cyan-400 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {snippet.title}
                          </h3>
                        </Link>

                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                          {snippet.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {snippet.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Link
                              key={tagIndex}
                              to={`/tags/${tag}`}
                              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md text-xs transition-colors"
                            >
                              #{tag}
                            </Link>
                          ))}
                          {snippet.tags.length > 3 && (
                            <span className="text-slate-400 text-xs">
                              +{snippet.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </Card.Header>

                      <Card.Footer>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                                snippet.owner?.username || "anonymous"
                              }`}
                              alt={snippet.owner?.username || "Anonymous"}
                              className="w-6 h-6 rounded-full"
                            />
                            <Link
                              to={`/profile/${snippet.owner?.id}`}
                              className="text-sm text-slate-300 hover:text-white transition-colors"
                            >
                              {snippet.owner?.username || "Anonymous"}
                            </Link>
                          </div>

                          <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(snippet.createdAt)}</span>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card>                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
