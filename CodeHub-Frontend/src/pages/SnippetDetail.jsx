import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  Eye, 
  Clock, 
  Copy, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Flag,
  Calendar,
  Code2,
  User,
  Tag,
  MessageSquare,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button, Card, Loading } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { snippetsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SnippetDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);  const [isStarred, setIsStarred] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

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
      'Shell': '#89e051'
    };
    return colors[language] || '#6b7280';
  };
  useEffect(() => {
    const loadSnippet = async () => {
      try {
        console.log('🔄 [SnippetDetail] Loading snippet with ID:', id);
        setLoading(true);
        
        const response = await snippetsAPI.getSnippetById(id);
        console.log('✅ [SnippetDetail] Snippet loaded:', response.data);
        
        if (response.data) {
          // Transform API data to match component expectations
          const snippetData = {
            ...response.data,
            author: {
              username: response.data.owner?.username || 'Anonymous',
              name: response.data.owner?.fullName || response.data.owner?.username || 'Anonymous',
              avatar: response.data.owner?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.owner?.username || 'anonymous'}`,
              bio: response.data.owner?.bio || '',
              followers: 0, // Not available in current API
              following: 0  // Not available in current API
            },
            stats: {
              views: response.data.viewCount || 0,
              stars: response.data.likeCount || 0,
              forks: 0, // Not available in current API
              bookmarks: 0 // Not available in current API
            },
            languageColor: getLanguageColor(response.data.language),
            comments: [], // TODO: Load comments separately
            relatedSnippets: [] // TODO: Load related snippets
          };
          
          setSnippet(snippetData);
        }
      } catch (error) {
        console.error('❌ [SnippetDetail] Error loading snippet:', error);
        toast.error('Failed to load snippet');
        // Don't set snippet to null, let the loading state handle the error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSnippet();
    }
  }, [id]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    // API call to star/unstar snippet
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // API call to bookmark/unbookmark snippet
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading type="spinner" size="lg" text="Loading snippet..." />;
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Snippet not found</h2>
          <p className="text-slate-400 mb-6">The snippet you're looking for doesn't exist.</p>
          <Link to="/snippets">
            <Button>Browse Snippets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: snippet.languageColor }}
                    ></div>
                    <span className="text-slate-400">{snippet.language}</span>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{snippet.stats.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{snippet.stats.stars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-4 h-4" />
                        <span>{snippet.stats.forks}</span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {snippet.title}
                  </h1>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {snippet.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleStar}
                  variant={isStarred ? "primary" : "outline"}
                  className="flex items-center space-x-2"
                >
                  <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
                  <span>{isStarred ? 'Starred' : 'Star'}</span>
                  <span className="text-xs">({snippet.stats.stars})</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-2">
                  <GitFork className="w-4 h-4" />
                  <span>Fork</span>
                  <span className="text-xs">({snippet.stats.forks})</span>
                </Button>

                <Button
                  onClick={handleBookmark}
                  variant={isBookmarked ? "primary" : "outline"}
                  className="flex items-center space-x-2"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>

                {user && user.username === snippet.author.username && (
                  <>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-2 text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </>
                )}

                <Button variant="outline" className="flex items-center space-x-2">
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </Button>
              </div>
            </motion.div>

            {/* Code Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Code</h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                      <span className="text-sm text-slate-400">
                        {snippet.language} • {snippet.code.split('\\n').length} lines
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-slate-300">{snippet.code}</code>
                    </pre>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/snippets?tag=${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments ({snippet.comments.length})
              </h3>

              {/* Add Comment */}
              {user && (
                <Card className="mb-6">
                  <Card.Content>
                    <div className="flex space-x-4">
                      <img
                        src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment..."
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          rows="3"
                        />
                        <div className="flex justify-end mt-3">
                          <Button size="sm">Post Comment</Button>
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {snippet.comments.map((comment) => (
                  <Card key={comment.id}>
                    <Card.Content>
                      <div className="flex space-x-4">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link
                              to={`/users/${comment.author.username}`}
                              className="font-medium text-white hover:text-cyan-400 transition-colors"
                            >
                              {comment.author.username}
                            </Link>
                            <span className="text-slate-400 text-sm">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-slate-400 hover:text-white transition-colors text-sm">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-white">Author</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-center">
                      <img
                        src={snippet.author.avatar}
                        alt={snippet.author.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4"
                      />
                      <Link
                        to={`/users/${snippet.author.username}`}
                        className="block font-semibold text-white hover:text-cyan-400 transition-colors mb-1"
                      >
                        {snippet.author.name}
                      </Link>
                      <p className="text-slate-400 text-sm mb-3">@{snippet.author.username}</p>
                      {snippet.author.bio && (
                        <p className="text-slate-300 text-sm mb-4">{snippet.author.bio}</p>
                      )}
                      <div className="flex justify-center space-x-4 text-sm text-slate-400 mb-4">
                        <div className="text-center">
                          <div className="font-semibold text-white">{snippet.author.followers}</div>
                          <div>Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-white">{snippet.author.following}</div>
                          <div>Following</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Follow
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>

              {/* Snippet Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-white">Details</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Created</span>
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(snippet.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Updated</span>
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(snippet.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Language</span>
                        <span className="text-slate-300">{snippet.language}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Lines</span>
                        <span className="text-slate-300">{snippet.code.split('\\n').length}</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>

              {/* Related Snippets */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-white">Related Snippets</h3>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      {snippet.relatedSnippets.map((related) => (
                        <Link
                          key={related.id}
                          to={`/snippets/${related.id}`}
                          className="block p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          <h4 className="font-medium text-white text-sm mb-1">
                            {related.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>by {related.author}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{related.stars}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card.Content>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetDetail;
