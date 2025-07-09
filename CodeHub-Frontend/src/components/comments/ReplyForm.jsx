import React, { useState } from 'react';
import { Send, X, Reply } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

const ReplyForm = ({ 
  onSubmit, 
  onCancel, 
  replyToComment,
  loading = false,
  autoFocus = true 
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(`@${replyToComment.author.username} `);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      await onSubmit({ 
        content: content.trim(),
        replyToCommentId: replyToComment.id,
        replyToUsername: replyToComment.author.username
      });
      setContent('');
      onCancel();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel();
  };

  const isValid = content.trim().length > 0 && 
                  content.trim().length <= 1000 && 
                  content.trim() !== `@${replyToComment.author.username}`;

  return (
    <div className="mt-4 pl-12 border-l-2 border-cyan-500/30">
      <div className="bg-slate-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3 text-sm text-slate-400">
          <Reply className="w-4 h-4" />
          <span>Replying to</span>
          <span className="text-cyan-400">@{replyToComment.author.username}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <img
              src={user?.avatar || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.username || 'User'}
              className="w-8 h-8 rounded-full border-2 border-slate-600"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Reply to @${replyToComment.author.username}...`}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all min-h-[80px]"
                rows={3}
                maxLength={1000}
                autoFocus={autoFocus}
              />
              
              {/* Character count */}
              <div className="text-right mt-1">
                <span className={`text-xs ${
                  content.length > 900 ? 'text-red-400' : 'text-slate-400'
                }`}>
                  {content.length}/1000
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || loading}
              isLoading={loading}
            >
              <Send className="w-4 h-4 mr-1" />
              Reply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyForm;
