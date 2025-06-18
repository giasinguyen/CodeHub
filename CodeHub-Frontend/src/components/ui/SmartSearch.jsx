import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Hash,
  Code2,
  User,
  Filter,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { snippetsAPI, usersAPI } from '../../services/api';
import { debounce } from '../../utils/debounce';

const SmartSearch = ({ 
  className = '', 
  placeholder = 'Search snippets, users, tags...', 
  size = 'md',
  showFilters = true,
  onClose 
}) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    snippets: [],
    users: [],
    tags: [],
    languages: []
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Helper functions
  const extractTags = useCallback((snippets) => {
    const tagCounts = {};
    snippets.forEach(snippet => {
      (snippet.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([tag, count]) => ({ name: tag, count, type: 'tag' }));
  }, []);

  const extractLanguages = useCallback((snippets) => {
    const langCounts = {};
    snippets.forEach(snippet => {
      if (snippet.language) {
        langCounts[snippet.language] = (langCounts[snippet.language] || 0) + 1;
      }
    });
    return Object.entries(langCounts)
      .sort(([,a], [,b]) => b - a)      .map(([language, count]) => ({ name: language, count, type: 'language' }));
  }, []);

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  };

  const loadTrendingSearches = async () => {
    try {
      // Mock trending searches - in real app, this would come from API
      const trending = [
        { query: 'React hooks', count: 1250, type: 'snippet' },
        { query: 'Python automation', count: 980, type: 'snippet' },
        { query: 'TypeScript interfaces', count: 870, type: 'snippet' },
        { query: 'CSS animations', count: 650, type: 'snippet' },
        { query: 'Node.js API', count: 540, type: 'snippet' }
      ];
      setTrendingSearches(trending);
    } catch (error) {
      console.error('Error loading trending searches:', error);
    }
  };
  const saveToRecentSearches = useCallback((query) => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const filtered = recent.filter(item => item.query !== query);
    const newRecent = [{ query, timestamp: Date.now() }, ...filtered].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    setRecentSearches(newRecent.slice(0, 5));
  }, []);

  // Load search history and trending searches
  useEffect(() => {
    loadRecentSearches();
    loadTrendingSearches();
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Keyboard navigation
  const getAllResults = useCallback(() => {
    const results = [];
    
    if (query.trim()) {
      // Add main search option
      results.push({ type: 'search', query, label: `Search for "${query}"` });
      
      // Add filtered results
      if (selectedFilter === 'all' || selectedFilter === 'snippets') {
        results.push(...searchResults.snippets.map(item => ({ ...item, type: 'snippet' })));
      }
      if (selectedFilter === 'all' || selectedFilter === 'users') {
        results.push(...searchResults.users.map(item => ({ ...item, type: 'user' })));
      }
      if (selectedFilter === 'all' || selectedFilter === 'tags') {
        results.push(...searchResults.tags);
      }
      if (selectedFilter === 'all' || selectedFilter === 'languages') {
        results.push(...searchResults.languages);
      }
    } else {
      // Show recent and trending when no query
      results.push(...recentSearches.map(item => ({ ...item, type: 'recent' })));
      results.push(...trendingSearches.slice(0, 3).map(item => ({ ...item, type: 'trending' })));
    }
    
    return results;
  }, [query, selectedFilter, searchResults, recentSearches, trendingSearches]);

  const handleSearch = useCallback((searchQuery) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;    // Save to recent searches
    saveToRecentSearches(queryToSearch);
    
    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(queryToSearch)}&filter=${selectedFilter}`);
    
    // Close search and clear
    setIsOpen(false);
    setQuery('');
    onClose?.();
  }, [query, selectedFilter, navigate, saveToRecentSearches, onClose]);
  const handleResultClick = useCallback((result) => {
    switch (result.type) {
      case 'search':
        handleSearch(result.query);
        break;
      case 'snippet':
        navigate(`/snippets/${result.id}`);
        saveToRecentSearches(result.title);
        break;
      case 'user':
        navigate(`/developers/${result.id}`);
        saveToRecentSearches(result.username);
        break;
      case 'tag':
        navigate(`/tags/${encodeURIComponent(result.name)}`);
        saveToRecentSearches(result.name);
        break;
      case 'language':
        navigate(`/snippets?language=${encodeURIComponent(result.name)}`);
        saveToRecentSearches(result.name);
        break;
      case 'recent':
      case 'trending':
        setQuery(result.query);
        handleSearch(result.query);
        break;
    }
      setIsOpen(false);
    setQuery('');
    onClose?.();
  }, [navigate, handleSearch, saveToRecentSearches, onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      const allResults = getAllResults();
      const maxIndex = allResults.length - 1;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && allResults[focusedIndex]) {
            handleResultClick(allResults[focusedIndex]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          setFocusedIndex(-1);
          break;
      }
    };    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, query, getAllResults, handleResultClick, handleSearch]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults({ snippets: [], users: [], tags: [], languages: [] });
      return;
    }

    setIsLoading(true);
    try {
      const [snippetsRes, usersRes] = await Promise.allSettled([
        snippetsAPI.searchSnippets(searchQuery, 0, 5),
        usersAPI.searchByUsername(searchQuery)
      ]);

      // Process results
      const snippets = snippetsRes.status === 'fulfilled' 
        ? (snippetsRes.value.data?.content || []).slice(0, 5)
        : [];
      
      const users = usersRes.status === 'fulfilled'
        ? (Array.isArray(usersRes.value.data) ? usersRes.value.data : []).slice(0, 3)
        : [];

      // Extract popular tags and languages
      const tags = extractTags(snippets).slice(0, 4);
      const languages = extractLanguages(snippets).slice(0, 4);

      setSearchResults({ snippets, users, tags, languages });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ snippets: [], users: [], tags: [], languages: [] });
    } finally {
      setIsLoading(false);
    }
  }, [extractTags, extractLanguages]);
  const debouncedSearch = useCallback(() => {
    return debounce(performSearch, 300);
  }, [performSearch])();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFocusedIndex(-1);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setSearchResults({ snippets: [], users: [], tags: [], languages: [] });
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'snippets', label: 'Snippets', icon: Code2 },
    { id: 'users', label: 'Users', icon: User },
    { id: 'tags', label: 'Tags', icon: Hash }
  ];

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`
            w-full ${sizeClasses[size]} pl-10 pr-12
            bg-slate-800/80 border border-slate-600
            rounded-xl text-white placeholder-slate-400
            focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
            transition-all duration-200 backdrop-blur-sm
          `}
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSearchResults({ snippets: [], users: [], tags: [], languages: [] });
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-white text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Search Dropdown */}      <AnimatePresence>
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
          >
            {/* Filters */}
            {showFilters && query.trim() && (
              <div className="p-3 border-b border-slate-700">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Filter by:</span>
                  <div className="flex space-x-1">
                    {filters.map(filter => {
                      const Icon = filter.icon;
                      return (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            selectedFilter === filter.id
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          <Icon className="h-3 w-3 inline mr-1" />
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="py-2">
              {query.trim() ? (
                <SearchResults 
                  results={getAllResults()}
                  focusedIndex={focusedIndex}
                  onResultClick={handleResultClick}
                  query={query}
                />
              ) : (
                <EmptyState
                  recentSearches={recentSearches}
                  trendingSearches={trendingSearches}
                  onResultClick={handleResultClick}
                  onClearRecent={clearRecentSearches}
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-slate-700 bg-slate-900/50">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Command className="h-3 w-3 mr-1" />
                    ↵ to search
                  </span>
                  <span>↑↓ to navigate</span>
                  <span>Esc to close</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart Search
                </div>              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Search Results Component
const SearchResults = ({ results, focusedIndex, onResultClick, query }) => {
  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-slate-400">
        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No results found for "{query}"</p>
        <p className="text-xs mt-1">Try different keywords or check spelling</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.type}-${result.id || result.query || result.name}-${index}`}
          result={result}
          isActive={index === focusedIndex}
          onClick={() => onResultClick(result)}
        />
      ))}
    </div>
  );
};

