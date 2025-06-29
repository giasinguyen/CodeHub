import React from 'react';
import { formatTime } from '../../utils/dateUtils';

const ChatMessage = ({ message, isOwn, showAvatar = true }) => {
  const messageTime = formatTime(message.timestamp || message.createdAt);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 mr-3">
          <img
            src={message.senderAvatar || '/default-avatar.png'}
            alt={message.senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-lg shadow-sm
            ${isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-slate-700 text-slate-100 rounded-bl-sm'
            }
          `}
        >
          {/* Sender name for received messages */}
          {!isOwn && (
            <div className="text-xs text-slate-400 mb-1 font-medium">
              {message.senderName}
            </div>
          )}
          
          {/* Message content */}
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Message timestamp */}
        <div
          className={`
            text-xs text-slate-500 mt-1
            ${isOwn ? 'text-right' : 'text-left'}
          `}
        >
          {messageTime}
          {isOwn && message.readAt && (
            <span className="ml-1 text-green-400">✓</span>
          )}
        </div>
      </div>

      {/* Avatar for sent messages */}
      {isOwn && showAvatar && (
        <div className="flex-shrink-0 ml-3">
          <img
            src={message.senderAvatar || '/default-avatar.png'}
            alt="You"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
