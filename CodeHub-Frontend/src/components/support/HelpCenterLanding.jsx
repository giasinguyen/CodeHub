import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Book, 
  Code, 
  Users, 
  Settings, 
  Shield, 
  HelpCircle,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { Card, Button } from '../ui';
import { helpCategories, getAllArticles } from '../../data/helpArticles';

const HelpCenterLanding = () => {
  const totalArticles = getAllArticles().length;
  const popularArticles = getAllArticles()
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to CodeHub Help Center
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Everything you need to know about using CodeHub. Find answers, learn new features, 
                and get the most out of your coding experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-2xl font-bold">{helpCategories.length}</div>
                  <div className="text-sm text-blue-100">Categories</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-2xl font-bold">{totalArticles}</div>
                  <div className="text-sm text-blue-100">Articles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-blue-100">From JS Data</div>
                </div>
              </div>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link to="/support">
                  Explore Help Center
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Quick Access Categories */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Link to={`/support/category/${category.id}`}>
                      <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-cyan-500/50">
                        <div className="flex items-center mb-4">
                          <div className={`p-3 rounded-xl ${category.color} mr-4 group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {category.title}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {category.totalArticles} articles
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Popular Articles */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Popular Articles</h2>
              <Button variant="outline" asChild>
                <Link to="/support">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link to={`/support/article/${article.slug}`}>
                    <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-slate-800/50 border-slate-700 hover:bg-slate-700/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-orange-400 font-medium">Popular</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-400">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{article.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-3">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{article.readTime}</span>
                        <span>{article.views} views</span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Get help from our community or contact our support team for personalized assistance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link to="/support/community">Join Community</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/support/report-bug">Report a Bug</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/support/feedback">Send Feedback</Link>
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterLanding;
