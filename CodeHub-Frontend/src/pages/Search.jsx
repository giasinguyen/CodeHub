import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  TrendingUp,
  X,
  Code2,
  User,
  Hash
} from 'lucide-react';
import { snippetsAPI, usersAPI } from '../services/api';
import { Card, Button, Loading, SmartSearch } from '../components/ui';
import { DeveloperCard } from '../components/developers';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';
  const sort = searchParams.get('sort') || 'relevance';
  const view = searchParams.get('view') || 'grid';

  const [searchResults, setSearchResults] = useState({
    snippets: [],
    users: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeFilters, setActiveFilters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const promises = [];
      
      if (filter === 'all' || filter === 'snippets') {
        promises.push(snippetsAPI.searchSnippets(query, currentPage, 20));
      }
      
      if (filter === 'all' || filter === 'users') {
        promises.push(usersAPI.searchByUsername(query));
      }

      const results = await Promise.allSettled(promises);
      
      let snippets = [];
      let users = [];
      
      if (filter === 'all') {
        snippets = results[0]?.status === 'fulfilled' 
          ? results[0].value.data?.content || []
          : [];
        users = results[1]?.status === 'fulfilled'
          ? Array.isArray(results[1].value.data) ? results[1].value.data : []
          : [];
      } else if (filter === 'snippets') {
        snippets = results[0]?.status === 'fulfilled' 
          ? results[0].value.data?.content || []
          : [];
      } else if (filter === 'users') {
        users = results[0]?.status === 'fulfilled'
          ? Array.isArray(results[0].value.data) ? results[0].value.data : []
          : [];
      }

      setSearchResults(prev => ({
        snippets: currentPage === 0 ? snippets : [...prev.snippets, ...snippets],
        users: currentPage === 0 ? users : [...prev.users, ...users],
        total: snippets.length + users.length
      }));

    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, filter, currentPage]);

  const loadSuggestions = useCallback(() => {
    const mockSuggestions = [
      `${query} tutorial`,
      `${query} example`,
      `${query} best practices`,
      `${query} documentation`,
      `how to ${query}`
    ];
    setSuggestions(mockSuggestions);
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
      loadSuggestions();
    }
  }, [query, filter, sort, currentPage, performSearch, loadSuggestions]);

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (newFilter) => {
    setCurrentPage(0);
    updateSearchParams({ filter: newFilter });
  };

  const handleSortChange = (newSort) => {
    setCurrentPage(0);
    updateSearchParams({ sort: newSort });
  };

  const handleViewChange = (newView) => {
    updateSearchParams({ view: newView });
  };

  const addFilter = (filterType, value) => {
    const newFilter = `${filterType}:${value}`;
    if (!activeFilters.includes(newFilter)) {
      setActiveFilters([...activeFilters, newFilter]);
    }
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-slate-950 pt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Search CodeHub</h1>
            <p className="text-slate-400 text-lg mb-8">
              Find code snippets, developers, and inspiration
            </p>
            <div className="max-w-2xl mx-auto">
              <SmartSearch 
                size="lg"
                placeholder="Search for anything..."
                className="mb-8"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <Code2 className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Code Snippets</h3>
                <p className="text-slate-400">Find reusable code examples</p>
              </div>
              <div className="text-center">
                <User className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Developers</h3>
                <p className="text-slate-400">Connect with talented developers</p>
              </div>
              <div className="text-center">
                <Hash className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Tags & Topics</h3>
                <p className="text-slate-400">Explore by technology and topics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All Results', icon: Search, count: searchResults.total },
    { id: 'snippets', label: 'Code Snippets', icon: Code2, count: searchResults.snippets.length },
    { id: 'users', label: 'Developers', icon: User, count: searchResults.users.length }
  ];

  const sortOptions = [
    { id: 'relevance', label: 'Most Relevant', icon: TrendingUp },
    { id: 'newest', label: 'Newest First', icon: Calendar },
    { id: 'oldest', label: 'Oldest First', icon: Calendar },
    { id: 'most-liked', label: 'Most Liked', icon: Heart },
    { id: 'most-viewed', label: 'Most Viewed', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-2xl">
              <SmartSearch 
                placeholder={`Search for "${query}"`}
                className="w-full"
              />
            </div>
          </div>

          {/* Search Info */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Search results for "{query}"
              </h1>
              <p className="text-slate-400">
                {searchResults.total} results found
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'grid' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'list' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm text-slate-400">Active filters:</span>
              {activeFilters.map((filterItem, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                >
                  <span>{filterItem}</span>
                  <button
                    onClick={() => removeFilter(filterItem)}
                    className="hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Related searches:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(suggestion)}`)}
                    className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Results
              </h3>
              
              <div className="space-y-3">
                {filters.map(filterOption => {
                  const Icon = filterOption.icon;
                  return (
                    <button
                      key={filterOption.id}
                      onClick={() => handleFilterChange(filterOption.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        filter === filterOption.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span>{filterOption.label}</span>
                      </div>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                        {filterOption.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <SortAsc className="h-5 w-5 mr-2" />
                Sort By
              </h3>
              
              <div className="space-y-2">
                {sortOptions.map(sortOption => {
                  const Icon = sortOption.icon;
                  return (
                    <button
                      key={sortOption.id}
                      onClick={() => handleSortChange(sortOption.id)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                        sort === sortOption.id
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{sortOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {isLoading && currentPage === 0 ? (
              <Loading />
            ) : (
              <div className="space-y-8">
                {/* Snippets Results */}
                {(filter === 'all' || filter === 'snippets') && searchResults.snippets.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Code2 className="h-5 w-5 mr-2" />
                      Code Snippets ({searchResults.snippets.length})
                    </h2>
                    
                    <div className={view === 'grid' 
                      ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                      : 'space-y-4'
                    }>
                      {searchResults.snippets.map(snippet => (
                        <SnippetCard 
                          key={snippet.id} 
                          snippet={snippet}
                          view={view}
                          onAddFilter={addFilter}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Results */}
                {(filter === 'all' || filter === 'users') && searchResults.users.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Developers ({searchResults.users.length})
                    </h2>
                    
                    <div className={view === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                    }>
                      {searchResults.users.map(user => (
                        <DeveloperCard 
                          key={user.id} 
                          developer={user}
                          compact={view === 'list'}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchResults.total === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                    <p className="text-slate-400 mb-6">
                      Try adjusting your search terms or filters
                    </p>
                    <Button 
                      onClick={() => navigate('/search')}
                      variant="outline"
                    >
                      Start New Search
                    </Button>
                  </div>
                )}

                {/* Load More */}
                {searchResults.total > 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Button 
                      onClick={loadMore}
                      variant="outline"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Load More Results'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Snippet Card Component for Search Results
const SnippetCard = ({ snippet, view, onAddFilter }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/snippets/${snippet.id}`);
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    onAddFilter('tag', tag);
  };

  const handleLanguageClick = (e) => {
    e.stopPropagation();
    onAddFilter('language', snippet.language);
  };

  if (view === 'list') {
    return (
      <Card 
        className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
              {snippet.title}
            </h3>
            <p className="text-slate-400 mb-3 line-clamp-2">
              {snippet.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              {snippet.language && (
                <button
                  onClick={handleLanguageClick}
                  className="flex items-center space-x-1 hover:text-cyan-400"
                >
                  <Code2 className="h-4 w-4" />
                  <span>{snippet.language}</span>
                </button>
              )}
              
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{snippet.likeCount || 0}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{snippet.viewCount || 0}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {snippet.tags.slice(0, 3).map(tag => (
                  <button
                    key={tag}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-cyan-500/20 hover:text-cyan-300"
                  >
                    #{tag}
                  </button>
                ))}
                {snippet.tags.length > 3 && (
                  <span className="px-2 py-1 text-slate-400 text-xs">
                    +{snippet.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-slate-400">
              by {snippet.owner?.username || 'Anonymous'}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2">
          {snippet.title}
        </h3>
        
        {snippet.language && (
          <button
            onClick={handleLanguageClick}
            className="ml-4 px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-cyan-500/20 hover:text-cyan-300 flex-shrink-0"
          >
            {snippet.language}
          </button>
        )}
      </div>
      
      <p className="text-slate-400 mb-4 line-clamp-3">
        {snippet.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{snippet.likeCount || 0}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{snippet.viewCount || 0}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{snippet.commentsCount || 0}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div>by {snippet.owner?.username || 'Anonymous'}</div>
          <div className="text-xs">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {snippet.tags.slice(0, 4).map(tag => (
            <button
              key={tag}
              onClick={(e) => handleTagClick(e, tag)}
              className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-cyan-500/20 hover:text-cyan-300"
            >
              #{tag}
            </button>
          ))}
          {snippet.tags.length > 4 && (
            <span className="px-2 py-1 text-slate-400 text-xs">
              +{snippet.tags.length - 4} more
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default SearchPage;