// Search Result Item Component
const SearchResultItem = ({ result, isActive, onClick }) => {
  const getIcon = () => {
    switch (result.type) {
      case 'search': return <Search className="h-4 w-4" />;
      case 'snippet': return <Code2 className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'tag': return <Hash className="h-4 w-4" />;
      case 'language': return <Code2 className="h-4 w-4" />;
      case 'recent': return <Clock className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getTitle = () => {
    switch (result.type) {
      case 'search': return result.label;
      case 'snippet': return result.title;
      case 'user': return result.username;
      case 'tag': return `#${result.name}`;
      case 'language': return result.name;
      case 'recent':
      case 'trending': return result.query;
      default: return result.label || result.name || result.query;
    }
  };

  const getSubtitle = () => {
    switch (result.type) {
      case 'snippet': return result.language ? `${result.language} • ${result.likeCount || 0} likes` : 'Code snippet';
      case 'user': return result.email || 'User profile';
      case 'tag': return `${result.count} snippets`;
      case 'language': return `${result.count} snippets`;
      case 'trending': return `${result.count} searches`;
      case 'recent': return 'Recent search';
      default: return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 text-left flex items-center space-x-3
        transition-colors duration-150 group
        ${isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-750 hover:text-white'}
      `}
    >
      <div className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {getTitle()}
        </div>
        {getSubtitle() && (
          <div className="text-xs text-slate-400 truncate">
            {getSubtitle()}
          </div>
        )}
      </div>

      {result.type === 'search' && (
        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-300" />
      )}
    </button>
  );
};

// Empty State Component
const EmptyState = ({ recentSearches, trendingSearches, onResultClick, onClearRecent }) => {
  return (
    <div className="space-y-4">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              <span>Recent Searches</span>
            </div>
            <button
              onClick={onClearRecent}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <SearchResultItem
                key={`recent-${index}`}
                result={{ ...search, type: 'recent' }}
                isActive={false}
                onClick={() => onResultClick({ ...search, type: 'recent' })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {trendingSearches.length > 0 && (
        <div>
          <div className="px-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4" />
              <span>Trending Searches</span>
            </div>
          </div>
          <div className="space-y-1">
            {trendingSearches.slice(0, 5).map((search, index) => (
              <SearchResultItem
                key={`trending-${index}`}
                result={{ ...search, type: 'trending' }}
                isActive={false}
                onClick={() => onResultClick({ ...search, type: 'trending' })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="px-4 py-3 text-center text-slate-500">
        <div className="text-sm">
          💡 <strong>Pro tip:</strong> Use quotes for exact matches, or try searching by language or tags
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
