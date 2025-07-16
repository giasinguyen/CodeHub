import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Eye, 
  BookOpen, 
  Share2, 
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Tag,
  Users
} from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import { getArticleBySlug, getRelatedArticles } from '../../data/helpArticles';
import toast from 'react-hot-toast';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const articleData = getArticleBySlug(slug);
    if (articleData) {
      setArticle(articleData);
      const related = getRelatedArticles(articleData.id, 4);
      setRelatedArticles(related);
      
      // Simulate bookmark and like status
      setIsBookmarked(Math.random() > 0.7);
      setIsLiked(Math.random() > 0.8);
    } else {
      navigate('/support', { replace: true });
    }
  }, [slug, navigate]);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Like removed' : 'Article liked!');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } catch {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderContent = (content) => {
    // Convert markdown-like content to HTML
    const htmlContent = content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium text-white mb-3 mt-5">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/^\*(.*?)\*/gm, '<em class="italic text-slate-300">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="text-slate-300 mb-1">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="text-slate-300 mb-1">$2</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-cyan-400 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-800 border border-slate-700 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-slate-300">$2</code></pre>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 mb-4">')
      .replace(/\n/g, '<br>');

    return `<p class="text-slate-300 mb-4">${htmlContent}</p>`;
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link to="/support">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Help Center
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? 'text-red-400' : 'text-slate-300'} hover:text-red-400`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${isBookmarked ? 'text-yellow-400' : 'text-slate-300'} hover:text-yellow-400`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-slate-300 hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                  {article.category}
                </Badge>
                <Badge className={`${getDifficultyColor(article.difficulty)} text-white`}>
                  {article.difficulty}
                </Badge>
                <div className="flex items-center text-slate-400 text-sm space-x-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.views.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{article.rating}</span>
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {article.title}
              </h1>
              
              <p className="text-xl text-slate-300 mb-6">
                {article.summary}
              </p>
              
              <div className="flex items-center text-slate-400 text-sm space-x-4">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <motion.div 
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 bg-slate-800/50 border-slate-700">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
                />
                
                {/* Article Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      Was this article helpful?
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={handleLike}>
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {isLiked ? 'Liked' : 'Helpful'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-6 sticky top-6">
                {/* Table of Contents */}
                <Card className="p-4 bg-slate-800/50 border-slate-700">
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    In this article
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                      Getting Started
                    </a>
                    <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                      Step-by-Step Guide
                    </a>
                    <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                      Best Practices
                    </a>
                    <a href="#" className="block text-slate-300 hover:text-cyan-400 transition-colors">
                      Troubleshooting
                    </a>
                  </div>
                </Card>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <Card className="p-4 bg-slate-800/50 border-slate-700">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Related Articles
                    </h3>
                    <div className="space-y-3">
                      {relatedArticles.map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          to={`/support/article/${relatedArticle.slug}`}
                          className="block group"
                        >
                          <div className="text-sm">
                            <h4 className="font-medium text-slate-300 group-hover:text-cyan-400 transition-colors mb-1">
                              {relatedArticle.title}
                            </h4>
                            <div className="flex items-center text-xs text-slate-500 space-x-2">
                              <span>{relatedArticle.readTime}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{relatedArticle.rating}</span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Need Help? */}
                <Card className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30">
                  <h3 className="font-semibold text-white mb-2">
                    Still need help?
                  </h3>
                  <p className="text-sm text-slate-300 mb-4">
                    Can't find what you're looking for? Contact our support team.
                  </p>
                  <div className="space-y-2">
                    <Button size="sm" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" asChild>
                      <Link to="/support/report-bug">Report Issue</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-slate-600 text-slate-300" asChild>
                      <Link to="/support/feedback">Send Feedback</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
