import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  Zap
} from 'lucide-react';
import { Card, Loading, Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { favoritesAPI } from '../services/api';
import toast from 'react-hot-toast';

// Import components
import { FavoriteCard, FavoriteFilters, FavoriteStats } from '../components/favorites';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    thisWeek: 0,
    totalViews: 0,
    totalLikes: 0,
    byLanguage: {},
    recentActivity: 0
  });  // Load favorites data
  const loadFavorites = useCallback(async () => {
    if (!user?.id) {
      console.log('❌ No user logged in, skipping favorites load');
      setLoading(false);
      return;
    }

    // Prevent duplicate loads in development mode
    if (hasLoadedOnce && favorites.length > 0) {
      console.log('🚫 Favorites already loaded, skipping duplicate load');
      setLoading(false);
      return;
    }
      try {
      setLoading(true);
      console.log('🔄 Loading favorites for user:', user.id);
      
      // Try to get real data from API first
      try {
        console.log('📡 Attempting to fetch favorites from API...');
        const response = await favoritesAPI.getUserFavorites();
        const realFavorites = response.data?.content || response.data || [];
        
        console.log('✅ API Response received:', realFavorites.length, 'favorites');
        
        setFavorites(realFavorites);
        setFilteredFavorites(realFavorites);
        
        // Calculate stats from real data
        const calculatedStats = calculateStats(realFavorites);
        setStats(calculatedStats);
        
        setHasLoadedOnce(true);
        console.log('✅ Real favorites loaded from API:', realFavorites.length);
        return;
      } catch (apiError) {
        console.warn('❌ API call failed, falling back to mock data:', apiError.message);
        console.log('📦 Using mock data since favorites API call failed');
      }
      
      // Fallback to mock data if API fails
      const mockFavorites = generateMockFavorites();
      setFavorites(mockFavorites);
      setFilteredFavorites(mockFavorites);
      
      // Calculate stats
      const calculatedStats = calculateStats(mockFavorites);
      setStats(calculatedStats);
        setHasLoadedOnce(true);
      console.log('✅ Mock favorites loaded:', mockFavorites.length);
    } catch (error) {
      console.error('❌ Failed to load favorites:', error);
      toast.error('Failed to load your favorites');
      
      // Fallback to empty state
      setFavorites([]);
      setFilteredFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, hasLoadedOnce, favorites.length]); // Include hasLoadedOnce and favorites.length
  // Generate mock favorites data
  const generateMockFavorites = () => {
    const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'Go', 'Rust'];
    const authors = ['developer1', 'coder2', 'programmer3', 'techguru', 'codewizard', 'jsmaster'];
    const categories = ['Algorithm', 'UI Component', 'Utility', 'API', 'Database', 'Authentication'];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: `mock-fav-${i + 1}`,
      snippet: {
        id: `mock-snippet-${i + 1}`,
        title: `${categories[i % categories.length]} - ${languages[i % languages.length]}`,
        description: `A useful ${languages[i % languages.length]} snippet for ${categories[i % categories.length].toLowerCase()} implementation. This is a comprehensive example that demonstrates best practices.`,
        language: languages[i % languages.length],
        code: `// ${categories[i % categories.length]} implementation in ${languages[i % languages.length]}\nfunction ${categories[i % categories.length].toLowerCase().replace(' ', '')}Example() {\n  console.log('This is a ${categories[i % categories.length].toLowerCase()} example');\n  return {\n    success: true,\n    data: 'Hello World'\n  };\n}\n\n// Export for use\nexport default ${categories[i % categories.length].toLowerCase().replace(' ', '')}Example;`,
        tags: [
          languages[i % languages.length].toLowerCase(), 
          categories[i % categories.length].toLowerCase().replace(' ', '-'), 
          'favorite',
          i % 3 === 0 ? 'popular' : 'utility',
          i % 4 === 0 ? 'beginner' : 'intermediate'
        ],
        owner: {
          id: `user-${Math.floor(Math.random() * 100)}`,
          username: authors[i % authors.length],
          fullName: `${authors[i % authors.length]} Developer`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authors[i % authors.length]}`
        },
        viewCount: Math.floor(Math.random() * 1000) + 50,
        likeCount: Math.floor(Math.random() * 100) + 10,
        commentCount: Math.floor(Math.random() * 20),
        isPublic: true,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      favoritedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      category: categories[i % categories.length],
      notes: i % 3 === 0 ? `Personal note: This is a great example of ${categories[i % categories.length]} that I use frequently in my projects.` : null,
      isBookmarked: i % 4 === 0,
      priority: i % 5 === 0 ? 'high' : i % 3 === 0 ? 'medium' : 'normal'
    }));
  };

  // Calculate statistics
  const calculateStats = (favoritesData) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const byLanguage = {};
    let totalViews = 0;
    let totalLikes = 0;
    let recentActivity = 0;
    
    favoritesData.forEach(fav => {
      const lang = fav.snippet.language;
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;
      totalViews += fav.snippet.viewCount || 0;
      totalLikes += fav.snippet.likeCount || 0;
      
      if (new Date(fav.favoritedAt) > weekAgo) {
        recentActivity++;
      }
    });
    
    return {
      totalFavorites: favoritesData.length,
      thisWeek: favoritesData.filter(fav => new Date(fav.favoritedAt) > weekAgo).length,
      totalViews,
      totalLikes,
      byLanguage,
      recentActivity
    };
  };
  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    setHasLoadedOnce(false); // Reset the flag to allow reload
    await loadFavorites();
    setRefreshing(false);
    toast.success('Favorites refreshed');
  };  // Remove from favorites
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      setRemovingIds(prev => new Set([...prev, favoriteId]));
      
      // Find the snippet to get its actual ID for API call
      const favorite = favorites.find(fav => fav.id === favoriteId);
      if (favorite?.snippet?.id) {
        try {
          console.log('🗑️ Removing favorite via API:', favorite.snippet.id);
          await favoritesAPI.removeFavorite(favorite.snippet.id);
          console.log('✅ Favorite removed via API');
        } catch (apiError) {
          console.warn('❌ API remove failed, proceeding with local removal:', apiError);
        }
      }
      
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      setFilteredFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - 1
      }));
      
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(favoriteId);
        return newSet;
      });
    }
  };  // Bulk remove favorites
  const handleBulkRemove = async () => {
    try {
      // Try bulk API call first
      try {
        console.log('🗑️ Bulk removing favorites via API:', selectedFavorites.length);
        const snippetIds = selectedFavorites.map(id => {
          const favorite = favorites.find(fav => fav.id === id);
          return favorite?.snippet?.id;
        }).filter(Boolean);
        
        if (snippetIds.length > 0) {
          await favoritesAPI.bulkRemoveFavorites(snippetIds);
          console.log('✅ Bulk favorites removed via API');
        }
      } catch (apiError) {
        console.warn('❌ Bulk remove API failed, proceeding with local removal:', apiError);
      }
      
      setFavorites(prev => prev.filter(fav => !selectedFavorites.includes(fav.id)));
      setFilteredFavorites(prev => prev.filter(fav => !selectedFavorites.includes(fav.id)));
      
      setStats(prev => ({
        ...prev,
        totalFavorites: prev.totalFavorites - selectedFavorites.length
      }));
      
      setSelectedFavorites([]);
      toast.success(`${selectedFavorites.length} favorites removed`);
    } catch (error) {
      console.error('Failed to remove favorites:', error);
      toast.error('Failed to remove favorites');
    }
  };

  // Copy snippet code
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast.error('Failed to copy code');
    }
  };

  // Filter and sort favorites
  useEffect(() => {
    let filtered = [...favorites];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(fav =>
        fav.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.snippet.owner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (fav.notes && fav.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }    // Apply category filter
    switch (filterBy) {
      case 'bookmarked':
        filtered = filtered.filter(fav => fav.isBookmarked);
        break;
      case 'high-priority':
        filtered = filtered.filter(fav => fav.priority === 'high');
        break;
      case 'recent': {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(fav => new Date(fav.favoritedAt) > weekAgo);
        break;
      }
      case 'with-notes':
        filtered = filtered.filter(fav => fav.notes && fav.notes.trim());
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'newest':
          comparison = new Date(b.favoritedAt) - new Date(a.favoritedAt);
          break;
        case 'oldest':
          comparison = new Date(a.favoritedAt) - new Date(b.favoritedAt);
          break;
        case 'most-viewed':
          comparison = b.snippet.viewCount - a.snippet.viewCount;
          break;
        case 'most-liked':
          comparison = b.snippet.likeCount - a.snippet.likeCount;
          break;
        case 'title':
          comparison = a.snippet.title.localeCompare(b.snippet.title);
          break;
        case 'language':
          comparison = a.snippet.language.localeCompare(b.snippet.language);
          break;
        case 'author':
          comparison = a.snippet.owner.username.localeCompare(b.snippet.owner.username);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? comparison : -comparison;
    });

    setFilteredFavorites(filtered);
  }, [favorites, searchTerm, filterBy, sortBy, sortOrder]);

  // Load favorites on component mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-100">
        <div className="flex items-center justify-center py-20">
          <Loading size="lg" text="Loading your favorites..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
                  <Heart className="w-10 h-10 text-red-400" />
                  <span>My Favorites</span>
                </h1>
                <p className="text-slate-400 text-lg">
                  Your curated collection of amazing code snippets
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleRefresh}
                  variant="secondary"
                  disabled={refreshing}
                  className="flex items-center space-x-2"
                >
                  <Zap className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
                <Button
                  onClick={() => navigate('/snippets')}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Snippets</span>
                </Button>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-yellow-300 font-medium">Demo Mode</h3>
                  <p className="text-yellow-200/80 text-sm">
                    Currently displaying mock data. Backend favorites API will be integrated soon.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Component */}
            <FavoriteStats stats={stats} />
          </div>

          {/* Filters Component */}
          <FavoriteFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedFavorites={selectedFavorites}
            onBulkRemove={handleBulkRemove}
            onClearSelection={() => setSelectedFavorites([])}
            filteredCount={filteredFavorites.length}
            onClearSearch={() => setSearchTerm('')}
          />

          {/* Favorites Grid/List */}
          <div className="mb-8">
            {filteredFavorites.length === 0 ? (
              <Card>
                <Card.Content className="p-12 text-center">
                  <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    {searchTerm ? 'No favorites found' : 'No favorites yet'}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {searchTerm
                      ? `No favorites match your search "${searchTerm}"`
                      : 'Start building your collection by favoriting snippets you love!'}
                  </p>
                  <Button
                    onClick={() => navigate('/snippets')}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Discover Snippets</span>
                  </Button>
                </Card.Content>
              </Card>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                <AnimatePresence>
                  {filteredFavorites.map((favorite, index) => (
                    <FavoriteCard
                      key={favorite.id}
                      favorite={favorite}
                      index={index}
                      viewMode={viewMode}
                      isSelected={selectedFavorites.includes(favorite.id)}
                      isRemoving={removingIds.has(favorite.id)}
                      onToggleSelect={(id) => {
                        if (selectedFavorites.includes(id)) {
                          setSelectedFavorites(prev => prev.filter(fId => fId !== id));
                        } else {
                          setSelectedFavorites(prev => [...prev, id]);
                        }
                      }}
                      onRemove={handleRemoveFavorite}
                      onCopyCode={handleCopyCode}
                      formatNumber={formatNumber}
                      formatTimeAgo={formatTimeAgo}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
