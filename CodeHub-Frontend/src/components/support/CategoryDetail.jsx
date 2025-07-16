import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  Star, 
  Eye, 
  BookOpen,
  Filter,
  SortAsc,
  Grid,
  List,
  ChevronRight
} from 'lucide-react';
import { Button, Card, Input, Select, Badge } from '../ui';
import { helpCategories } from '../../data/helpArticles';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const categoryData = helpCategories.find(cat => cat.id === categoryId);
    if (categoryData) {
      setCategory(categoryData);
      setArticles(categoryData.articles);
      setFilteredArticles(categoryData.articles);
    } else {
      navigate('/support', { replace: true });
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    let filtered = [...articles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(article => 
        article.difficulty.toLowerCase() === difficultyFilter
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, sortBy, difficultyFilter]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Book: BookOpen,
      Code: () => <div className="w-6 h-6 bg-current rounded" />,
      Users: () => <div className="w-6 h-6 bg-current rounded-full" />,
      Settings: () => <div className="w-6 h-6 bg-current rounded" />,
      Shield: () => <div className="w-6 h-6 bg-current rounded" />,
      HelpCircle: () => <div className="w-6 h-6 bg-current rounded-full" />
    };
    return icons[iconName] || BookOpen;
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading category...</p>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(category.icon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link to="/support">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Help Center
                </Link>
              </Button>
            </div>

            <motion.div 
              className="flex items-center space-x-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`p-4 rounded-xl ${category.color}`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.title}
                </h1>
                <p className="text-xl text-slate-300 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-slate-400 space-x-4">
                  <span>{category.totalArticles} articles</span>
                  <span>•</span>
                  <span>{filteredArticles.length} showing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters and Search */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  {/* Difficulty Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <Select
                      value={difficultyFilter}
                      onChange={setDifficultyFilter}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-slate-400" />
                    <Select
                      value={sortBy}
                      onChange={setSortBy}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    >
                      <option value="popularity">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Recently Updated</option>
                      <option value="title">Alphabetical</option>
                    </Select>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`${viewMode === 'grid' ? 'bg-slate-600' : ''} text-slate-300 hover:text-white`}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`${viewMode === 'list' ? 'bg-slate-600' : ''} text-slate-300 hover:text-white`}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Articles */}
          {filteredArticles.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-slate-400 mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
              }}>
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-slate-800/50 border-slate-700 hover:bg-slate-700/50">
                      <Link to={`/support/article/${article.slug}`} className="block">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className={`${getDifficultyColor(article.difficulty)} text-white text-xs`}>
                            {article.difficulty}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-3">
                          {article.title}
                        </h3>
                        
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{article.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{article.rating}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-4">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ) : (
                    <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-slate-800/50 border-slate-700 hover:bg-slate-700/50">
                      <Link to={`/support/article/${article.slug}`} className="block">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                {article.title}
                              </h3>
                              <Badge className={`${getDifficultyColor(article.difficulty)} text-white text-xs`}>
                                {article.difficulty}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-slate-400 mb-3">
                              {article.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-slate-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readTime}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{article.views}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{article.rating}</span>
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </Link>
                    </Card>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
