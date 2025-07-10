import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Edit, Flag, Reply, Heart } from 'lucide-react';
import { Button, Card } from '../ui';
import ReplyForm from './ReplyForm';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateUtils';
import { snippetsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, onDelete, onEdit, onReply, snippetId }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const actionsRef = useRef(null);

  const isOwner = user && user.id === comment.author.id;
  const isAdmin = user && user.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

  // Initialize like state from backend response
  useEffect(() => {
    setLiked(comment.isLiked || false);
    setLikeCount(comment.likeCount || 0);
  }, [comment.isLiked, comment.likeCount]);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleDelete = async () => {
    if (!canDelete || deleting) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditContent(comment.content);
    setShowActions(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editContent.trim() || editContent.trim() === comment.content) {
      setEditing(false);
      return;
    }

    try {
      setSubmitting(true);
      
      if (onEdit) {
        await onEdit(comment.id, { content: editContent.trim() });
      }
      
      setEditing(false);
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error('Failed to update comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditContent(comment.content);
  };

  const handleReply = () => {
    if (!user) {
      toast.error('Please login to reply to comments');
      return;
    }
    setShowReplyForm(true);
    setShowActions(false);
  };

  const handleReplySubmit = async (replyData) => {
    try {
      setSubmitting(true);
      await onReply(replyData);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }
    
    try {
      const response = await snippetsAPI.toggleCommentLike(snippetId, comment.id);
      const { liked: newLiked, likeCount: newCount } = response.data;
      
      // Update state with response from server
      setLiked(newLiked);
      setLikeCount(newCount);
      
      toast.success(newLiked ? '❤️ Comment liked!' : '💔 Comment unliked!');
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
      toast.error('Failed to update like status');
    }
  };

  // Helper function to parse mentions in comment content
  const parseCommentContent = (content) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a username mention
        return (
          <Link
            key={index}
            to={`/users/${part}`}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            @{part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <>
      <Card className="relative" id={`comment-${comment.id}`}>
        <Card.Content>
          <div className="flex space-x-4">
            {/* Author Avatar */}
            <img
              src={comment.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`}
              alt={comment.author.username}
              className="w-10 h-10 rounded-full border-2 border-slate-600"
            />
            
            <div className="flex-1 min-w-0">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/users/${comment.author.username}`}
                    className="font-medium text-white hover:text-cyan-400 transition-colors"
                  >
                    {comment.author.username}
                  </Link>
                  <span className="text-slate-400 text-sm">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                    <span className="text-slate-500 text-xs">(edited)</span>
                  )}
                </div>

                {/* Actions Menu */}
                {(canDelete || isOwner) && !editing && (
                  <div className="relative" ref={actionsRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowActions(!showActions)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>

                    {showActions && (
                      <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                        <div className="py-1">
                          {isOwner && (
                            <button
                              onClick={handleEdit}
                              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-700 flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={handleDelete}
                              disabled={deleting}
                              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                          {!isOwner && (
                            <button
                              onClick={() => {
                                // TODO: Implement report functionality
                                console.log('Report comment:', comment.id);
                                toast.info('Report functionality coming soon!');
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-yellow-400 hover:bg-slate-700 flex items-center"
                            >
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editing ? (
                <div className="mb-3">
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      rows={3}
                      maxLength={1000}
                      autoFocus
                      placeholder="Edit your comment..."
                    />
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${
                        editContent.length > 900 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {editContent.length}/1000
                      </span>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleEditCancel}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!editContent.trim() || editContent.trim() === comment.content || submitting}
                          isLoading={submitting}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-slate-300 whitespace-pre-wrap break-words mb-3">
                  {parseCommentContent(comment.content)}
                </div>
              )}

              {/* Comment Actions */}
              {!editing && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-sm transition-all duration-200 hover:scale-105 ${
                      liked 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-slate-400 hover:text-red-400'
                    }`}
                    disabled={!user}
                  >
                    <Heart className={`w-4 h-4 transition-all duration-200 ${
                      liked ? 'fill-current scale-110' : ''
                    }`} />
                    <span className="font-medium">{likeCount}</span>
                  </button>
                  
                  {user && (
                    <button
                      onClick={handleReply}
                      className="flex items-center space-x-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Reply Form */}
      {showReplyForm && !editing && (
        <ReplyForm
          replyToComment={comment}
          onSubmit={handleReplySubmit}
          onCancel={() => setShowReplyForm(false)}
          loading={submitting}
        />
      )}
    </>
  );
};

export default CommentItem;
