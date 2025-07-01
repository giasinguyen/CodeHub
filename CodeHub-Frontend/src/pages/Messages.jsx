import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Search,
  Plus,
  Archive,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { chatHistoryAPI } from '../services/api';
import { Button, Card } from '../components/ui';
import ConversationList from '../components/chat/ConversationList';
import ConversationViewNew from '../components/chat/ConversationView';
import { useChat } from '../hooks/useChat';
import toast from 'react-hot-toast';

const Messages = () => {
  const { username } = useParams(); // For direct message links like /messages/username
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendMessage } = useChat();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chat statistics
  useEffect(() => {
    loadChatStats();
  }, []);

  // Handle direct message from URL
  useEffect(() => {
    if (username && user) {
      loadConversationByUsername(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, user]);

  const loadChatStats = async () => {
    try {
      const response = await chatHistoryAPI.getChatStats();
      setChatStats(response.data);
    } catch (error) {
      console.error('Failed to load chat stats:', error);
    }
  };

  const loadConversationByUsername = async (targetUsername) => {
    try {
      const response = await chatHistoryAPI.getConversationHistory(targetUsername);
      
      // Create a conversation object from the response
      const conversation = {
        chatId: response.data.chatId,
        participantUsername: targetUsername,
        participantId: response.data.otherParticipant.id,
        participantFullName: response.data.otherParticipant.fullName,
        participantAvatarUrl: response.data.otherParticipant.avatarUrl,
        isOnline: response.data.otherParticipant.isOnline,
        lastSeenAt: response.data.otherParticipant.lastSeenAt,
        unreadCount: response.data.unreadCount,
        roomType: 'PRIVATE'
      };
      
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast.error(`No conversation found with ${targetUsername}`);
      navigate('/messages'); // Redirect to main messages page
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Update URL for deep linking
    if (conversation.participantUsername) {
      navigate(`/messages/${conversation.participantUsername}`, { replace: true });
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    navigate('/messages', { replace: true });
  };

  const handleSendMessage = async (messageData) => {
    await sendMessage(messageData);
    // Optionally refresh the conversation
  };

  const handleNewMessage = () => {
    // TODO: Open user selector modal
    toast.info('User selector coming soon!');
  };

  // Mobile view - show either list or conversation
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {selectedConversation ? (
          <ConversationViewNew
            conversation={selectedConversation}
            onBack={handleBackToList}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-screen">
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedChatId={selectedConversation?.chatId}
            />
          </div>
        )}
      </div>
    );
  }

  // Desktop view - split layout
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <MessageCircle className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              {chatStats && (
                <p className="text-slate-400 text-sm">
                  {chatStats.totalConversations} conversations • {chatStats.unreadMessages} unread
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewMessage}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {chatStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-cyan-400 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-white">{chatStats.totalConversations}</p>
                  <p className="text-slate-400 text-sm">Total Conversations</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{chatStats.activeConversations}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{chatStats.activeConversations}</p>
                  <p className="text-slate-400 text-sm">Active Chats</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{chatStats.unreadMessages}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{chatStats.unreadMessages}</p>
                  <p className="text-slate-400 text-sm">Unread Messages</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{Math.floor(chatStats.totalMessages / 1000)}K</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{chatStats.totalMessages}</p>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Chat Interface */}
        <Card className="h-[600px] flex overflow-hidden">
          {/* Mobile: Show either conversation list or chat view */}
          {isMobile ? (
            selectedConversation ? (
              <div className="w-full">
                <ConversationViewNew
                  conversation={selectedConversation}
                  onBack={handleBackToList}
                  onSendMessage={handleSendMessage}
                />
              </div>
            ) : (
              <div className="w-full">
                <ConversationList
                  onSelectConversation={handleSelectConversation}
                  selectedChatId={selectedConversation?.chatId}
                />
              </div>
            )
          ) : (
            <>
              {/* Desktop: Show both sidebar and chat view */}
              <div className="w-1/3 border-r border-slate-700 min-w-[300px]">
                <ConversationList
                  onSelectConversation={handleSelectConversation}
                  selectedChatId={selectedConversation?.chatId}
                />
              </div>

              <div className="flex-1 min-w-0">
                <ConversationViewNew
                  conversation={selectedConversation}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
