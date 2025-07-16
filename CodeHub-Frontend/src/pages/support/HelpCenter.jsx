import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  Code, 
  Users, 
  Settings, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { helpCategories, getAllArticles } from '../../data/helpArticles';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get popular articles (sorted by views)
  const popularArticles = useMemo(() => {
    return getAllArticles()
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  }, []);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return helpCategories;
    
    const query = searchQuery.toLowerCase();
    return helpCategories.filter(category =>
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.articles.some(article => 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      )
    );
  }, [searchQuery]);

  const getIconComponent = (iconName) => {
    const icons = {
      Book,
      Code,
      Users,
      Settings,
      Shield,
      HelpCircle
    };
    return icons[iconName] || Book;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-gray-50 light:via-white light:to-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find answers to your questions and learn how to get the most out of CodeHub
            </motion.p>
            
            {/* Search Box */}
            <motion.div 
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg bg-slate-800/80 dark:bg-slate-800/80 light:bg-white border-0 shadow-lg text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
              />
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Popular Articles */}
          {!searchQuery && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-8">
                Popular Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularArticles.map((article, index) => (
                  <Link key={index} to={`/support/article/${article.slug}`}>
                    <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-slate-800/50 dark:bg-slate-800/50 light:bg-white border-slate-700 dark:border-slate-700 light:border-gray-200 hover:bg-slate-700/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white dark:text-white light:text-gray-900 mb-2 group-hover:text-cyan-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                            {article.summary}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-400 dark:text-slate-400 light:text-gray-500">
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>Popular</span>
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{article.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-400 light:text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}          {/* Help Categories */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-8">
              {searchQuery ? 'Search Results' : 'Browse by Category'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Link to={`/support/category/${category.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-slate-800/50 dark:bg-slate-800/50 light:bg-white border-slate-700 dark:border-slate-700 light:border-gray-200 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-gray-50">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white dark:text-white light:text-gray-900 group-hover:text-cyan-400 dark:group-hover:text-cyan-400 light:group-hover:text-blue-600 transition-colors">
                              {category.title}
                            </h3>
                            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-500">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {category.articles.slice(0, 3).map((article, articleIndex) => (
                            <div key={articleIndex} className="flex items-center justify-between text-sm">
                              <span className="text-slate-300 dark:text-slate-300 light:text-gray-600 group-hover:text-white dark:group-hover:text-white light:group-hover:text-gray-900 transition-colors">
                                {article.title}
                              </span>
                              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-400 light:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                          {category.articles.length > 3 && (
                            <div className="text-sm text-cyan-400 dark:text-cyan-400 light:text-blue-600 font-medium">
                              +{category.articles.length - 3} more articles
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Contact Support CTA */}
          <motion.section 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 dark:from-slate-800/50 dark:to-slate-700/50 light:from-blue-50 light:to-purple-50 rounded-2xl p-8 border border-slate-600 dark:border-slate-600 light:border-transparent">
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-4">
                Still need help?
              </h2>
              <p className="text-slate-300 dark:text-slate-300 light:text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions or issues you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0">
                  <Link to="/support/report-bug">
                    Report a Bug
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-slate-600 dark:border-slate-600 light:border-gray-300 text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100">
                  <Link to="/support/feedback">
                    Send Feedback
                  </Link>
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
