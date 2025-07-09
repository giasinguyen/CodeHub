import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Trash2, Edit, Flag } from 'lucide-react';
import { Button, Card } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/dateUtils';

const CommentItem = ({ comment, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const actionsRef = useRef(null);

  const isOwner = user && user.id === comment.author.id;
  const isAdmin = user && user.role === 'ADMIN';
  const canDelete = isOwner || isAdmin;

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
    if (onEdit) {
      onEdit(comment);
    }
  };

  return (
    <Card className="relative">
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
              {(canDelete || isOwner) && (
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
            <div className="text-slate-300 whitespace-pre-wrap break-words">
              {comment.content}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CommentItem;
