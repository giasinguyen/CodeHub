import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  MessageCircle,
  Search,
  Send,
  Smile,
  Paperclip,
  User,
  Download,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatHistoryAPI } from '../../services/api';
import { Button, Input } from '../ui';
import ChatMessage from './ChatMessage';
import EmojiPicker from './EmojiPicker';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ConversationView = ({ 
  conversation, 
  onBack, 
  onSendMessage 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadMessages = useCallback(async (pageNum = 0, append = false) => {
    if (!conversation) return;

    try {
      setLoading(!append);
      
      let response;
      if (conversation.participantUsername) {
        // Load messages by username
        response = await chatHistoryAPI.getConversationMessages(
          conversation.participantUsername, 
          pageNum, 
          50
        );
      } else {
        // Load messages by chat ID
        response = await chatHistoryAPI.getMessagesByChatId(
          conversation.chatId, 
          pageNum, 
          50
        );
      }
      
      if (response.data) {
        const newMessages = response.data.content || [];
        
        if (append) {
          // Store current scroll position
          const container = messagesContainerRef.current;
          const scrollHeightBefore = container?.scrollHeight || 0;
          
          setMessages(prev => [...newMessages.reverse(), ...prev]);
          
          // Maintain scroll position after adding older messages
          setTimeout(() => {
            if (container) {
              const scrollHeightAfter = container.scrollHeight;
              container.scrollTop = scrollHeightAfter - scrollHeightBefore;
            }
          }, 0);
        } else {
          setMessages(newMessages.reverse()); // Reverse for chronological order
        }
        
        setHasMore(!response.data.last);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversation) {
      loadMessages();
    }
  }, [conversation, loadMessages]);

  // Scroll to bottom when new messages arrive (only for new messages, not when loading history)
  useEffect(() => {
    if (messages.length > 0 && page === 0) {
      scrollToBottom();
    }
  }, [messages, page]);

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      loadMessages(page + 1, true);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    console.log('ConversationView: toggleEmojiPicker called, current state:', showEmojiPicker);
    setShowEmojiPicker(prev => !prev);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    console.log('ConversationView: emoji selected:', emoji);
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File không được lớn hơn 10MB');
      return;
    }

    setSelectedFile(file);
    setUploadingFile(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('messageType', 'FILE');
      
      if (conversation.participantUsername) {
        formData.append('recipientUsername', conversation.participantUsername);
      } else if (conversation.roomId) {
        formData.append('roomId', conversation.roomId);
      }

      // Upload file and send message
      const response = await chatHistoryAPI.sendFileMessage(formData);
      
      if (response.success) {
        // Add file message to local state
        const fileMessage = {
          id: Date.now().toString(),
          content: file.name,
          messageType: 'FILE',
          fileName: file.name,
          fileSize: file.size,
          fileUrl: response.data.fileUrl,
          sender: { 
            id: user.id, 
            username: user.username, 
            fullName: user.fullName 
          },
          createdAt: new Date().toISOString(),
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, fileMessage]);
        
        // Call parent onSendMessage if provided
        if (onSendMessage) {
          onSendMessage(fileMessage);
        }

        toast.success('File đã được gửi thành công');
      } else {
        toast.error('Lỗi khi gửi file');
      }
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Lỗi khi gửi file');
    } finally {
      setUploadingFile(false);
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || sendingMessage) return;

    const messageContent = messageText.trim();
    setMessageText(''); // Clear immediately for better UX

    try {
      setSendingMessage(true);
      
      // If onSendMessage callback is provided, use it (for real-time sending)
      if (onSendMessage) {
        await onSendMessage({
          chatId: conversation.chatId,
          content: messageContent,
          messageType: 'TEXT'
        });
      }
      
      // Add optimistic message to UI
      const optimisticMessage = {
        id: Date.now(), // Temporary ID
        content: messageContent,
        sender: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl
        },
        createdAt: new Date().toISOString(),
        messageType: 'TEXT',
        isRead: false
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Scroll to bottom to show new message
      setTimeout(scrollToBottom, 100);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
      // Restore message text if failed
      setMessageText(messageContent);
    } finally {
      setSendingMessage(false);
    }
  };

  const getConversationDisplayName = () => {
    if (!conversation) return '';
    if (conversation.roomType === 'GROUP') {
      return conversation.roomName;
    }
    return conversation.participantFullName || conversation.participantUsername;
  };

  const getConversationAvatar = () => {
    if (!conversation) return null;
    
    if (conversation.roomType === 'GROUP') {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {conversation.roomName ? conversation.roomName[0].toUpperCase() : 'G'}
          </span>
        </div>
      );
    }
    
    const avatarElement = conversation.participantAvatarUrl ? (
      <img
        src={conversation.participantAvatarUrl}
        alt={conversation.participantUsername}
        className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-cyan-500 transition-all cursor-pointer"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center hover:ring-2 hover:ring-cyan-500 transition-all cursor-pointer">
        <span className="text-white font-semibold text-sm">
          {(conversation.participantUsername || 'U')[0].toUpperCase()}
        </span>
      </div>
    );

    // Wrap avatar in Link if we have a participant username
    if (conversation.participantUsername) {
      return (
        <Link to={`/users/${conversation.participantUsername}`}>
          {avatarElement}
        </Link>
      );
    }

    return avatarElement;
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Chọn một cuộc trò chuyện
          </h3>
          <p className="text-slate-400 text-sm">
            Chọn cuộc trò chuyện từ danh sách để xem tin nhắn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-800 h-full relative">
      {/* Header - Fixed height */}
      <div className="h-16 p-4 border-b border-slate-700 bg-slate-900 flex-shrink-0">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            {getConversationAvatar()}
            
            <div className="min-w-0">
              {conversation.participantUsername && conversation.roomType !== 'GROUP' ? (
                <Link to={`/profile/${conversation.participantUsername}`}>
                  <h3 className="font-semibold text-white truncate hover:text-cyan-400 transition-colors cursor-pointer">
                    {getConversationDisplayName()}
                  </h3>
                </Link>
              ) : (
                <h3 className="font-semibold text-white truncate">
                  {getConversationDisplayName()}
                </h3>
              )}
              <p className="text-sm text-slate-400 truncate">
                {conversation.isOnline ? 'Đang online' : 
                 conversation.lastSeenAt ? 
                   `Hoạt động ${formatDistanceToNow(new Date(conversation.lastSeenAt), { addSuffix: true })}` : 
                   'Offline'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container - Flexible height with scroll */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-slate-800"
        onScroll={(e) => {
          const { scrollTop } = e.target;
          if (scrollTop === 0 && hasMore && !loading) {
            loadMoreMessages();
          }
        }}
      >
        {/* Load More Indicator at top */}
        {hasMore && (
          <div className="sticky top-0 bg-slate-800 p-3 text-center border-b border-slate-700/50 z-10">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                <span className="ml-2 text-sm text-slate-400">Đang tải tin nhắn cũ...</span>
              </div>
            ) : (
              <button
                onClick={loadMoreMessages}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium py-1 px-3 rounded hover:bg-slate-700 transition-colors"
              >
                Tải tin nhắn cũ hơn
              </button>
            )}
          </div>
        )}

        {/* Messages List */}
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-slate-400">Đang tải tin nhắn...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                Chưa có tin nhắn
              </h3>
              <p className="text-slate-400 text-sm">
                Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id}
                message={message}
                isOwnMessage={message.sender?.id === user?.id}
                showAvatar={
                  index === 0 || 
                  messages[index - 1]?.sender?.id !== message.sender?.id
                }
                showTimestamp={
                  index === messages.length - 1 ||
                  (index < messages.length - 1 && 
                   new Date(message.createdAt).getTime() - 
                   new Date(messages[index + 1]?.createdAt || 0).getTime() > 300000) // 5 minutes
                }
              />
            ))}
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed height */}
      <div className="h-16 p-4 border-t border-slate-700 bg-slate-900 flex-shrink-0">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.zip,.rar,.7z,.tar,.gz,.xlsx,.xls,.pptx,.ppt,.csv,.json,.xml,.md"
        />
        
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3 h-full">
          <Button 
            variant="ghost" 
            size="sm" 
            type="button"
            onClick={handleFileSelect}
            title="Gửi file"
            disabled={uploadingFile}
            className={uploadingFile ? 'opacity-50' : ''}
          >
            {uploadingFile ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
          </Button>
          
          <div className="flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500"
              disabled={sendingMessage}
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            type="button" 
            onClick={toggleEmojiPicker}
            className={`${showEmojiPicker ? 'bg-slate-600' : ''}`}
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!messageText.trim() || sendingMessage}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {sendingMessage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,application/pdf"
          />
        </form>
      </div>

      {/* Emoji Picker - Conditional rendering */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-20 emoji-picker-container">
          <EmojiPicker 
            onEmojiSelect={handleEmojiSelect} 
            className="shadow-lg border border-slate-600"
          />
        </div>
      )}
    </div>
  );
};

export default ConversationView;
