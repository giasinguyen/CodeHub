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

  // Format message content with basic markdown-like support and emoji
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    let formatted = content;
    
    // Preserve emojis by replacing them with placeholders temporarily
    const emojiMap = new Map();
    let emojiCounter = 0;
    
    // Match Unicode emojis and replace with placeholders
    formatted = formatted.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, (match) => {
      const placeholder = `__EMOJI_${emojiCounter}__`;
      emojiMap.set(placeholder, match);
      emojiCounter++;
      return placeholder;
    });
    
    // Convert URLs to links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline break-all">$1</a>'
    );
    
    // Convert **bold** to bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert `code` to code
    formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-slate-600 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Restore emojis with proper styling
    emojiMap.forEach((emoji, placeholder) => {
      formatted = formatted.replace(placeholder, `<span class="emoji" style="font-size: 1.2em; line-height: 1;">${emoji}</span>`);
    });
    
    return formatted;
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
          {/* Message content with proper word wrapping and emoji support */}
          <div 
            className="text-sm leading-relaxed break-words"
            style={{ 
              wordWrap: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content) 
            }}
          />
          
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
