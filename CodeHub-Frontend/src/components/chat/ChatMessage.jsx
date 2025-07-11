import React from 'react';
import { User, Download, FileText } from 'lucide-react';
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file download
  const handleFileDownload = async () => {
    console.log('🔽 [ChatMessage] Download clicked for message:', message);
    console.log('🔽 [ChatMessage] File URL:', message.fileUrl);
    console.log('🔽 [ChatMessage] File name:', message.fileName);
    
    if (!message.fileUrl) {
      console.error('❌ [ChatMessage] No fileUrl found in message');
      alert('File URL not found. Cannot download file.');
      return;
    }

    try {
      // Method 1: Try with fetch API (handles CORS better)
      console.log('🔽 [ChatMessage] Attempting download with fetch API...');
      
      const response = await fetch(message.fileUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = message.fileName || message.content || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(url);
      
      console.log('✅ [ChatMessage] Download completed successfully with fetch API');
      
    } catch (fetchError) {
      console.error('❌ [ChatMessage] Fetch download failed:', fetchError);
      
      // Fallback Method 2: Direct link download
      try {
        console.log('� [ChatMessage] Trying direct link download...');
        
        const link = document.createElement('a');
        link.href = message.fileUrl;
        link.download = message.fileName || message.content || 'download';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ [ChatMessage] Direct download triggered');
        
      } catch (directError) {
        console.error('❌ [ChatMessage] Direct download failed:', directError);
        
        // Fallback Method 3: Open in new tab
        try {
          console.log('🔄 [ChatMessage] Opening file in new tab...');
          window.open(message.fileUrl, '_blank', 'noopener,noreferrer');
          console.log('✅ [ChatMessage] File opened in new tab');
        } catch (tabError) {
          console.error('❌ [ChatMessage] All download methods failed:', tabError);
          alert('Unable to download file. Please copy the file URL and download manually.');
        }
      }
    }
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
          {/* File message rendering */}
          {message.messageType === 'FILE' ? (
            <div className="flex items-center space-x-3 min-w-[200px]">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {message.fileName || message.content}
                </div>
                <div className="text-xs opacity-75">
                  {formatFileSize(message.fileSize)}
                </div>
                {/* Debug info - remove in production */}
                <div className="text-xs text-yellow-400 mt-1">
                  URL: {message.fileUrl ? '✅ Available' : '❌ Missing'}
                </div>
              </div>
              <button
                onClick={handleFileDownload}
                className="flex-shrink-0 p-1 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
                title="Tải xuống"
                disabled={!message.fileUrl}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Text message content with proper word wrapping and emoji support */
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
          )}
          
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
