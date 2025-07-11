import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Minimize2,
  Maximize2,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { Button, Input } from '../ui';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { chatHistoryAPI } from '../../services/api';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import EmojiPicker from './EmojiPicker';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const {
    activeChat,
    messages,
    sendMessage,
    markAsRead,
    sendTypingNotification,
    typingUsers,
    connected,
    chatWindowOpen,
    chatWindowMinimized,
    closeChatWindow,
    minimizeChatWindow,
    maximizeChatWindow,
    loadMessages
  } = useChat();
  
  const { user: currentUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const chatMessages = useMemo(() => {
    const msgs = activeChat ? (messages[activeChat.chatId] || []) : [];
    console.log('🔍 [ChatWindow] Chat messages for', activeChat?.chatId, ':', msgs);
    return msgs;
  }, [activeChat, messages]);
  const currentTypingUsers = activeChat ? (typingUsers[activeChat.chatId] || []) : [];
  const otherTypingUsers = currentTypingUsers.filter(username => username !== currentUser?.username);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Load messages when activeChat changes
  useEffect(() => {
    if (activeChat && activeChat.chatId) {
      console.log('🔄 [ChatWindow] Loading messages for chat:', activeChat.chatId);
      loadMessages(activeChat.chatId, 0);
    }
  }, [activeChat, loadMessages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    console.log('🐛 [ChatWindow] useEffect triggered with:', {
      chatWindowOpen,
      activeChat: activeChat?.chatId,
      chatWindowMinimized
    });
    
    if (chatWindowOpen && activeChat && !chatWindowMinimized) {
      console.log('🐛 [ChatWindow] Marking messages as read for chat:', activeChat.chatId);
      
      // Debug unread messages before marking as read
      chatHistoryAPI.debugUnreadMessages(activeChat.chatId)
        .then(response => {
          console.log('🐛 [ChatWindow] Debug info BEFORE markAsRead:', response.data);
        })
        .catch(error => console.warn('Debug call failed:', error));
      
      markAsRead(activeChat.chatId).then(() => {
        console.log('🐛 [ChatWindow] markAsRead completed successfully');
        // Debug unread messages after marking as read
        setTimeout(() => {
          chatHistoryAPI.debugUnreadMessages(activeChat.chatId)
            .then(response => {
              console.log('🐛 [ChatWindow] Debug info AFTER markAsRead:', response.data);
            })
            .catch(error => console.warn('Debug call failed:', error));
        }, 1000);
      }).catch(error => {
        console.error('🐛 [ChatWindow] markAsRead failed:', error);
      });
    } else {
      console.log('🐛 [ChatWindow] Conditions not met for marking as read');
    }
  }, [chatWindowOpen, activeChat, chatWindowMinimized, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeChat) return;

    const messageToSend = messageText.trim();
    setMessageText(''); // Clear input immediately for better UX
    stopTyping();

    try {
      await sendMessage({
        content: messageToSend,
        messageType: 'TEXT',
        chatId: activeChat.chatId
      });

      console.log('✅ [ChatWindow] Message sent successfully');
    } catch (error) {
      console.error('❌ [ChatWindow] Error sending message:', error);
      // Restore message text on error
      setMessageText(messageToSend);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (value) => {
    setMessageText(value);

    if (!activeChat) return;

    // Start typing
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      sendTypingNotification(activeChat.chatId, true);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (isTyping && activeChat) {
      setIsTyping(false);
      sendTypingNotification(activeChat.chatId, false);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Emoji handlers
  const handleEmojiSelect = (emoji) => {
    console.log('✅ [ChatWindow] Emoji selected:', emoji);
    setMessageText(prevText => {
      const newText = prevText + emoji;
      console.log('📝 [ChatWindow] Message text updated:', newText);
      return newText;
    });
    setShowEmojiPicker(false);
    console.log('🎭 [ChatWindow] Emoji picker closed');
  };

  const toggleEmojiPicker = () => {
    console.log('🎭 [ChatWindow] Toggle emoji picker clicked. Current state:', showEmojiPicker);
    setShowEmojiPicker(!showEmojiPicker);
    console.log('🎭 [ChatWindow] New state will be:', !showEmojiPicker);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getOtherParticipant = () => {
    if (!activeChat) return null;
    
    // Handle different participant data structures
    if (activeChat.participantUsername) {
      return {
        username: activeChat.participantUsername,
        fullName: activeChat.participantFullName,
        avatarUrl: activeChat.participantAvatarUrl,
        isOnline: activeChat.isOnline
      };
    }
    
    if (activeChat.participants) {
      return activeChat.participants.find(
        participant => participant.userId !== currentUser?.id
      );
    }
    
    return null;
  };

  const otherParticipant = getOtherParticipant();

  // Debug emoji picker state changes
  useEffect(() => {
    console.log('🎭 [ChatWindow] showEmojiPicker state changed to:', showEmojiPicker);
  }, [showEmojiPicker]);

  // File upload handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomId', activeChat.chatId); // Use roomId instead of chatId
      formData.append('messageType', 'FILE'); // Add required messageType parameter

      console.log('📎 [ChatWindow] Uploading file:', file.name, 'Size:', file.size, 'ChatId:', activeChat.chatId);
      
      // Send file message
      await chatHistoryAPI.sendFileMessage(formData);
      
      toast.success('File uploaded successfully');
      console.log('✅ [ChatWindow] File uploaded successfully');
      
      // Clear file selection
      setSelectedFile(null);
      e.target.value = '';
      
    } catch (error) {
      console.error('❌ [ChatWindow] Error uploading file:', error);
      toast.error('Failed to upload file');
      setSelectedFile(null);
      e.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!chatWindowOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 transition-all duration-300 ${
          chatWindowMinimized ? 'w-80 h-auto' : 'w-96 h-[600px]'
        } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            {otherParticipant && (
              <>
                <div className="relative">
                  <img
                    src={otherParticipant.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant.username}`}
                    alt={otherParticipant.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-slate-800 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">
                    {otherParticipant.fullName || otherParticipant.username}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {connected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={chatWindowMinimized ? maximizeChatWindow : minimizeChatWindow}
              className="p-1.5 h-auto"
            >
              {chatWindowMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChatWindow}
              className="p-1.5 h-auto text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!chatWindowMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              {!activeChat ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <p>No chat selected</p>
                    <p className="text-sm">Select a chat to start messaging</p>
                  </div>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isOwnMessage={message.senderId === currentUser?.id}
                      showAvatar={
                        index === 0 ||
                        chatMessages[index - 1]?.senderId !== message.senderId
                      }
                      showTimestamp={true}
                    />
                  ))}
                  
                  {/* Typing Indicator */}
                  {otherTypingUsers.length > 0 && (
                    <TypingIndicator username={otherTypingUsers[0]} />
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            {activeChat && (
              <div className="p-4 border-t border-slate-700 bg-slate-800/90 backdrop-blur-sm">
                {/* File Upload Progress */}
                {isUploading && selectedFile && (
                  <div className="mb-3 p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    </div>
                    <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-blue-400 mt-1">Uploading...</p>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={messageText}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="pr-20 resize-none"
                      disabled={!connected || isUploading}
                    />
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div 
                        ref={emojiPickerRef}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-80"
                      >
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                      </div>
                    )}
                    
                    <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={toggleEmojiPicker}
                        className="p-1 h-auto text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
                        style={{ background: 'none', border: 'none' }}
                        disabled={isUploading}
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={handleFileSelect}
                        disabled={isUploading}
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="*/*"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!messageText.trim() || !connected || isUploading}
                    size="sm"
                    className="px-3 py-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                
                {!connected && (
                  <p className="text-xs text-amber-400 mt-2">
                    Connection lost. Messages will be sent when reconnected.
                  </p>
                )}
                
                {isUploading && (
                  <p className="text-xs text-blue-400 mt-2">
                    Uploading file... Please wait.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AnimatePresence>
  );
};

export default ChatWindow;
