import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Search, 
  MoreVertical, 
  Users,
  Filter,
  Archive,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatHistoryAPI } from '../../services/api';
import { Button, Input, Loading } from '../ui';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ConversationList = ({ onSelectConversation, selectedChatId }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, [filter]);

  const loadConversations = async (pageNum = 0, append = false) => {
    try {
      setLoading(!append);
      const response = await chatHistoryAPI.getConversations(pageNum, 20);
      
      if (response.data) {
        const newConversations = response.data.content || [];
        
        if (append) {
          setConversations(prev => [...prev, ...newConversations]);
        } else {
          setConversations(newConversations);
        }
        
        setHasMore(!response.data.last);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadConversations(page + 1, true);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // TODO: Implement search API
  };

  const filteredConversations = conversations.filter(conv => {
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const participantName = conv.participantUsername?.toLowerCase() || '';
      const roomName = conv.roomName?.toLowerCase() || '';
      const lastMessage = conv.lastMessage?.toLowerCase() || '';
      
      if (!participantName.includes(searchLower) && 
          !roomName.includes(searchLower) && 
          !lastMessage.includes(searchLower)) {
        return false;
      }
    }

    // Apply status filter
    if (filter === 'unread') {
      return conv.unreadCount > 0;
    }
    
    return true;
  });

  const getConversationDisplayName = (conversation) => {
    if (conversation.roomType === 'GROUP') {
      return conversation.roomName;
    }
    return conversation.participantFullName || conversation.participantUsername;
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.roomType === 'GROUP') {
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
      );
    }
    
    return conversation.participantAvatarUrl ? (
      <img
        src={conversation.participantAvatarUrl}
        alt={conversation.participantUsername}
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
        <span className="text-white font-semibold">
          {(conversation.participantUsername || 'U')[0].toUpperCase()}
        </span>
      </div>
    );
  };

  const handleConversationClick = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-cyan-400" />
            Messages
          </h2>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {filterOption.label}
              {filterOption.key === 'unread' && (
                <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {conversations.filter(c => c.unreadCount > 0).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-slate-400 text-sm">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start a conversation with someone to see it here'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.chatId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ backgroundColor: 'rgb(51 65 85 / 0.5)' }}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedChatId === conversation.chatId 
                    ? 'bg-cyan-500/10 border-r-2 border-cyan-500' 
                    : 'hover:bg-slate-700/50'
                }`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {getConversationAvatar(conversation)}
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {getConversationDisplayName(conversation)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {conversation.lastMessageTime && (
                          <span className="text-xs text-slate-400">
                            {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Last Message */}
                    {conversation.lastMessage && (
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-slate-400 truncate">
                          {conversation.lastMessageSender === user?.username ? 'You: ' : ''}
                          {conversation.lastMessage}
                        </p>
                      </div>
                    )}

                    {/* Group Chat Info */}
                    {conversation.roomType === 'GROUP' && (
                      <p className="text-xs text-slate-500 mt-1">
                        {conversation.totalParticipants} participants
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && filteredConversations.length > 0 && (
          <div className="p-4 text-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
