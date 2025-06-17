import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  Code2,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Card, Loading, Button } from '../components/ui';
import { recentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const Recent = () => {
  const { user } = useAuth();
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Load recently viewed snippets
  const loadRecentSnippets = async (page = 0, reset = false) => {
    try {
      if (page === 0) setLoading(true);
      
      const response = await recentAPI.getRecentlyViewed(page, 12);
      const newSnippets = response.data.content || [];
      
      if (reset || page === 0) {
        setRecentSnippets(newSnippets);
      } else {
        setRecentSnippets(prev => [...prev, ...newSnippets]);
      }
      
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 0);
      setHasMore(!response.data.last);
      
    } catch (error) {
      console.error('Failed to load recent snippets:', error);
      toast.error('Failed to load recently viewed snippets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentSnippets();
  }, []);

  // Filter snippets based on search term
  const filteredSnippets = recentSnippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Remove snippet from recent
  const handleRemoveFromRecent = async (snippetId) => {
    try {
      await recentAPI.removeFromRecent(snippetId);
      setRecentSnippets(prev => prev.filter(snippet => snippet.id !== snippetId));
      toast.success('Removed from recently viewed');
    } catch (error) {
      console.error('Failed to remove snippet:', error);
      toast.error('Failed to remove snippet');
    }
  };

  // Clear all recent
  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all recently viewed snippets?')) {
      return;
    }
    
    try {
      await recentAPI.clearAll();
      setRecentSnippets([]);
      toast.success('Cleared all recently viewed snippets');
    } catch (error) {
      console.error('Failed to clear recent snippets:', error);
      toast.error('Failed to clear recent snippets');
    }
  };

  // Load more snippets
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadRecentSnippets(currentPage + 1);
    }
  };

  if (loading && currentPage === 0) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" text="Loading recently viewed snippets..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Recently Viewed</h1>
              <p className="text-slate-400">
                Snippets you've recently viewed • {filteredSnippets.length} items
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => loadRecentSnippets(0, true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
              
              {recentSnippets.length > 0 && (
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search recently viewed snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredSnippets.length === 0 ? (
          <Card className="text-center py-12">
            <Card.Content>
              <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No matching snippets found' : 'No recently viewed snippets'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Start exploring code snippets to see them here'
                }
              </p>
              {!searchTerm && (
                <Link to="/snippets">
                  <Button>Browse Snippets</Button>
                </Link>
              )}
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Snippets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSnippets.map((snippet) => (
                <Card key={snippet.id} className="group hover:shadow-lg transition-all duration-300">
                  <Card.Header>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: snippet.languageColor || '#64748b' }}
                        />
                        <span className="text-sm text-slate-400">{snippet.language}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          onClick={() => handleRemoveFromRecent(snippet.id)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Link
                      to={`/snippets/${snippet.id}`}
                      className="block hover:text-cyan-400 transition-colors"
                    >
                      <h3 className="font-semibold text-white mb-1 line-clamp-2">
                        {snippet.title}
                      </h3>
                    </Link>
                    
                    {snippet.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {snippet.description}
                      </p>
                    )}
                  </Card.Header>

                  <Card.Content>
                    {/* Tags */}
                    {snippet.tags && snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {snippet.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {snippet.tags.length > 3 && (
                          <span className="text-slate-400 text-xs px-2 py-1">
                            +{snippet.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{snippet.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{snippet.likes || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(snippet.createdAt)}</span>
                      </div>
                    </div>
                  </Card.Content>

                  <Card.Footer>
                    <div className="flex items-center space-x-2">
                      <img
                        src={snippet.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${snippet.author?.username}`}
                        alt={snippet.author?.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-slate-400">
                        {snippet.author?.fullName || snippet.author?.username}
                      </span>
                    </div>
                  </Card.Footer>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <MoreHorizontal className="w-4 h-4" />
                      <span>Load More</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recent;
