import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Star, Eye, GitFork, Clock, Globe, Lock, Users, Code2 } from 'lucide-react';
import { Button, Input, Card, Loading } from '../ui';
import { usersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProfileSnippets = ({ userId, isOwnProfile }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, public, private, unlisted
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular, views
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0
  });
  useEffect(() => {
    loadSnippets();
  }, [userId, filterBy, sortBy, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSnippets = async () => {
    try {
      setLoading(true);
      
      let response;
      if (isOwnProfile) {
        response = await usersAPI.getCurrentUserSnippets(pagination.page, pagination.size);
      } else {
        response = await usersAPI.getUserSnippets(userId, pagination.page, pagination.size);
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
      console.error('Failed to load snippets:', error);
      toast.error('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // TODO: Implement search functionality
  };

  const filteredSnippets = snippets.filter(snippet => {
    if (searchTerm && !snippet.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filterBy === 'public' && snippet.visibility !== 'public') return false;
    if (filterBy === 'private' && snippet.visibility !== 'private') return false;
    if (filterBy === 'unlisted' && snippet.visibility !== 'unlisted') return false;
    
    return true;
  });

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-400" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-400" />;
      case 'unlisted':
        return <Users className="w-4 h-4 text-yellow-400" />;
      default:
        return <Globe className="w-4 h-4 text-green-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading type="skeleton" count={6} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">
            {isOwnProfile ? 'My Snippets' : 'Snippets'}
          </h2>
          <span className="text-slate-400">
            ({pagination.totalElements} {pagination.totalElements === 1 ? 'snippet' : 'snippets'})
          </span>
        </div>

        {isOwnProfile && (
          <Link to="/create">
            <Button variant="primary" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Snippet</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <Card.Content className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={handleSearch}
                icon={Search}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              {isOwnProfile && (
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">All Snippets</option>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Snippets Grid */}
      {filteredSnippets.length === 0 ? (
        <Card>
          <Card.Content className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? 'No snippets found' : 'No snippets yet'}
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters'
                  : isOwnProfile 
                    ? 'Create your first snippet to get started!'
                    : 'This user hasn\'t created any snippets yet.'
                }
              </p>
              {isOwnProfile && !searchTerm && (
                <Link to="/create">
                  <Button variant="primary">Create Snippet</Button>
                </Link>
              )}
            </div>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id} className="hover:border-slate-600 transition-colors">
              <Card.Content className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getVisibilityIcon(snippet.visibility)}
                    <span className="text-xs text-slate-400 capitalize">
                      {snippet.visibility}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(snippet.updatedAt)}</span>
                  </div>
                </div>

                {/* Title and Description */}
                <Link to={`/snippets/${snippet.id}`}>
                  <h3 className="text-lg font-semibold text-white mb-2 hover:text-cyan-400 transition-colors line-clamp-2">
                    {snippet.title}
                  </h3>
                </Link>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {snippet.description}
                </p>

                {/* Language and Tags */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                    {snippet.language}
                  </span>
                  {snippet.tags?.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {snippet.tags?.length > 2 && (
                    <span className="text-xs text-slate-500">
                      +{snippet.tags.length - 2} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{snippet.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{snippet.viewsCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{snippet.forksCount || 0}</span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.page === 0}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + Math.max(0, pagination.page - 2);
              if (pageNum >= pagination.totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.page ? "primary" : "ghost"}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  className="w-10 h-10 p-0"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages - 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileSnippets;
