import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  GitFork, 
  Clock,
  Code2,
  TrendingUp,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Card, Loading } from '../components/ui';
import { snippetsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const searchTimeoutRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const languages = [
    'All',
    'JavaScript',
    'Python',
    'TypeScript',
    'Java',
    'CSS',
    'PHP',
    'Go',
    'Rust',
    'C++',
    'Ruby'
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'newest', label: 'Newest', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: Star },
    { value: 'viewed', label: 'Most Viewed', icon: Eye }
  ];

  useEffect(() => {
    const loadSnippets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (debouncedSearchTerm.trim()) {
          // Search snippets if there's a search term
          response = await snippetsAPI.searchSnippets(debouncedSearchTerm, pagination.page, pagination.size);
        } else if (sortBy === 'trending') {
          // Get trending snippets
          response = await snippetsAPI.getTrendingSnippets('most-liked', pagination.page, pagination.size);
        } else {
          // Get all snippets with sorting
          let sort = 'createdAt,desc'; // default sort
          if (sortBy === 'newest') sort = 'createdAt,desc';
          else if (sortBy === 'oldest') sort = 'createdAt,asc';
          else if (sortBy === 'liked') sort = 'likesCount,desc';
          else if (sortBy === 'viewed') sort = 'viewsCount,desc';
          
          response = await snippetsAPI.getSnippets(pagination.page, pagination.size, sort);
        }

        if (response.data) {
          const { content, totalElements, totalPages, number } = response.data;
          setSnippets(content || []);
          setPagination(prev => ({
            ...prev,
            totalElements,
            totalPages,
            page: number
          }));
        }
      } catch (error) {
        console.error('Error loading snippets:', error);
        setError('Failed to load snippets. Please try again.');
        toast.error('Failed to load snippets');
      } finally {
        setLoading(false);
      }
    };

    loadSnippets();
  }, [debouncedSearchTerm, sortBy, pagination.page, pagination.size]);

  const filteredSnippets = snippets.filter(snippet => {
    // Only filter by language on the client side, search is handled by API
    const matchesLanguage = selectedLanguage === 'all' || 
                           snippet.language?.toLowerCase() === selectedLanguage.toLowerCase();
    
    return matchesLanguage;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading type="spinner" size="lg" text="Loading code snippets..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="text-red-400 mb-4">
                <Code2 className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Snippets</h2>
              <p className="text-slate-400 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Code Snippets
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Discover and share useful code snippets with the developer community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search snippets, tags, or languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-white px-4 py-2 pr-8 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-white px-4 py-2 pr-8 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date Range
                  </label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg">
                    <option>All time</option>
                    <option>Last week</option>
                    <option>Last month</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Minimum Stars
                  </label>
                  <Input type="number" placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tags
                  </label>
                  <Input placeholder="Enter tags..." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing {filteredSnippets.length} of {snippets.length} snippets
          </p>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="hover:-translate-y-1 transition-transform duration-300">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-700">
                <Card.Header>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: snippet.languageColor || '#64748b' }}
                      ></div>
                      <span className="text-sm text-slate-400">{snippet.language}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{snippet.viewsCount || snippet.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{snippet.likesCount || snippet.stars || 0}</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/snippets/${snippet.id}`}
                    className="block hover:text-cyan-400 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {snippet.title}
                    </h3>
                  </Link>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {snippet.description}
                  </p>
                </Card.Header>

                <Card.Content>
                  {/* Code Preview */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 mb-4 overflow-hidden">
                    <pre className="text-xs text-slate-300 line-clamp-4 overflow-hidden">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags && snippet.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded-md hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {snippet.tags && snippet.tags.length > 4 && (
                      <span className="px-2 py-1 bg-slate-700 text-xs text-slate-400 rounded-md">
                        +{snippet.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </Card.Content>

                <Card.Footer>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={snippet.author?.avatar || snippet.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${snippet.author?.username || snippet.author || 'user'}`}
                        alt={snippet.author?.username || snippet.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <Link 
                          to={`/users/${snippet.author?.username || snippet.author}`}
                          className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                        >
                          {snippet.author?.username || snippet.author}
                        </Link>
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(snippet.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="p-2">
                        <GitFork className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredSnippets.length > 0 && pagination.page < pagination.totalPages - 1 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page + 1 }));
              }}
            >
              Load More Snippets
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredSnippets.length === 0 && !loading && (
          <div className="text-center py-12">
            <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No snippets found
            </h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search criteria or browse all snippets
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedLanguage('all');
              setPagination(prev => ({ ...prev, page: 0 }));
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippets;
