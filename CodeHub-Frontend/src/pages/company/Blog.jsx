import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, Tag, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'tutorials', name: 'Tutorials', count: 12 },
    { id: 'tips', name: 'Tips & Tricks', count: 8 },
    { id: 'news', name: 'News', count: 4 }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with React Hooks: A Complete Guide',
      excerpt: 'Learn how to use React Hooks effectively in your applications with practical examples and best practices.',
      author: 'Nguyen Tran Gia Si',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giasi',
      date: '2025-06-15',
      readTime: '8 min read',
      category: 'tutorials',
      tags: ['React', 'Hooks', 'JavaScript'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      featured: true,
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: '10 Essential VS Code Extensions for Web Developers',
      excerpt: 'Boost your productivity with these must-have VS Code extensions that every web developer should know about.',
      author: 'Nguyen Tran Gia Si',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giasi',
      date: '2025-06-12',
      readTime: '5 min read',
      category: 'tips',
      tags: ['VS Code', 'Productivity', 'Tools'],
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      featured: false,
      views: 890,
      likes: 67
    },
    {
      id: 3,
      title: 'Building Scalable APIs with Spring Boot and PostgreSQL',
      excerpt: 'Learn how to create robust and scalable REST APIs using Spring Boot framework and PostgreSQL database.',
      author: 'Nguyen Tran Gia Si',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giasi',
      date: '2025-06-10',
      readTime: '12 min read',
      category: 'tutorials',
      tags: ['Spring Boot', 'PostgreSQL', 'API'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
      featured: false,
      views: 654,
      likes: 45
    },
    {
      id: 4,
      title: 'CodeHub Platform Updates - June 2025',
      excerpt: 'New features, improvements, and bug fixes in our latest platform update. See what\'s new this month.',
      author: 'Nguyen Tran Gia Si',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giasi',
      date: '2025-06-08',
      readTime: '3 min read',
      category: 'news',
      tags: ['Updates', 'Features', 'Announcements'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      featured: false,
      views: 432,
      likes: 32
    }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              CodeHub Blog
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Insights, tutorials, and updates from the CodeHub team. 
              Stay up to date with the latest in web development and programming.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Post */}
          {filteredPosts.find(post => post.featured) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-cyan-500" />
                Featured Article
              </h2>
              {(() => {
                const featuredPost = filteredPosts.find(post => post.featured);
                return (
                  <Card className="overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-8 md:w-1/2">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                          <span className="text-slate-500 text-sm">
                            {formatDate(featuredPost.date)}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                          {featuredPost.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={featuredPost.authorAvatar}
                              alt={featuredPost.author}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {featuredPost.author}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-sm text-slate-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {featuredPost.readTime}
                            </span>
                          </div>
                          <button className="flex items-center text-cyan-600 hover:text-cyan-700 font-medium">
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })()}
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.filter(post => !post.featured).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow h-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 px-2 py-1 rounded text-xs font-medium">
                        {categories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-slate-500">
                          {post.readTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-500">
                        <span>{post.views} views</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-cyan-100 mb-8">
              Subscribe to our newsletter to get the latest articles and updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
