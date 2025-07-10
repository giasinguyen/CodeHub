import React, { useState } from 'react';
import { Send, X, Type } from 'lucide-react';
import { Button } from '../ui';
import RichTextEditor from '../ui/RichTextEditor';
import { useAuth } from '../../contexts/AuthContext';

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Add a comment...", 
  loading = false,
  autoFocus = false,
  parentComment = null,
  mentions = []
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(
    parentComment ? `@${parentComment.author.username} ` : ''
  );
  const [focused, setFocused] = useState(autoFocus);
  const [useRichText, setUseRichText] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      const commentData = {
        content: content.trim(),
        parentCommentId: parentComment?.id || null,
        replyToUsername: parentComment?.author.username || null
      };
      
      await onSubmit(commentData);
      setContent('');
      setFocused(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const handleCancel = () => {
    setContent('');
    setFocused(false);
    if (onCancel) onCancel();
  };

  const handleMention = (mention) => {
    console.log('User mentioned:', mention);
  };

  const isValid = content.trim().length > 0 && content.trim().length <= 2000;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-3">
        <img
          src={user?.avatar || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt={user?.username || 'User'}
          className="w-10 h-10 rounded-full border-2 border-slate-600 flex-shrink-0 mt-1"
        />
        <div className="flex-1">
          {parentComment && (
            <div className="mb-2 text-sm text-slate-400">
              Replying to <span className="text-cyan-400">@{parentComment.author.username}</span>
            </div>
          )}
          
          {useRichText ? (
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={placeholder}
              maxLength={2000}
              mentions={mentions}
              onMention={handleMention}
            />
          ) : (
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder={placeholder}
                className={`w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                  focused ? 'min-h-[100px]' : 'min-h-[80px]'
                }`}
                rows={focused ? 4 : 3}
                maxLength={2000}
                autoFocus={autoFocus}
              />
              
              {/* Character count */}
              {focused && (
                <div className="text-right mt-1">
                  <span className={`text-xs ${
                    content.length > 1800 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {content.length}/2000
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {focused && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUseRichText(!useRichText)}
              className="text-slate-400 hover:text-white"
            >
              <Type className="w-4 h-4 mr-1" />
              {useRichText ? 'Plain Text' : 'Rich Text'}
            </Button>
          </div>
          
          <div className="flex space-x-2">
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
              {parentComment ? 'Reply' : 'Post Comment'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default CommentForm;
