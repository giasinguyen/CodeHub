import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

const CommentForm = ({ 
  onSubmit, 
  onCancel, 
  placeholder = "Add a comment...", 
  loading = false,
  autoFocus = false 
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(autoFocus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      await onSubmit({ content: content.trim() });
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

  const isValid = content.trim().length > 0 && content.trim().length <= 1000;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-3">
        <img
          src={user?.avatar || user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt={user?.username || 'User'}
          className="w-10 h-10 rounded-full border-2 border-slate-600"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            className={`w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
              focused ? 'min-h-[100px]' : 'min-h-[80px]'
            }`}
            rows={focused ? 4 : 3}
            maxLength={1000}
            autoFocus={autoFocus}
          />
          
          {/* Character count */}
          {focused && (
            <div className="text-right mt-1">
              <span className={`text-xs ${
                content.length > 900 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {content.length}/1000
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {focused && (
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
            Post Comment
          </Button>
        </div>
      )}
    </form>
  );
};

export default CommentForm;
