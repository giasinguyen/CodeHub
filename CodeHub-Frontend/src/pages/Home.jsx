import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Star, 
  GitFork, 
  Zap, 
  Users, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import { Button, Card, Loading } from '../components/ui';
import { snippetsAPI } from '../services/api';
import { useSnippet } from '../contexts/SnippetContext';

const Home = () => {  const { refreshTrigger } = useSnippet();
  const [featuredSnippets, setFeaturedSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([
    { name: 'JavaScript', color: '#f7df1e', count: 2340 },
    { name: 'Python', color: '#3776ab', count: 1890 },
    { name: 'TypeScript', color: '#3178c6', count: 1456 },
    { name: 'Java', color: '#ed8b00', count: 1234 },
    { name: 'CSS', color: '#1572b6', count: 987 },
    { name: 'PHP', color: '#777bb4', count: 876 }
  ]); // Initialize with default data
  const [stats, setStats] = useState([
    { label: 'Code Snippets', value: '0', icon: Code2 },
    { label: 'Active Developers', value: '0', icon: Users },
    { label: 'Programming Languages', value: '0', icon: BookOpen },
    { label: 'Stars Given', value: '0', icon: Star }
  ]);
  // Load featured snippets from API
  useEffect(() => {    const loadFeaturedSnippets = async () => {
      try {
        setLoading(true);
        // Get trending snippets
        const response = await snippetsAPI.getTrendingSnippets('most-liked', 0, 6);
        
        if (response.data && response.data.content) {
          // Transform API data to match component expectations
          const transformedSnippets = response.data.content.map(snippet => ({
            id: snippet.id,
            title: snippet.title,
            description: snippet.description,
            language: snippet.language,
            languageColor: getLanguageColor(snippet.language),
            author: snippet.owner?.username || 'Anonymous',
            authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${snippet.owner?.username || 'anonymous'}`,
            views: snippet.viewCount || 0,
            stars: snippet.likeCount || 0,
            forks: 0, // Not available in current API
            createdAt: formatTimeAgo(snippet.createdAt),
            tags: snippet.tags || []
          }));
          
          setFeaturedSnippets(transformedSnippets);
        }
      } catch (error) {
        console.error('Error loading featured snippets:', error);
        // Fallback to mock data if API fails or requires auth
        const mockSnippets = [
          {
            id: 1,
            title: 'React useEffect Hook Examples',
            description: 'Common patterns and best practices for using React useEffect hook in functional components.',
            language: 'JavaScript',
            languageColor: getLanguageColor('JavaScript'),
            author: 'reactdev',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reactdev',
            views: 1250,
            stars: 89,
            forks: 12,
            createdAt: '2 days ago',
            tags: ['react', 'hooks', 'useeffect']
          },
          {
            id: 2,
            title: 'Python Data Validation',
            description: 'Robust data validation functions using Python with type hints and error handling.',
            language: 'Python',
            languageColor: getLanguageColor('Python'),
            author: 'pythonista',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pythonista',
            views: 890,
            stars: 156,
            forks: 23,
            createdAt: '1 week ago',
            tags: ['python', 'validation', 'typing']
          },
          {
            id: 3,
            title: 'CSS Grid Layout Templates',
            description: 'Responsive CSS Grid layouts for modern web applications with fallbacks.',
            language: 'CSS',
            languageColor: getLanguageColor('CSS'),
            author: 'cssmaster',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cssmaster',
            views: 2340,
            stars: 234,
            forks: 45,
            createdAt: '3 days ago',
            tags: ['css', 'grid', 'layout', 'responsive']
          },
          {
            id: 4,
            title: 'TypeScript Generic Utilities',
            description: 'Useful TypeScript generic utility types for better type safety and code reusability.',
            language: 'TypeScript',
            languageColor: getLanguageColor('TypeScript'),
            author: 'tsdev',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tsdev',
            views: 1567,
            stars: 198,
            forks: 34,
            createdAt: '5 days ago',
            tags: ['typescript', 'generics', 'utilities']
          },
          {
            id: 5,
            title: 'Node.js Express Middleware',
            description: 'Custom Express middleware for authentication, logging, and error handling.',
            language: 'JavaScript',
            languageColor: getLanguageColor('JavaScript'),
            author: 'nodedev',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nodedev',
            views: 987,
            stars: 167,
            forks: 28,
            createdAt: '1 week ago',
            tags: ['nodejs', 'express', 'middleware']
          },
          {
            id: 6,
            title: 'SQL Query Optimization',
            description: 'Advanced SQL queries with optimization techniques for better performance.',
            language: 'SQL',
            languageColor: getLanguageColor('SQL'),
            author: 'sqlexpert',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sqlexpert',
            views: 1876,
            stars: 289,
            forks: 56,
            createdAt: '4 days ago',
            tags: ['sql', 'optimization', 'performance']
          }
        ];
        setFeaturedSnippets(mockSnippets);
      } finally {
        setLoading(false);
      }
    };    const loadLanguages = async () => {
      try {
        const response = await snippetsAPI.getLanguageStats();
        console.log('🌐 Language Stats Response:', response);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const transformedLanguages = response.data.slice(0, 6).map(lang => ({
            name: lang.name,
            color: getLanguageColor(lang.name),
            count: lang.count || 0
          }));
          setLanguages(transformedLanguages);
          console.log('✅ Loaded languages from API:', transformedLanguages);
        } else {
          console.log('⚠️ API returned empty data, keeping default languages');
        }
      } catch (error) {
        console.error('❌ Error loading languages:', error);
        console.log('🔄 Keeping default languages due to API error');
        // Keep existing default languages
      }
    };

    const loadStats = async () => {
      try {        // Load different types of data to get real stats
        const [snippetsResponse, languagesResponse] = await Promise.all([
          snippetsAPI.getSnippets(0, 1), // Just to get total count
          snippetsAPI.getLanguages()
        ]);

        const totalSnippets = snippetsResponse.data?.totalElements || 0;
        const totalLanguages = languagesResponse.data?.length || 0;

        setStats([
          { label: 'Code Snippets', value: totalSnippets > 0 ? `${totalSnippets.toLocaleString()}` : '10,000+', icon: Code2 },
          { label: 'Active Developers', value: '5,000+', icon: Users },
          { label: 'Programming Languages', value: totalLanguages > 0 ? totalLanguages.toString() : '50+', icon: BookOpen },
          { label: 'Stars Given', value: '25,000+', icon: Star }
        ]);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Keep default stats if API fails
      }
    };

    loadFeaturedSnippets();
    loadLanguages();
    loadStats();  }, [refreshTrigger]);

  // Helper function to get language color
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Java': '#ed8b00',
      'CSS': '#1572b6',
      'HTML': '#e34f26',
      'PHP': '#777bb4',
      'C++': '#00599c',
      'C#': '#239120',
      'Go': '#00add8',
      'Rust': '#000000',
      'Ruby': '#cc342d',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'Dart': '#0175c2',
      'SQL': '#336791',
      'Shell': '#89e051',
      'JSON': '#000000',
      'XML': '#0060ac',
      'YAML': '#cb171e'
    };
    return colors[language] || '#6b7280';
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-white transition-colors duration-200">      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 light:from-blue-50 light:via-white light:to-blue-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-2xl">
                <Code2 className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-white light:text-gray-900 mb-6">
              Share Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Code Snippets
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 dark:text-slate-300 light:text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover, share, and collaborate on code snippets with developers worldwide. 
              Build something amazing together.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/create-snippet">
                <Button size="lg" className="px-8 py-4">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Coding
                </Button>
              </Link>
              <Link to="/snippets">
                <Button variant="outline" size="lg" className="px-8 py-4">
                  Explore Snippets
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Snippets */}
      <section className="py-20 bg-slate-900 dark:bg-slate-900 light:bg-white transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Code Snippets
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Discover the most popular and useful code snippets shared by our community
            </p>
          </motion.div>          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center">
                <Loading size="lg" />
              </div>
            ) : featuredSnippets.length > 0 ? (
              featuredSnippets.map((snippet, index) => (
                <motion.div
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}                  viewport={{ once: true }}
                >
                  <Link to={`/snippets/${snippet.id}`}>
                    <Card className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer">
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
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {snippet.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {snippet.description}
                        </p>
                      </Card.Header>

                      <Card.Content>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {snippet.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
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
                              <div className="text-sm font-medium text-white">
                                {snippet.author}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />
                                <span>{snippet.createdAt}</span>
                              </div>
                            </div>
                          </div>                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                // TODO: Implement fork functionality
                                console.log('Fork snippet:', snippet.id);
                              }}
                            >
                              <GitFork className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.preventDefault();
                                // TODO: Implement like functionality
                                console.log('Like snippet:', snippet.id);
                              }}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No featured snippets available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/snippets">
              <Button variant="outline" size="lg">
                View All Snippets
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>      {/* Popular Languages */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular Languages
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explore code snippets in the most popular programming languages
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={language.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={`/snippets?language=${encodeURIComponent(language.name)}`}
                  className="block bg-slate-700 rounded-lg p-6 text-center hover:bg-slate-600 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: language.color }}
                  >
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{language.name}</h3>
                  <p className="text-slate-400 text-sm">{language.count.toLocaleString()} snippets</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Share Your Code?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers sharing knowledge and building amazing things together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="px-8 py-4">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
