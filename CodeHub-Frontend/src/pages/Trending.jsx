import React, { useState, useEffect, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Star,
  Eye,
  Flame,
  ArrowUp,
  ArrowDown,
  Code2,
  GitFork,
  Calendar,
  Filter,
  ChevronDown,
  Trophy,
  Zap,
  Users,
  BarChart3,
  Tag,
} from "lucide-react";
import { Button, Card, Loading } from "../components/ui";
import { SkillBadge, ReputationBadge } from "../components/developers";
import { snippetsAPI, developersAPI, trendingAPI, usersAPI } from "../services/api";
import toast from "react-hot-toast";

const Trending = () => {
  const [activeTab, setActiveTab] = useState("snippets");
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [trendingData, setTrendingData] = useState({
    snippets: [],
    developers: [],
    skills: [],
    languages: [],
  });
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    language: "all",
    sortBy: "most-liked",
  });

  const tabs = [
    {
      id: "snippets",
      label: "Code Snippets",
      icon: Code2,
      description: "Trending code snippets",
    },
    {
      id: "developers",
      label: "Developers",
      icon: Users,
      description: "Rising stars in the community",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Trophy,
      description: "Hot technologies and frameworks",
    },
    {
      id: "languages",
      label: "Languages",
      icon: BarChart3,
      description: "Popular programming languages",
    },
  ];
  const timeRanges = [
    { value: "day", label: "Today", icon: Clock },
    { value: "week", label: "This Week", icon: Calendar },
    { value: "month", label: "This Month", icon: TrendingUp },
    { value: "year", label: "This Year", icon: Flame },
  ];
  // Helper function to get date range for filtering
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7); // Default to week
    }

    return {
      start: startDate.toISOString(),
      end: now.toISOString(),
    };
  }, [timeRange]);

  // Filter function for snippets based on timeRange and language
  const filterSnippets = useCallback(
    (snippets) => {
      if (!snippets || !Array.isArray(snippets)) return [];

      let filtered = [...snippets];      // Filter by language if not 'all'
      if (filters.language && filters.language !== "all") {
        filtered = filtered.filter(
          (snippet) =>
            snippet.language &&
            snippet.language.toLowerCase() === filters.language.toLowerCase()
        );
      }

      // Filter by time range
      const { start } = getDateRange();
      const startTime = new Date(start).getTime();

      filtered = filtered.filter((snippet) => {
        if (!snippet.createdAt) return true; // Keep snippets without date
        const snippetTime = new Date(snippet.createdAt).getTime();
        return snippetTime >= startTime;
      });

      return filtered;
    },
    [filters.language, getDateRange]
  );

  // Define callback functions first
  const loadTrendingSnippets = useCallback(async () => {
    try {
      const sortType =
        filters.sortBy === "most-liked" ? "most-liked" : "most-viewed";
      
      // Try to get trending snippets from trending API first
      let response;      try {
        response = await trendingAPI.getTrendingSnippets(sortType, timeRange, 0, 50);
      } catch (trendingError) {
        console.log('Trending API failed, fallback to regular snippets:', trendingError);
        // Fallback to regular snippets API if trending API fails
        response = await snippetsAPI.getSnippets(0, 50, sortType === 'most-liked' ? 'likeCount,desc' : 'viewCount,desc');
      }

      if (response.data) {
        // Handle both paginated and non-paginated responses
        const snippets = response.data.content || response.data;
        if (Array.isArray(snippets)) {
          const filteredSnippets = filterSnippets(snippets);
          setTrendingData((prev) => ({
            ...prev,
            snippets: filteredSnippets.slice(0, 20), // Limit to 20 after filtering
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load trending snippets:", error);
      toast.error("Failed to load trending snippets");
    }
  }, [filters.sortBy, filterSnippets, timeRange]);  const loadTrendingDevelopers = useCallback(async () => {
    try {
      // Try trending developers API first
      let response;
      try {
        response = await trendingAPI.getTrendingDevelopers(timeRange, 15);
      } catch (trendingError) {
        console.log("Trending developers API failed, fallback to regular users:", trendingError);
        // Fallback to regular users API
        response = await developersAPI.getDevelopers({ 
          page: 0, 
          size: 15, 
          sortBy: 'reputation,desc' 
        });
      }

      if (response.data) {
        // Handle both direct array and paginated responses
        const developers = response.data.content || response.data;
        if (Array.isArray(developers)) {          // Load stats for each developer
          const developersWithStats = await Promise.all(
            developers.slice(0, 15).map(async (developer) => {
              try {
                const statsResponse = await usersAPI.getUserStats(developer.id);
                return {
                  ...developer,
                  followersCount: statsResponse.data.followersCount || 0,
                  followingCount: statsResponse.data.followingCount || 0,
                  snippetsCount: statsResponse.data.snippetsCount || developer.snippetsCount || 0
                };
              } catch (error) {
                console.error(`Failed to load stats for developer ${developer.id}:`, error);
                return {
                  ...developer,
                  followersCount: 0,
                  followingCount: 0,
                  snippetsCount: developer.snippetsCount || 0
                };
              }
            })
          );

          setTrendingData((prev) => ({
            ...prev,
            developers: developersWithStats,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load trending developers:", error);
      toast.error("Failed to load trending developers");
    }
  }, [timeRange]);
  const loadTrendingSkills = useCallback(async () => {
    try {
      // Try trending skills API first
      let response;
      try {
        response = await trendingAPI.getTrendingSkills(timeRange, 15);
      } catch (trendingError) {
        console.log("Trending skills API failed, fallback to developers API:", trendingError);
        // Fallback to developers trending skills API
        response = await developersAPI.getTrendingSkills();
      }

      if (response.data) {
        const skills = Array.isArray(response.data) ? response.data : response.data.content || [];
        setTrendingData((prev) => ({
          ...prev,
          skills: skills.slice(0, 15),
        }));
      }
    } catch (error) {
      console.error("Failed to load trending skills:", error);
      // Create fallback skills data
      const fallbackSkills = [
        { name: "JavaScript", count: 145, growthRate: 12.5, category: "Frontend" },
        { name: "React", count: 98, growthRate: 18.3, category: "Frontend" },
        { name: "Python", count: 87, growthRate: 15.7, category: "Backend" },
        { name: "Node.js", count: 76, growthRate: 9.2, category: "Backend" },
        { name: "TypeScript", count: 65, growthRate: 22.1, category: "Frontend" },
        { name: "Java", count: 54, growthRate: 5.8, category: "Backend" },
        { name: "CSS", count: 43, growthRate: 8.4, category: "Frontend" },
        { name: "Docker", count: 38, growthRate: 14.6, category: "DevOps" },
        { name: "MongoDB", count: 32, growthRate: 11.3, category: "Database" },
        { name: "Vue.js", count: 28, growthRate: 16.9, category: "Frontend" }
      ];
      
      setTrendingData((prev) => ({
        ...prev,
        skills: fallbackSkills,
      }));
      toast.error("Failed to load trending skills, showing fallback data");
    }  }, [timeRange]);

  const loadTrendingLanguages = useCallback(async () => {
    try {
      // Try trending languages API first
      let response;
      try {
        response = await trendingAPI.getTrendingLanguages(timeRange, 15);
        console.log('📊 [Trending] Trending languages API response:', response);
      } catch (trendingError) {
        console.log("Trending languages API failed, fallback to regular languages:", trendingError);
        // Fallback to regular languages API
        response = await snippetsAPI.getLanguages();
      }

      if (response.data) {
        let languagesData = [];
        
        // Check if it's trending API response (with full language objects)
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].rank) {
          // Trending API response with full language objects
          languagesData = response.data.map(lang => ({
            name: lang.name || lang.displayName,
            snippetCount: lang.snippetCount || 0,
            growthRate: lang.growthRate || 0,
            rank: lang.rank || 1,
            previousRank: lang.previousRank || 1,
            weeklyGrowth: lang.weeklyGrowth || 0,
            marketShare: lang.marketShare || 0,
            category: lang.category || 'General',
            isRising: lang.isRising || false,
            color: lang.color || getLanguageColor(lang.name)
          }));
        } else {
          // Fallback: Regular languages API response
          let languages = [];
          if (Array.isArray(response.data)) {
            if (response.data.length > 0 && typeof response.data[0] === 'object') {
              languages = response.data.map((lang) => lang.name).filter(Boolean);
            } else if (response.data.length > 0 && typeof response.data[0] === 'string') {
              languages = response.data.filter(Boolean);
            }
          }
          
          // Update available languages for filter dropdown
          if (languages.length > 0) {
            setAvailableLanguages(languages);
          }

          // Create trending data from regular languages
          languagesData = (response.data || []).map((lang, index) => ({
            name: typeof lang === 'string' ? lang : lang.name,
            snippetCount: typeof lang === 'object' ? (lang.count || Math.floor(Math.random() * 500 + 100)) : Math.floor(Math.random() * 500 + 100),
            growthRate: Math.random() * 30 - 10, // Random growth rate between -10% and 20%
            rank: index + 1,
            previousRank: index + Math.floor(Math.random() * 3) - 1,
            weeklyGrowth: Math.floor(Math.random() * 100),
            marketShare: Math.random() * 20,
            category: 'General',
            isRising: Math.random() > 0.5,
            color: getLanguageColor(typeof lang === 'string' ? lang : lang.name)
          }));
        }

        setTrendingData((prev) => ({
          ...prev,
          languages: languagesData.slice(0, 15),
        }));
      }
    } catch (error) {
      console.error("Failed to load trending languages:", error);
      toast.error("Failed to load trending languages");
      
      // Fallback data if all APIs fail
      const fallbackLanguages = [
        { name: "JavaScript", snippetCount: 2340, growthRate: 15.5, rank: 1, previousRank: 1, weeklyGrowth: 156, marketShare: 23.4, category: "Frontend", isRising: true },
        { name: "Python", snippetCount: 1890, growthRate: 12.3, rank: 2, previousRank: 3, weeklyGrowth: 123, marketShare: 18.9, category: "Backend", isRising: true },
        { name: "TypeScript", snippetCount: 1456, growthRate: 22.1, rank: 3, previousRank: 4, weeklyGrowth: 98, marketShare: 14.6, category: "Frontend", isRising: true },
        { name: "Java", snippetCount: 1234, growthRate: 8.7, rank: 4, previousRank: 2, weeklyGrowth: 67, marketShare: 12.3, category: "Backend", isRising: false },
        { name: "Go", snippetCount: 892, growthRate: 18.9, rank: 5, previousRank: 7, weeklyGrowth: 89, marketShare: 8.9, category: "Backend", isRising: true }
      ].map(lang => ({ ...lang, color: getLanguageColor(lang.name), isRising: lang.growthRate > 0 }));
      
      setTrendingData((prev) => ({
        ...prev,
        languages: fallbackLanguages,
      }));
    }
  }, [timeRange]);

  const loadTrendingData = useCallback(async () => {
    try {
      setLoading(true);

      switch (activeTab) {
        case "snippets":
          await loadTrendingSnippets();
          break;
        case "developers":
          await loadTrendingDevelopers();
          break;
        case "skills":
          await loadTrendingSkills();
          break;
        case "languages":
          await loadTrendingLanguages();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Failed to load trending data:", error);
      toast.error("Failed to load trending data");
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    loadTrendingSnippets,
    loadTrendingDevelopers,
    loadTrendingSkills,
    loadTrendingLanguages,
  ]);
  // useEffect to load data when component mounts or filters change
  useEffect(() => {
    loadTrendingData();
  }, [loadTrendingData]);
  // useEffect to reload data when timeRange or filters change
  useEffect(() => {
    loadTrendingData();
  }, [timeRange, filters, loadTrendingData]);
  // useEffect to load available languages for filter dropdown
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        console.log('Loading languages for filter dropdown...');
        const response = await snippetsAPI.getLanguages();
        console.log('Languages API response:', response);
        
        if (response.data) {
          console.log('Response data:', response.data);
          
          // Handle different response formats
          let languages = [];
          if (Array.isArray(response.data)) {
            // If response.data is array of objects with 'name' property
            if (response.data.length > 0 && typeof response.data[0] === 'object') {
              languages = response.data.map((lang) => lang.name).filter(Boolean);
            } 
            // If response.data is array of strings
            else if (response.data.length > 0 && typeof response.data[0] === 'string') {
              languages = response.data.filter(Boolean);
            }
          }
          
          console.log('Processed languages:', languages);
          
          // If no languages from API, use some default ones
          if (languages.length === 0) {
            console.log('No languages from API, using defaults');
            languages = [
              'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 
              'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'HTML', 
              'CSS', 'SQL', 'Shell', 'PowerShell', 'R', 'MATLAB', 'Perl'
            ];
          }
          
          setAvailableLanguages(languages);
          console.log('Set available languages:', languages);
        }
      } catch (error) {
        console.error("Failed to load languages for filter:", error);
        
        // Fallback to default languages if API fails
        const defaultLanguages = [
          'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 
          'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'HTML', 
          'CSS', 'SQL', 'Shell', 'PowerShell', 'R', 'MATLAB', 'Perl'
        ];
        setAvailableLanguages(defaultLanguages);
        console.log('Using fallback languages:', defaultLanguages);
      }
    };

    loadLanguages();
  }, []);

  const renderTrendingSnippets = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <Card.Content className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-300">
                Sort by:
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                <option value="most-liked">Most Liked</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>{" "}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-slate-300">
                Language:
              </label>
              <select
                value={filters.language}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, language: e.target.value }))
                }
                className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm"
              >
                <option value="all">All Languages</option>                {availableLanguages.filter(Boolean).map((language) => (
                  <option key={language} value={language.toLowerCase()}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            {/* Active Filters Display */}
            <div className="flex items-center space-x-2">
              {timeRange !== "week" && (
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs">
                  {timeRanges.find((r) => r.value === timeRange)?.label}
                </span>
              )}
              {filters.language !== "all" && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs">                  {availableLanguages.find(
                    (lang) => lang && lang.toLowerCase() === filters.language
                  ) || filters.language}
                </span>
              )}
              {(timeRange !== "week" ||
                filters.language !== "all" ||
                filters.sortBy !== "most-liked") && (
                <button
                  onClick={() => {
                    setTimeRange("week");
                    setFilters({
                      category: "all",
                      language: "all",
                      sortBy: "most-liked",
                    });
                  }}
                  className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-md text-xs transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Trending Snippets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trendingData.snippets.map((snippet, index) => (
          <motion.div
            key={snippet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Card.Header>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        #{index + 1}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getLanguageColor(snippet.language),
                        }}
                      />
                      <span className="text-slate-400">{snippet.language}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{snippet.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{snippet.likeCount || 0}</span>
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
                {snippet.tags && snippet.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {snippet.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700 text-slate-300 rounded-md text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {snippet.tags.length > 3 && (
                      <span className="text-slate-400 text-xs">
                        +{snippet.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
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
                      to={`/users/${snippet.owner?.username}`}
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
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
  const renderTrendingDevelopers = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 equal-height-grid">
        {trendingData.developers.map((developer, index) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col">
              <Card.Header className="developer-card-header">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        developer.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer.username}`
                      }
                      alt={developer.username}
                      className="w-16 h-16 rounded-full border-4 border-slate-700 dark:border-slate-700 light:border-gray-300"
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <Link
                      to={`/users/${developer.username}`}
                      className="block hover:text-cyan-400 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">
                        {developer.fullName || developer.username}
                      </h3>
                    </Link>
                    <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm">
                      @{developer.username}
                    </p>
                    {developer.location && (
                      <p className="text-slate-500 dark:text-slate-500 light:text-gray-500 text-xs">
                        {developer.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="developer-bio-section mt-3">
                  {developer.bio ? (
                    <p className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-sm line-clamp-2">
                      {developer.bio}
                    </p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-500 light:text-gray-500 text-sm italic">
                      No bio available
                    </p>
                  )}
                </div>
              </Card.Header>

              <Card.Content className="developer-card-content">
                <div className="space-y-3 h-full flex flex-col">
                  {/* Stats */}                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-white dark:text-white light:text-gray-900 font-semibold">
                        {developer.followersCount || 0}
                      </div>
                      <div className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-xs">Followers</div>
                    </div>
                    <div>
                      <div className="text-white dark:text-white light:text-gray-900 font-semibold">
                        {developer.snippetsCount || 0}
                      </div>
                      <div className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-xs">Snippets</div>
                    </div>
                    <div>
                      <div className="text-white dark:text-white light:text-gray-900 font-semibold">
                        {(developer.reputation || 0).toFixed(2)}
                      </div>
                      <div className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-xs">Reputation</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="developer-skills-section">
                    <div className="min-h-[2rem] flex items-center">
                      {developer.skills && developer.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {developer.skills.slice(0, 3).map((skill, skillIndex) => (
                            <SkillBadge key={skillIndex} skill={skill} size="sm" />
                          ))}
                          {developer.skills.length > 3 && (
                            <span className="text-slate-400 dark:text-slate-400 light:text-gray-600 text-xs px-2 py-1">
                              +{developer.skills.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-500 light:text-gray-500 text-xs italic">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer className="developer-card-footer">
                <div className="flex items-center justify-between">
                  <ReputationBadge reputation={developer.reputation || 0} />

                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm font-medium">
                      +{Math.floor(Math.random() * 50)}%
                    </span>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTrendingSkills = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingData.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        #{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {skill.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: skill.hotness || 3 }, (_, i) => (
                      <Flame key={i} className="w-4 h-4 text-orange-500" />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Usage Count</span>
                    <span className="text-white font-semibold">
                      {skill.count || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Growth Rate</span>
                    <div className="flex items-center space-x-1">
                      {(skill.growthRate || 0) >= 0 ? (
                        <ArrowUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`font-semibold ${
                          (skill.growthRate || 0) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {Math.abs(skill.growthRate || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Category</span>
                    <span className="text-cyan-400 font-medium">
                      {skill.category || "General"}
                    </span>
                  </div>

                  {/* Progress bar for popularity */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Popularity</span>
                      <span>
                        {(((skill.count || 0) / 1000) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((skill.count || 0) / 1000) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTrendingLanguages = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trendingData.languages.map((language, index) => (
          <motion.div
            key={language.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: getLanguageColor(language.name),
                      }}
                    />
                    <h3 className="text-lg font-bold text-white">
                      {language.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      #{language.rank}
                    </span>
                    {language.rank < language.previousRank && (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    )}
                    {language.rank > language.previousRank && (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {language.snippetCount}
                    </div>
                    <div className="text-slate-400 text-sm">Snippets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      +{language.weeklyGrowth}
                    </div>
                    <div className="text-slate-400 text-sm">This Week</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Growth Rate</span>
                    <div className="flex items-center space-x-1">
                      {language.growthRate >= 0 ? (
                        <ArrowUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-500" />
                      )}
                      <span
                        className={`font-semibold ${
                          language.growthRate >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {Math.abs(language.growthRate).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Market share visualization */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Market Share</span>
                      <span>
                        {((language.snippetCount / 5000) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            (language.snippetCount / 5000) * 100,
                            100
                          )}%`,
                          backgroundColor: getLanguageColor(language.name),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" text={`Loading trending ${activeTab}...`} />
        </div>
      );
    }

    switch (activeTab) {
      case "snippets":
        return renderTrendingSnippets();
      case "developers":
        return renderTrendingDevelopers();
      case "skills":
        return renderTrendingSkills();
      case "languages":
        return renderTrendingLanguages();
      default:
        return null;
    }
  };
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "#f7df1e",
      TypeScript: "#3178c6",
      Python: "#3776ab",
      Java: "#ed8b00",
      "C++": "#00599c",
      Go: "#00add8",
      Rust: "#000000",
      PHP: "#777bb4",
      Ruby: "#cc342d",
      Swift: "#fa7343",
      Kotlin: "#7f52ff",
      "C#": "#239120",
      HTML: "#e34f26",
      CSS: "#1572b6",
      React: "#61dafb",
      Vue: "#4fc08d",
      Angular: "#dd0031",
      // Additional languages
      C: "#555555",
      Dart: "#0175c2",
      Scala: "#dc322f",
      Elixir: "#6e4a7e",
      Haskell: "#5e5086",
      Clojure: "#5881d8",
      Erlang: "#b83998",
      R: "#276dc3",
      MATLAB: "#e16737",
      Perl: "#39457e",
      Shell: "#89e051",
      Bash: "#89e051",
      PowerShell: "#5391fe",
      Assembly: "#6e4c13",
      Objective_C: "#438eff",
      "Objective-C": "#438eff",
      Groovy: "#e69f56",
      Lua: "#000080",
      Julia: "#9558b2",
      F_Sharp: "#b845fc",
      "F#": "#b845fc",
      VB_NET: "#945db7",
      "VB.NET": "#945db7",
      Delphi: "#cc342d",
      Pascal: "#e3f171",
      COBOL: "#2c5aa0",
      Fortran: "#734f96",
      Ada: "#02f88c",
      Prolog: "#74283c",
      Lisp: "#3fb68b",
      Scheme: "#1e4aec",
      ML: "#dc566d",
      OCaml: "#3be133",
      Nim: "#ffc200",
      Crystal: "#000100",
      Zig: "#ec915c",
      Solidity: "#aa6746",
      VHDL: "#adb2cb",
      Verilog: "#b2b7f8",
      ActionScript: "#882b0f",
      CoffeeScript: "#244776",
      LiveScript: "#499886",
      PureScript: "#1d222d",
      Elm: "#60b5cc",
      ReScript: "#ed5051",
      Reason: "#ff5847",
      Racket: "#3c5caa",
      Common_Lisp: "#3fb68b",
      "Common Lisp": "#3fb68b",
      D: "#ba595e",
      Haxe: "#df7900",
      Nix: "#7e7eff",
      Tcl: "#e4cc98",
      XSLT: "#eb8ceb",
      PostScript: "#da291c",
      APL: "#5a8164",
      J: "#9eedff",
      Q: "#0040cd",
      SQL: "#336791",
      MySQL: "#00618a",
      PostgreSQL: "#336791",
      SQLite: "#003b57",
      MongoDB: "#4db33d",
      Redis: "#d82c20",
      JSON: "#292929",
      XML: "#0060ac",
      YAML: "#cb171e",
      TOML: "#9c4221",
      INI: "#d1dae3",
      CSV: "#0d7377",
      Markdown: "#083fa1",
      LaTeX: "#3d6117",
      Dockerfile: "#384d54",
      Makefile: "#427819",
      CMake: "#064f8c",
      Gradle: "#02303a",
      Maven: "#c71a36",
      Ant: "#a9157e",
      Bazel: "#76d275",
      // Web Technologies
      SCSS: "#c6538c",
      Sass: "#a53b70",
      Less: "#1d365d",
      Stylus: "#ff6347",
      JSX: "#f7df1e",
      TSX: "#3178c6",
      Svelte: "#ff3e00",
      Astro: "#ff5d01",
      Remix: "#000000",
      Next_js: "#000000",
      "Next.js": "#000000",
      Nuxt_js: "#00dc82",
      "Nuxt.js": "#00dc82",
      Gatsby: "#663399",
      Express: "#000000",
      Koa: "#33333d",
      Fastify: "#000000",
      NestJS: "#e0234e",
      Django: "#092e20",
      Flask: "#000000",
      FastAPI: "#009688",
      Rails: "#cc0000",
      Sinatra: "#000000",
      Spring: "#6db33f",
      Laravel: "#ff2d20",
      Symfony: "#000000",
      CodeIgniter: "#ee4323",
      CakePHP: "#d33c43",
      Yii: "#0073bb",
      Zend: "#68b604",
      // Mobile Development
      Android: "#3ddc84",
      iOS: "#000000",
      Flutter: "#02569b",
      "React Native": "#61dafb",
      Ionic: "#3880ff",
      Xamarin: "#3498db",
      Cordova: "#35434f",
      PhoneGap: "#00adef",
      // Game Development
      Unity: "#000000",
      "Unreal Engine": "#313131",
      Godot: "#478cbf",
      // Data Science & AI
      Jupyter: "#f37626",
      TensorFlow: "#ff6f00",
      PyTorch: "#ee4c2c",
      Keras: "#d00000",
      Scikit_learn: "#f7931e",
      "Scikit-learn": "#f7931e",
      Pandas: "#150458",
      NumPy: "#013243",
      Matplotlib: "#11557c",
      Seaborn: "#3776ab",
      Plotly: "#3f4f75",
      Tableau: "#e97627",
      "Power BI": "#f2c811",
      Apache_Spark: "#e25a1c",
      "Apache Spark": "#e25a1c",
      Hadoop: "#66ccff",
    };
    return colors[language] || "#64748b";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Trending
              </h1>
            </div>
            <p className="text-xl text-slate-400 dark:text-slate-400 light:text-gray-600 max-w-2xl mx-auto">
              Discover what's hot in the CodeHub community right now
            </p>
          </motion.div>

          {/* Time Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
              {timeRanges.map((range) => {
                const Icon = range.icon;
                return (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                      timeRange === range.value
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{range.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative p-6 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50"
                        : "bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-center">
                      <Icon
                        className={`w-8 h-8 mx-auto mb-3 ${
                          activeTab === tab.id
                            ? "text-cyan-400"
                            : "text-slate-400"
                        }`}
                      />
                      <h3
                        className={`font-semibold mb-1 ${
                          activeTab === tab.id ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {tab.label}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {tab.description}
                      </p>
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
