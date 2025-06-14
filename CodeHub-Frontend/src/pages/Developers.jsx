import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MapPin,
  Code,
  GitBranch,
  Star,
  Trophy,
  TrendingUp,
  Calendar,
  Globe,
  Mail,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  ChevronDown,
  Heart,
  MessageSquare,
  Eye,
  Award,
  Target,
  Zap,
  Coffee,
  BookOpen,
  Settings,
  Grid,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  DeveloperCard,
  DeveloperGrid,
  DeveloperList,
  DeveloperFilters,
  DeveloperSearch,
  FeaturedDevelopers,
  CommunityStats,
} from "../components/developers";
import { Button, Card, Loading, Input } from "../components/ui";
import { developersAPI } from "../services/api";
import toast from "react-hot-toast";

const Developers = () => {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    skills: [],
    location: "",
    experience: "",
    availability: "",
    sortBy: "reputation",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [communityStats, setCommunityStats] = useState(null);
  const [featuredDevelopers, setFeaturedDevelopers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
  });
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          loadDevelopers(),
          loadCommunityStats(),
          loadFeaturedDevelopers(),
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and search effects
  useEffect(() => {
    filterDevelopers();
  }, [developers, searchTerm, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDevelopers = async (page = 0) => {
    try {
      setLoading(true);
      const response = await developersAPI.getDevelopers({
        page,
        size: pagination.size,
        ...filters,
      });

      if (page === 0) {
        setDevelopers(response.data.content || []);
      } else {
        setDevelopers((prev) => [...prev, ...(response.data.content || [])]);
      }

      setPagination((prev) => ({
        ...prev,
        page: response.data.number || 0,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (error) {
      console.error("Failed to load developers:", error);
      toast.error("Failed to load developers");
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityStats = async () => {
    try {
      const response = await developersAPI.getCommunityStats();
      setCommunityStats(response.data);
    } catch (error) {
      console.error("Failed to load community stats:", error);
    }
  };

  const loadFeaturedDevelopers = async () => {
    try {
      const response = await developersAPI.getFeaturedDevelopers();
      setFeaturedDevelopers(response.data || []);
    } catch (error) {
      console.error("Failed to load featured developers:", error);
    }
  };

  const filterDevelopers = () => {
    let filtered = [...developers];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (dev) =>
          dev.username?.toLowerCase().includes(search) ||
          dev.fullName?.toLowerCase().includes(search) ||
          dev.bio?.toLowerCase().includes(search) ||
          dev.skills?.some((skill) => skill.toLowerCase().includes(search))
      );
    }

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((dev) =>
        filters.skills.some((skill) =>
          dev.skills?.some((devSkill) =>
            devSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((dev) =>
        dev.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter((dev) => {
        const exp = dev.experience || 0;
        switch (filters.experience) {
          case "junior":
            return exp <= 2;
          case "mid":
            return exp > 2 && exp <= 5;
          case "senior":
            return exp > 5;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "reputation":
          return (b.reputation || 0) - (a.reputation || 0);
        case "contributions":
          return (b.contributions || 0) - (a.contributions || 0);
        case "followers":
          return (b.followers || 0) - (a.followers || 0);
        case "name":
          return (a.fullName || a.username || "").localeCompare(
            b.fullName || b.username || ""
          );
        case "newest":
          return new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0);
        default:
          return 0;
      }
    });

    setFilteredDevelopers(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleDeveloperClick = (developer) => {
    setSelectedDeveloper(developer);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages - 1) {
      loadDevelopers(pagination.page + 1);
    }
  };

  if (loading && developers.length === 0) {
    return <Loading type="spinner" size="lg" text="Loading developers..." />;
  }
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
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Developers
                </h1>
              </div>
              <p className="text-xl text-slate-400 dark:text-slate-400 light:text-gray-600 max-w-2xl mx-auto">
                Discover talented developers, connect with peers, and build
                amazing things together
              </p>
            </div>

            {/* Community Stats */}
            {communityStats && <CommunityStats stats={communityStats} />}
          </motion.div>

          {/* Featured Developers */}
          {featuredDevelopers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <FeaturedDevelopers
                developers={featuredDevelopers}
                onDeveloperClick={handleDeveloperClick}
              />
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <DeveloperSearch
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
              <div>
                <DeveloperFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Developers List/Grid */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {viewMode === "grid" ? (
                  <DeveloperGrid
                    developers={filteredDevelopers}
                    onDeveloperClick={handleDeveloperClick}
                    onLoadMore={handleLoadMore}
                    hasMore={pagination.page < pagination.totalPages - 1}
                    loading={loading}
                  />
                ) : (
                  <DeveloperList
                    developers={filteredDevelopers}
                    onDeveloperClick={handleDeveloperClick}
                    onLoadMore={handleLoadMore}
                    hasMore={pagination.page < pagination.totalPages - 1}
                    loading={loading}
                  />
                )}
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Developers;
