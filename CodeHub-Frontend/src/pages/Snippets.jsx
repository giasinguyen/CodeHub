import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  GitFork, 
  Clock,
  Code2,
  TrendingUp,
  Users,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Card, Loading } from '../components/ui';

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  const mockSnippets = [
    {
      id: 1,
      title: 'React Custom Hook for API Calls',
      description: 'A reusable custom hook for handling API requests with loading states and error handling.',
      code: `const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
};`,
      language: 'JavaScript',
      languageColor: '#f7df1e',
      author: 'john_doe',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      views: 1234,
      stars: 45,
      forks: 12,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      tags: ['React', 'Hooks', 'API', 'JavaScript']
    },
    {
      id: 2,
      title: 'Python Data Validation Decorator',
      description: 'Clean and efficient data validation using Python decorators for function parameters.',
      code: `def validate_types(**types):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i, (arg, expected_type) in enumerate(zip(args, types.values())):
                if not isinstance(arg, expected_type):
                    raise TypeError(f"Argument {i} must be {expected_type.__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator`,
      language: 'Python',
      languageColor: '#3776ab',
      author: 'jane_smith',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      views: 892,
      stars: 32,
      forks: 8,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      tags: ['Python', 'Validation', 'Decorators', 'Functions']
    },
    {
      id: 3,
      title: 'CSS Grid Auto-fit Layout',
      description: 'Responsive grid layout that automatically adjusts columns based on screen size.',
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
      language: 'CSS',
      languageColor: '#1572b6',
      author: 'design_guru',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
      views: 567,
      stars: 28,
      forks: 15,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19',
      tags: ['CSS', 'Grid', 'Responsive', 'Layout']
    }
  ];

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
    // Simulate API call
    const loadSnippets = async () => {
      setLoading(true);
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnippets(mockSnippets);
      setLoading(false);
    };

    loadSnippets();
  }, []);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = selectedLanguage === 'all' || 
                           snippet.language.toLowerCase() === selectedLanguage.toLowerCase();
    
    return matchesSearch && matchesLanguage;
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

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Code Snippets
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Discover and share useful code snippets with the developer community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6"
            >
              <h3 className="text-white font-semibold mb-4">Advanced Filters</h3>
              {/* Add more filter options here */}
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
            </motion.div>
          )}
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-slate-400">
            Showing {filteredSnippets.length} of {snippets.length} snippets
          </p>
        </motion.div>

        {/* Snippets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-700">
                <Card.Header>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: snippet.languageColor }}
                      ></div>
                      <span className="text-sm text-slate-400">{snippet.language}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{snippet.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{snippet.stars}</span>
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
                    {snippet.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded-md hover:bg-slate-600 cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {snippet.tags.length > 4 && (
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
                        src={snippet.authorAvatar}
                        alt={snippet.author}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <Link 
                          to={`/users/${snippet.author}`}
                          className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                        >
                          {snippet.author}
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
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        {filteredSnippets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Snippets
            </Button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
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
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Snippets;
