import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '../ui';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ChatButton = ({ recipientId, recipientUsername, recipientName, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { createPrivateChat, setActiveChat, openChatWindow } = useChat();
  const { user: currentUser } = useAuth();

  // Don't show chat button for own profile
  if (!recipientId || !currentUser || currentUser.id === recipientId) {
    return null;
  }

  const handleStartChat = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔄 [ChatButton] Starting chat with user:', { recipientId, recipientUsername });
      
      // Create or get existing private chat
      const chatRoom = await createPrivateChat(recipientId);
      
      // Set as active chat
      await setActiveChat(chatRoom);
      
      // Open chat window
      openChatWindow();
      
      // Show success message
      toast.success(`Chat started with ${recipientName || recipientUsername || 'user'}`);
      
      console.log('✅ [ChatButton] Chat created successfully:', chatRoom);
      
    } catch (error) {
      console.error('❌ [ChatButton] Error starting chat:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Starting...</span>
        </>
      ) : (
        <>
          <MessageCircle className="w-4 h-4" />
          <span>Message</span>
        </>
      )}
    </Button>
  );
};

export default ChatButton;
