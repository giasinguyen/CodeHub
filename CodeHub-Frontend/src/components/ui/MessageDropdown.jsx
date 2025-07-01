import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Search, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { chatHistoryAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const MessageDropdown = ({ isOpen, onToggle }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load conversations when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatHistoryAPI.getConversations(0, 10);
      if (response?.data?.content) {
        setConversations(response.data.content);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    onToggle(false);
    navigate(`/messages/${conversation.participantUsername}`);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participantFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Vừa xong' : `${diffInMinutes}p`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays < 7 ? `${diffInDays}d` : date.toLocaleDateString('vi-VN');
    }
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return 'Không có tin nhắn';
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-3 w-96 bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-2xl border border-slate-700 dark:border-slate-700 light:border-gray-200 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">
                Tin nhắn
              </h3>
              <Link
                to="/messages"
                onClick={() => onToggle(false)}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                Xem tất cả
              </Link>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 dark:bg-slate-700 light:bg-gray-100 text-white dark:text-white light:text-gray-900 placeholder-slate-400 dark:placeholder-slate-400 light:placeholder-gray-500 rounded-lg border border-slate-600 dark:border-slate-600 light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div>
                <p className="text-slate-400 text-sm mt-2">Đang tải...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">
                  {searchTerm ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có tin nhắn nào'}
                </p>
                {!searchTerm && (
                  <Link
                    to="/developers"
                    onClick={() => onToggle(false)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-block"
                  >
                    Khám phá nhà phát triển
                  </Link>
                )}
              </div>
            ) : (
              <div className="py-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.chatId}
                    onClick={() => handleConversationClick(conversation)}
                    className="flex items-center p-3 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 dark:border-slate-600 light:border-gray-300">
                        {conversation.participantAvatarUrl ? (
                          <img
                            src={conversation.participantAvatarUrl}
                            alt={conversation.participantUsername}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center ${
                            conversation.participantAvatarUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white dark:text-white light:text-gray-900 truncate">
                          {conversation.participantFullName || conversation.participantUsername}
                        </h4>
                        <div className="flex items-center ml-2">
                          {conversation.unreadCount > 0 && (
                            <span className="bg-cyan-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center mr-2">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500 flex-shrink-0">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 truncate ${
                        conversation.unreadCount > 0 
                          ? 'text-white dark:text-white light:text-gray-900 font-medium' 
                          : 'text-slate-400 dark:text-slate-400 light:text-gray-500'
                      }`}>
                        {conversation.lastMessageSender === user?.username ? 'Bạn: ' : ''}
                        {truncateMessage(conversation.lastMessage)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-700 dark:border-slate-700 light:border-gray-200">
            <Link
              to="/messages"
              onClick={() => onToggle(false)}
              className="w-full flex items-center justify-center py-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 transition-colors duration-150"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Mở trang tin nhắn
            </Link>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MessageDropdown;
