import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    maximizeChatWindow
  } = useChat();
  
  const { user: currentUser } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const chatMessages = useMemo(() => 
    activeChat ? (messages[activeChat.chatId] || []) : []
  , [activeChat, messages]);
  const currentTypingUsers = activeChat ? (typingUsers[activeChat.chatId] || []) : [];
  const otherTypingUsers = currentTypingUsers.filter(username => username !== currentUser?.username);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

    try {
      await sendMessage({
        content: messageText.trim(),
        messageType: 'TEXT',
        chatId: activeChat.chatId
      });

      setMessageText('');
      stopTyping();
    } catch (error) {
      console.error('❌ [ChatWindow] Error sending message:', error);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const getOtherParticipant = () => {
    if (!activeChat || !activeChat.participants) return null;
    
    return activeChat.participants.find(
      participant => participant.userId !== currentUser?.id
    );
  };

  const otherParticipant = getOtherParticipant();

  if (!chatWindowOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          height: chatWindowMinimized ? 'auto' : '600px'
        }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 ${
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
                      isOwn={message.senderId === currentUser?.id}
                      showAvatar={
                        index === 0 ||
                        chatMessages[index - 1]?.senderId !== message.senderId
                      }
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
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={messageText}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="pr-20 resize-none"
                      disabled={!connected}
                    />
                    
                    <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!messageText.trim() || !connected}
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
              </div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;
