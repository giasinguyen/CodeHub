import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Code2, Eye, User } from 'lucide-react';

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'SNIPPET_CREATED':
        return <Code2 className="w-5 h-5 text-cyan-400" />;
      case 'SNIPPET_UPDATED':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'SNIPPET_LIKED':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'SNIPPET_UNLIKED':
        return <Star className="w-5 h-5 text-slate-400" />;
      case 'COMMENT_ADDED':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'PROFILE_UPDATED':
        return <User className="w-5 h-5 text-purple-400" />;
      case 'SNIPPET_VIEWED':
        return <Eye className="w-5 h-5 text-green-400" />;
      default:
        return <Eye className="w-5 h-5 text-slate-400" />;
    }
  };

  const getActivityText = (activity) => {
    const { type, data } = activity;
    
    switch (type) {
      case 'SNIPPET_CREATED':
        return (
          <span>
            Created snippet{" "}
            <Link 
              to={`/snippets/${data.snippet?.id}`}
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              "{data.snippet?.title}"
            </Link>
            {data.snippet?.language && (
              <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                {data.snippet.language}
              </span>
            )}
          </span>
        );
      case 'SNIPPET_UPDATED':
        return (
          <span>
            Updated snippet{" "}
            <Link 
              to={`/snippets/${data.snippet?.id}`}
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              "{data.snippet?.title}"
            </Link>
          </span>
        );
      case 'SNIPPET_LIKED':
        return (
          <span>
            Liked{" "}
            <Link 
              to={`/snippets/${data.snippet?.id}`}
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              "{data.snippet?.title}"
            </Link>
            {data.snippet?.author && (
              <span> by <span className="text-cyan-400">@{data.snippet.author}</span></span>
            )}
          </span>
        );
      case 'SNIPPET_UNLIKED':
        return (
          <span>
            Unliked{" "}
            <Link 
              to={`/snippets/${data.snippet?.id}`}
              className="font-medium text-slate-400 hover:text-slate-300 transition-colors"
            >
              "{data.snippet?.title}"
            </Link>
          </span>
        );
      case 'COMMENT_ADDED':
        return (
          <span>
            Commented on{" "}
            <Link 
              to={`/snippets/${data.snippet?.id}`}
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              "{data.snippet?.title}"
            </Link>
            {data.comment && (
              <div className="mt-2 p-3 bg-slate-800/50 rounded-lg text-sm">
                <div className="text-slate-400 text-xs mb-1">Comment:</div>
                <div className="italic text-slate-300">
                  "{data.comment.length > 150 ? data.comment.substring(0, 150) + '...' : data.comment}"
                </div>
              </div>
            )}
          </span>
        );
      case 'PROFILE_UPDATED':
        return (
          <span>
            Updated profile information
          </span>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 hover:bg-slate-800/30 transition-colors">
      <div className="flex items-start space-x-3">
        {/* Activity Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
          {getActivityIcon(activity.type)}
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="text-slate-300">
            {getActivityText(activity)}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-500">
              {formatTimeAgo(activity.createdAt)}
            </span>
            {activity.user && (
              <div className="flex items-center space-x-2">
                <img 
                  src={activity.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user.username}`}
                  alt={activity.user.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-slate-400">
                  {activity.user.fullName || activity.user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
