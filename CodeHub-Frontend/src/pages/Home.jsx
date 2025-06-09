import React from 'react';
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
import { Button, Card } from '../components/ui';

const Home = () => {
  // Mock data for featured snippets
  const featuredSnippets = [
    {
      id: 1,
      title: 'React Custom Hook for API Calls',
      description: 'A reusable custom hook for handling API requests with loading states and error handling.',
      language: 'JavaScript',
      languageColor: '#f7df1e',
      author: 'john_doe',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      views: 1234,
      stars: 45,
      forks: 12,
      createdAt: '2 days ago',
      tags: ['React', 'Hooks', 'API']
    },
    {
      id: 2,
      title: 'Python Data Validation Decorator',
      description: 'Clean and efficient data validation using Python decorators for function parameters.',
      language: 'Python',
      languageColor: '#3776ab',
      author: 'jane_smith',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      views: 892,
      stars: 32,
      forks: 8,
      createdAt: '1 week ago',
      tags: ['Python', 'Validation', 'Decorators']
    },
    {
      id: 3,
      title: 'CSS Grid Auto-fit Layout',
      description: 'Responsive grid layout that automatically adjusts columns based on screen size.',
      language: 'CSS',
      languageColor: '#1572b6',
      author: 'design_guru',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
      views: 567,
      stars: 28,
      forks: 15,
      createdAt: '3 days ago',
      tags: ['CSS', 'Grid', 'Responsive']
    }
  ];

  const stats = [
    { label: 'Code Snippets', value: '10,000+', icon: Code2 },
    { label: 'Active Developers', value: '5,000+', icon: Users },
    { label: 'Programming Languages', value: '50+', icon: BookOpen },
    { label: 'Stars Given', value: '25,000+', icon: Star }
  ];

  const languages = [
    { name: 'JavaScript', color: '#f7df1e', count: 2340 },
    { name: 'Python', color: '#3776ab', count: 1890 },
    { name: 'TypeScript', color: '#3178c6', count: 1456 },
    { name: 'Java', color: '#ed8b00', count: 1234 },
    { name: 'CSS', color: '#1572b6', count: 987 },
    { name: 'PHP', color: '#777bb4', count: 876 }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
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
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Share Your{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Code Snippets
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Discover, share, and collaborate on code snippets with developers worldwide. 
              Build something amazing together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Start Coding
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4">
                Explore Snippets
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
      <section className="py-20 bg-slate-900">
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSnippets.map((snippet, index) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:scale-105 transition-transform duration-300">
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
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <GitFork className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </motion.div>
            ))}
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
      </section>

      {/* Popular Languages */}
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-700 rounded-lg p-6 text-center hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: language.color }}
                >
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{language.name}</h3>
                <p className="text-slate-400 text-sm">{language.count} snippets</p>
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
