import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Eye,
  Star,
  Code2,
  Tag,
  User,
  Copy,
  Share2,
  ExternalLink,
  HeartOff,
  Bookmark,
  BookmarkX,
  Calendar,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Card, Button } from '../ui';

const FavoriteCard = ({
  favorite,
  index,
  viewMode,
  isSelected,
  isRemoving,
  onToggleSelect,
  onRemove,
  onCopyCode,
  formatNumber,
  formatTimeAgo
}) => {
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmarkToggle = async () => {
    setIsBookmarking(true);
    // Simulate API call
    setTimeout(() => {
      setIsBookmarking(false);
    }, 500);
  };
  const handleShare = async () => {
    try {
      await navigator.share({
        title: favorite.snippet.title,
        text: favorite.snippet.description,
        url: window.location.origin + `/snippets/${favorite.snippet.id}`
      });
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        window.location.origin + `/snippets/${favorite.snippet.id}`
      );
    }
  };

  const priorityColors = {
    high: 'bg-red-500/20 text-red-300 border-red-500/50',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    normal: 'bg-green-500/20 text-green-300 border-green-500/50'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const GridCard = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Card className={`group hover:shadow-xl transition-all duration-300 ${
        isSelected ? 'ring-2 ring-red-500' : ''
      }`}>
        <Card.Content className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(favorite.id)}
                  className="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                />
                <Link
                  to={`/snippets/${favorite.snippet.id}`}
                  className="text-lg font-semibold text-white hover:text-red-400 transition-colors line-clamp-1"
                >
                  {favorite.snippet.title}
                </Link>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                {favorite.snippet.description}
              </p>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                priorityColors[favorite.priority]
              }`}>
                {favorite.priority}
              </div>
            </div>
          </div>

          {/* Language and Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
              <Code2 className="w-3 h-3 mr-1" />
              {favorite.snippet.language}
            </span>
            {favorite.snippet.tags.slice(0, 2).map(tag => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {favorite.snippet.tags.length > 2 && (
              <span className="text-xs text-slate-400">
                +{favorite.snippet.tags.length - 2} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(favorite.snippet.viewCount)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{formatNumber(favorite.snippet.likeCount)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{favorite.snippet.commentCount}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <Link
                to={`/developers/${favorite.snippet.owner.id}`}
                className="hover:text-white transition-colors"
              >
                {favorite.snippet.owner.username}
              </Link>
            </div>
          </div>

          {/* Notes */}
          {favorite.notes && (
            <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300 line-clamp-2">
                  {favorite.notes}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onCopyCode(favorite.snippet.code)}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
              <Button
                onClick={handleBookmarkToggle}
                variant="secondary"
                size="sm"
                disabled={isBookmarking}
                className="flex items-center space-x-1"
              >
                {favorite.isBookmarked ? (
                  <BookmarkX className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={handleShare}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onRemove(favorite.id)}
                variant="danger"
                size="sm"
                disabled={isRemoving}
                className="flex items-center space-x-1"
              >
                <HeartOff className="w-4 h-4" />
                <span>Remove</span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-700/30">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Favorited {formatTimeAgo(favorite.favoritedAt)}</span>
            </span>
            <Link
              to={`/snippets/${favorite.snippet.id}`}
              className="flex items-center space-x-1 hover:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View snippet</span>
            </Link>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );

  const ListCard = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`relative ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 ${
        isSelected ? 'ring-2 ring-red-500' : ''
      }`}>
        <Card.Content className="p-4">
          <div className="flex items-start space-x-4">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(favorite.id)}
              className="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500 mt-1"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/snippets/${favorite.snippet.id}`}
                    className="text-lg font-semibold text-white hover:text-red-400 transition-colors line-clamp-1"
                  >
                    {favorite.snippet.title}
                  </Link>
                  <p className="text-slate-400 text-sm line-clamp-1 mt-1">
                    {favorite.snippet.description}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[favorite.priority]
                } ml-4`}>
                  {favorite.priority}
                </div>
              </div>

              {/* Meta info */}
              <div className="flex items-center space-x-6 mt-3 text-sm text-slate-400">
                <span className="flex items-center space-x-1">
                  <Code2 className="w-4 h-4" />
                  <span>{favorite.snippet.language}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <Link
                    to={`/developers/${favorite.snippet.owner.id}`}
                    className="hover:text-white transition-colors"
                  >
                    {favorite.snippet.owner.username}
                  </Link>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(favorite.snippet.viewCount)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{formatNumber(favorite.snippet.likeCount)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Favorited {formatTimeAgo(favorite.favoritedAt)}</span>
                </span>
              </div>

              {/* Notes */}
              {favorite.notes && (
                <div className="bg-slate-700/30 rounded-lg p-3 mt-3">
                  <p className="text-sm text-slate-300 line-clamp-1">
                    {favorite.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onCopyCode(favorite.snippet.code)}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleBookmarkToggle}
                variant="secondary"
                size="sm"
                disabled={isBookmarking}
                className="flex items-center space-x-1"
              >
                {favorite.isBookmarked ? (
                  <BookmarkX className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => onRemove(favorite.id)}
                variant="danger"
                size="sm"
                disabled={isRemoving}
                className="flex items-center space-x-1"
              >
                <HeartOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );

  return viewMode === 'grid' ? <GridCard /> : <ListCard />;
};

export default FavoriteCard;
