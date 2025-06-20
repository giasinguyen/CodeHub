import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Help categories
  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of CodeHub',
      icon: Book,
      color: 'bg-blue-500',
      articles: [
        { title: 'Creating your first snippet', views: 1250, rating: 4.8 },
        { title: 'Setting up your profile', views: 980, rating: 4.6 },
        { title: 'Understanding syntax highlighting', views: 756, rating: 4.7 },
        { title: 'How to search for code snippets', views: 645, rating: 4.5 }
      ]
    },
    {
      id: 'code-management',
      title: 'Code Management',
      description: 'Managing your snippets and code',
      icon: Code,
      color: 'bg-green-500',
      articles: [
        { title: 'Organizing snippets with tags', views: 892, rating: 4.7 },
        { title: 'Version control for code snippets', views: 678, rating: 4.4 },
        { title: 'Sharing and collaboration features', views: 543, rating: 4.6 },
        { title: 'Private vs public snippets', views: 432, rating: 4.5 }
      ]
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with other developers',
      icon: Users,
      color: 'bg-purple-500',
      articles: [
        { title: 'Following other developers', views: 723, rating: 4.3 },
        { title: 'Commenting and feedback system', views: 612, rating: 4.5 },
        { title: 'Community guidelines', views: 556, rating: 4.6 },
        { title: 'Building your reputation', views: 445, rating: 4.4 }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      description: 'Manage your account preferences',
      icon: Settings,
      color: 'bg-orange-500',
      articles: [
        { title: 'Changing your password', views: 834, rating: 4.6 },
        { title: 'Notification preferences', views: 567, rating: 4.3 },
        { title: 'Theme and appearance settings', views: 489, rating: 4.7 },
        { title: 'Account deletion and data export', views: 234, rating: 4.2 }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Keep your account secure',
      icon: Shield,
      color: 'bg-red-500',
      articles: [
        { title: 'Two-factor authentication setup', views: 676, rating: 4.8 },
        { title: 'Privacy controls and data protection', views: 543, rating: 4.6 },
        { title: 'Reporting security issues', views: 432, rating: 4.5 },
        { title: 'Understanding our privacy policy', views: 321, rating: 4.4 }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: HelpCircle,
      color: 'bg-yellow-500',
      articles: [
        { title: 'Code highlighting not working', views: 445, rating: 4.3 },
        { title: 'Upload issues and file size limits', views: 378, rating: 4.4 },
        { title: 'Login and authentication problems', views: 332, rating: 4.2 },
        { title: 'Performance and loading issues', views: 267, rating: 4.1 }
      ]
    }
  ];

  const popularArticles = [
    { title: 'How to create your first code snippet', category: 'Getting Started', views: 1250, rating: 4.8 },
    { title: 'Setting up two-factor authentication', category: 'Security', views: 1089, rating: 4.7 },
    { title: 'Organizing your snippets with tags', category: 'Code Management', views: 976, rating: 4.6 },
    { title: 'Understanding privacy settings', category: 'Security', views: 834, rating: 4.5 }
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              className="pl-12 py-4 text-lg bg-white dark:bg-gray-800 border-0 shadow-lg"
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularArticles.map((article, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="text-blue-600 dark:text-blue-400">{article.category}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{article.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.views} views</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Help Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {searchQuery ? 'Search Results' : 'Browse by Category'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {category.articles.slice(0, 3).map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {article.title}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                      {category.articles.length > 3 && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          +{category.articles.length - 3} more articles
                        </div>
                      )}
                    </div>
                  </Card>
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/support/report-bug">
                  Report a Bug
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/support/feedback">
                  Send Feedback
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HelpCenter;
