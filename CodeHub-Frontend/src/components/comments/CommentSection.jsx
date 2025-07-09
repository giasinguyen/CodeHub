import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button, Loading } from '../ui';
import CommentForm from './CommentForm';
import CommentThread from './CommentThread';
import { useAuth } from '../../contexts/AuthContext';
import { snippetsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CommentSection = ({ snippetId, initialCommentCount = 0 }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasMore: false
  });
  const [expanded, setExpanded] = useState(false);

  // Helper function to organize comments into threads
  const organizeComments = (comments) => {
    const threads = [];
    const replyMap = new Map();
    const processedReplies = new Set();

    // Sort comments by creation time to ensure proper ordering
    const sortedComments = [...comments].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // First pass: identify main comments and group replies
    sortedComments.forEach(comment => {
      if (comment.content.startsWith('@')) {
        // Extract the mentioned username
        const mentionMatch = comment.content.match(/^@(\w+)/);
        if (mentionMatch) {
          const mentionedUsername = mentionMatch[1];
          
          // Find the most recent parent comment this is replying to
          // Look for comments from this user that were posted before this reply
          const potentialParents = sortedComments.filter(c => 
            c.author.username === mentionedUsername &&
            new Date(c.createdAt) < new Date(comment.createdAt) &&
            !processedReplies.has(c.id) // Don't reply to replies
          );
          
          // Get the most recent parent comment
          const parentComment = potentialParents[potentialParents.length - 1];
          
          if (parentComment) {
            if (!replyMap.has(parentComment.id)) {
              replyMap.set(parentComment.id, []);
            }
            replyMap.get(parentComment.id).push(comment);
            processedReplies.add(comment.id);
            return;
          }
        }
      }
      
      // If no parent found, treat as main comment
      if (!processedReplies.has(comment.id)) {
        threads.push(comment);
      }
    });

    // Create thread structure with replies sorted by creation time
    const result = threads.map(mainComment => ({
      comment: mainComment,
      replies: (replyMap.get(mainComment.id) || []).sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      )
    }));
    
    console.log('🔄 [CommentSection] Organized comments:', {
      totalComments: comments.length,
      mainThreads: result.length,
      replyMap: Array.from(replyMap.entries()).map(([id, replies]) => ({
        parentId: id,
        replyCount: replies.length,
        replies: replies.map(r => ({ id: r.id, content: r.content.substring(0, 50) }))
      }))
    });
    
    return result;
  };

  // Update comment count when initialCommentCount changes
  useEffect(() => {
    console.log('🔄 [CommentSection] Initial comment count changed:', initialCommentCount);
    setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

  // Load comment count when component mounts
  useEffect(() => {
    const loadCommentCount = async () => {
      if (commentCount === 0) {
        try {
          console.log('🔄 [CommentSection] Loading comment count for snippet:', snippetId);
          const response = await snippetsAPI.getComments(snippetId, 0, 1);
          const totalCount = response.data.totalElements;
          console.log('✅ [CommentSection] Comment count loaded:', totalCount);
          setCommentCount(totalCount);
        } catch (error) {
          console.error('❌ [CommentSection] Failed to load comment count:', error);
        }
      }
    };
    
    loadCommentCount();
  }, [snippetId, commentCount]);

  // Load comments when component mounts or when expanded
  useEffect(() => {
    if (expanded && comments.length === 0) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, snippetId]);

  const loadComments = async (page = 0, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [CommentSection] Loading comments:', { snippetId, page, size: pagination.size });
      
      const response = await snippetsAPI.getComments(snippetId, page, pagination.size);
      const data = response.data;
      
      console.log('✅ [CommentSection] Comments loaded:', data);
      
      setComments(prev => {
        const newComments = append ? [...prev, ...data.content] : data.content;
        console.log('📝 [CommentSection] Updated comments after load:', newComments);
        return newComments;
      });
      
      setPagination({
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        hasMore: !data.last
      });
      
      // Update comment count if this is the first load
      if (!append) {
        setCommentCount(data.totalElements);
      }
    } catch (error) {
      console.error('❌ [CommentSection] Failed to load comments:', error);
      setError('Failed to load comments');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = () => {
    if (pagination.hasMore && !loading) {
      loadComments(pagination.page + 1, true);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      setSubmitting(true);
      console.log('🔄 [CommentSection] Adding comment:', commentData);
      
      const response = await snippetsAPI.addComment(snippetId, commentData);
      console.log('✅ [CommentSection] Comment added successfully:', response.data);
      
      // Expand comments section first
      setExpanded(true);
      
      // Add new comment to the top of the list
      setComments(prev => {
        const newComments = [response.data, ...prev];
        console.log('📝 [CommentSection] Updated comments list:', newComments);
        return newComments;
      });
      
      // Update counts
      setCommentCount(prev => prev + 1);
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements + 1
      }));
      
      toast.success('Comment added successfully!');
      
    } catch (error) {
      console.error('❌ [CommentSection] Failed to add comment:', error);
      toast.error('Failed to add comment');
      throw error; // Re-throw to handle in CommentForm
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await snippetsAPI.deleteComment(snippetId, commentId);
      
      // Remove comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // Update counts
      setCommentCount(prev => Math.max(0, prev - 1));
      setPagination(prev => ({
        ...prev,
        totalElements: Math.max(0, prev.totalElements - 1)
      }));
      
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
      throw error;
    }
  };

  const handleEditComment = (comment) => {
    // TODO: Implement edit functionality
    console.log('Edit comment:', comment);
    toast.info('Edit functionality coming soon!');
  };

  const refreshComments = () => {
    setComments([]);
    loadComments(0);
  };

  const totalComments = commentCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Comments ({totalComments})
        </h3>
        
        <div className="flex items-center space-x-2">
          {expanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshComments}
              disabled={loading}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Comments
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Comments
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick comment button when not expanded */}
      {!expanded && user && (
        <Button
          variant="outline"
          onClick={() => setExpanded(true)}
          className="w-full text-left justify-start text-slate-400 hover:text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Add a comment...
        </Button>
      )}

      {/* Comment Form - Only visible when expanded and user is logged in */}
      {expanded && user && (
        <CommentForm
          onSubmit={handleAddComment}
          loading={submitting}
          placeholder="Share your thoughts about this snippet..."
        />
      )}

      {/* Login prompt - Only visible when expanded and user is not logged in */}
      {expanded && !user && (
        <div className="text-center py-8 text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="mb-4">Join the conversation!</p>
          <p className="text-sm">
            <a href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </a>{' '}
            to share your thoughts and engage with the community.
          </p>
        </div>
      )}

      {/* Comments List */}
      {expanded && (
        <div className="space-y-4">
          {loading && comments.length === 0 && (
            <div className="flex justify-center py-8">
              <Loading size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadComments()}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && comments.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet.</p>
              {user && (
                <p className="text-sm mt-2">Be the first to share your thoughts!</p>
              )}
            </div>
          )}

          {organizeComments(comments).map((thread) => (
            <CommentThread
              key={thread.comment.id}
              comment={thread.comment}
              replies={thread.replies}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onReply={handleAddComment}
            />
          ))}

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={loadMoreComments}
                disabled={loading}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More Comments
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
