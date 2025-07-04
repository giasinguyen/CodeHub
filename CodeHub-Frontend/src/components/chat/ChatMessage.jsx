import React from 'react';
import { User } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

const ChatMessage = ({ message, isOwnMessage = false, showAvatar = true, showTimestamp = false }) => {
  const messageTime = formatTime(message.timestamp || message.createdAt);

  // Get avatar URL from message sender info
  const getAvatarUrl = () => {
    if (message.sender?.avatarUrl) return message.sender.avatarUrl;
    if (message.senderAvatarUrl) return message.senderAvatarUrl;
    return null;
  };

  // Get sender name from message sender info
  const getSenderName = () => {
    if (message.sender?.fullName) return message.sender.fullName;
    if (message.sender?.username) return message.sender.username;
    if (message.senderUsername) return message.senderUsername;
    return 'Unknown User';
  };

  // Get initials for fallback avatar
  const getInitials = () => {
    const name = getSenderName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start gap-3 mb-4 px-4`}>
      {/* Avatar - Fixed position */}
      <div className="flex-shrink-0 w-8 h-8">
        {showAvatar ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt={getSenderName()}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium ${
                getAvatarUrl() ? 'hidden' : 'flex'
              }`}
            >
              {getInitials() || <User className="w-4 h-4" />}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8"></div> // Placeholder to maintain consistent spacing
        )}
      </div>

      {/* Message Content - Fixed width container */}
      <div className={`flex-1 max-w-md ${isOwnMessage ? 'text-right' : 'text-left'}`}>
        {/* Sender name for received messages */}
        {!isOwnMessage && showAvatar && (
          <div className="text-xs text-slate-400 mb-1 font-medium">
            {getSenderName()}
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`
            inline-block px-4 py-2 rounded-lg shadow-sm relative max-w-full
            ${isOwnMessage
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm'
              : 'bg-slate-700 text-slate-100 rounded-bl-sm'
            }
          `}
        >
          {/* Message content with proper word wrapping */}
          <div 
            className="text-sm leading-relaxed break-words"
            style={{ 
              wordWrap: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {message.content}
          </div>
          
          {/* Message type indicator for non-text messages */}
          {message.messageType && message.messageType !== 'TEXT' && (
            <div className="text-xs opacity-75 mt-1">
              {message.messageType === 'IMAGE' && '📷 Image'}
              {message.messageType === 'FILE' && '📎 File'}
              {message.messageType === 'SYSTEM' && '🤖 System'}
            </div>
          )}
        </div>

        {/* Message timestamp and status */}
        {showTimestamp && (
          <div className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            <span>{messageTime}</span>
            {isOwnMessage && (
              <span className="ml-2">
                {message.isRead ? (
                  <span className="text-green-400">✓✓</span>
                ) : (
                  <span className="text-slate-400">✓</span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
