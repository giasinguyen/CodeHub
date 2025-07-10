import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { Button } from '../ui';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CommentThread = ({ comment, onDelete, onEdit, onReply, replies = [], snippetId }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <CommentItem
        comment={comment}
        onDelete={onDelete}
        onEdit={onEdit}
        onReply={onReply}
        snippetId={snippetId}
      />

      {/* Replies Toggle */}
      {replies.length > 0 && (
        <div className="ml-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="text-slate-400 hover:text-cyan-400 text-sm"
          >
            {showReplies ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 border-slate-700 pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onEdit={onEdit}
              onReply={onReply}
              snippetId={snippetId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
