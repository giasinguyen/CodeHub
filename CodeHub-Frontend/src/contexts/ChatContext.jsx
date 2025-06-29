import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';
import webSocketService from '../services/webSocketService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  chatRooms: [],
  activeChat: null,
  messages: {},
  unreadCounts: {},
  typingUsers: {},
  loading: false,
  error: null,
  connected: false,
  searchTerm: '',
  searchResults: [],
  chatWindowOpen: false,
  chatWindowMinimized: false
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CHAT_ROOMS: 'SET_CHAT_ROOMS',
  ADD_CHAT_ROOM: 'ADD_CHAT_ROOM',
  UPDATE_CHAT_ROOM: 'UPDATE_CHAT_ROOM',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_TYPING_USERS: 'SET_TYPING_USERS',
  SET_CONNECTED: 'SET_CONNECTED',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  CLEAR_MESSAGES: 'CLEAR_MESSAGES',
  MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
  OPEN_CHAT_WINDOW: 'OPEN_CHAT_WINDOW',
  CLOSE_CHAT_WINDOW: 'CLOSE_CHAT_WINDOW',
  MINIMIZE_CHAT_WINDOW: 'MINIMIZE_CHAT_WINDOW',
  MAXIMIZE_CHAT_WINDOW: 'MAXIMIZE_CHAT_WINDOW'
};

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_CHAT_ROOMS:
      return { ...state, chatRooms: action.payload, loading: false };
    
    case ActionTypes.ADD_CHAT_ROOM:
      return {
        ...state,
        chatRooms: [action.payload, ...state.chatRooms.filter(room => room.id !== action.payload.id)]
      };
    
    case ActionTypes.UPDATE_CHAT_ROOM:
      return {
        ...state,
        chatRooms: state.chatRooms.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload } : room
        )
      };
    
    case ActionTypes.SET_ACTIVE_CHAT:
      return { ...state, activeChat: action.payload };
    
    case ActionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages
        }
      };
    
    case ActionTypes.ADD_MESSAGE: {
      const chatId = action.payload.chatId;
      const existingMessages = state.messages[chatId] || [];
      const messageExists = existingMessages.some(msg => msg.id === action.payload.id);
      
      if (messageExists) {
        return state;
      }
      
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, action.payload]
        }
      };
    }
    
    case ActionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: state.messages[action.payload.chatId]?.map(msg =>
            msg.id === action.payload.id ? { ...msg, ...action.payload } : msg
          ) || []
        }
      };
    
    case ActionTypes.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.chatId]: action.payload.count
        }
      };
    
    case ActionTypes.SET_TYPING_USERS:
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatId]: action.payload.users
        }
      };
    
    case ActionTypes.SET_CONNECTED:
      return { ...state, connected: action.payload };
    
    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case ActionTypes.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    
    case ActionTypes.CLEAR_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload]: []
        }
      };
    
    case ActionTypes.MARK_MESSAGES_READ:
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload]: 0
        }
      };
    
    case ActionTypes.OPEN_CHAT_WINDOW:
      return {
        ...state,
        chatWindowOpen: true,
        chatWindowMinimized: false
      };
    
    case ActionTypes.CLOSE_CHAT_WINDOW:
      return {
        ...state,
        chatWindowOpen: false,
        chatWindowMinimized: false,
        activeChat: null
      };
    
    case ActionTypes.MINIMIZE_CHAT_WINDOW:
      return {
        ...state,
        chatWindowMinimized: true
      };
    
    case ActionTypes.MAXIMIZE_CHAT_WINDOW:
      return {
        ...state,
        chatWindowMinimized: false
      };
    
    default:
      return state;
  }
};

// Context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, user]);

  // Initialize WebSocket
  const initializeWebSocket = useCallback(async () => {
    try {
      await webSocketService.connect();
      dispatch({ type: ActionTypes.SET_CONNECTED, payload: true });

      // Subscribe to user's private messages
      await webSocketService.subscribeToUserMessages(handleNewMessage);

      console.log('✅ [Chat] WebSocket initialized');
    } catch (error) {
      console.error('❌ [Chat] WebSocket initialization failed:', error);
      dispatch({ type: ActionTypes.SET_CONNECTED, payload: false });
    }
  }, []);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
    dispatch({ type: ActionTypes.SET_CONNECTED, payload: false });
  }, []);

  // Handle new messages
  const handleNewMessage = useCallback((message) => {
    console.log('📨 [Chat] New message received:', message);
    
    dispatch({ type: ActionTypes.ADD_MESSAGE, payload: message });
    
    // Update chat room's last message
    dispatch({
      type: ActionTypes.UPDATE_CHAT_ROOM,
      payload: {
        chatId: message.chatId,
        lastMessage: message,
        updatedAt: message.createdAt
      }
    });

    // Show notification if not in active chat
    if (state.activeChat?.chatId !== message.chatId) {
      toast.success(`New message from ${message.senderUsername}`);
    }
  }, [state.activeChat]);

  // Handle typing notifications
  const handleTypingNotification = useCallback((notification) => {
    const { chatId, username, isTyping } = notification;
    
    dispatch({
      type: ActionTypes.SET_TYPING_USERS,
      payload: {
        chatId,
        users: isTyping 
          ? [...(state.typingUsers[chatId] || []), username]
          : (state.typingUsers[chatId] || []).filter(u => u !== username)
      }
    });
  }, [state.typingUsers]);

  // Load chat rooms
  const loadChatRooms = useCallback(async (page = 0, size = 20) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await chatAPI.getChatRooms(page, size);
      dispatch({ type: ActionTypes.SET_CHAT_ROOMS, payload: response.data.content || [] });
    } catch (error) {
      console.error('❌ [Chat] Error loading chat rooms:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  }, []);

  // Create or get private chat
  const createPrivateChat = useCallback(async (participantUserId) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      const response = await chatAPI.createPrivateChat(participantUserId);
      const chatRoom = response.data;
      
      dispatch({ type: ActionTypes.ADD_CHAT_ROOM, payload: chatRoom });
      
      return chatRoom;
    } catch (error) {
      console.error('❌ [Chat] Error creating private chat:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Set active chat
  const setActiveChat = useCallback(async (chatRoom) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_CHAT, payload: chatRoom });
    
    if (chatRoom) {
      // Subscribe to chat room messages and typing notifications
      await webSocketService.subscribeToChatRoom(chatRoom.chatId, handleNewMessage);
      await webSocketService.subscribeToTyping(chatRoom.chatId, handleTypingNotification);
      
      // Load messages if not already loaded
      if (!state.messages[chatRoom.chatId]) {
        await loadMessages(chatRoom.chatId);
      }
      
      // Mark messages as read
      await markAsRead(chatRoom.chatId);
    }
  }, [state.messages, handleNewMessage, handleTypingNotification]);

  // Load messages
  const loadMessages = useCallback(async (chatId, page = 0, size = 50) => {
    try {
      const response = await chatAPI.getChatMessages(chatId, page, size);
      const messages = response.data.content || [];
      
      dispatch({
        type: ActionTypes.SET_MESSAGES,
        payload: { chatId, messages: messages.reverse() }
      });
    } catch (error) {
      console.error('❌ [Chat] Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (messageData) => {
    try {
      if (state.connected) {
        // Send via WebSocket
        await webSocketService.sendChatMessage(messageData);
      } else {
        // Fallback to REST API
        const response = await chatAPI.sendMessage(messageData);
        handleNewMessage(response.data);
      }
    } catch (error) {
      console.error('❌ [Chat] Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, [state.connected, handleNewMessage]);

  // Mark messages as read
  const markAsRead = useCallback(async (chatId) => {
    try {
      await chatAPI.markAsRead(chatId);
      dispatch({ type: ActionTypes.MARK_MESSAGES_READ, payload: chatId });
    } catch (error) {
      console.error('❌ [Chat] Error marking messages as read:', error);
    }
  }, []);

  // Send typing notification
  const sendTypingNotification = useCallback(async (chatId, isTyping) => {
    try {
      if (state.connected) {
        if (isTyping) {
          await webSocketService.sendTypingNotification(chatId);
        } else {
          await webSocketService.sendStopTypingNotification(chatId);
        }
      }
    } catch (error) {
      console.error('❌ [Chat] Error sending typing notification:', error);
    }
  }, [state.connected]);

  // Search chat rooms
  const searchChatRooms = useCallback(async (searchTerm) => {
    dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: searchTerm });
    
    if (!searchTerm.trim()) {
      dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: [] });
      return;
    }
    
    try {
      const response = await chatAPI.searchChatRooms(searchTerm);
      dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: response.data || [] });
    } catch (error) {
      console.error('❌ [Chat] Error searching chat rooms:', error);
      dispatch({ type: ActionTypes.SET_SEARCH_RESULTS, payload: [] });
    }
  }, []);

  // Chat window management
  const openChatWindow = useCallback(() => {
    dispatch({ type: ActionTypes.OPEN_CHAT_WINDOW });
  }, []);

  const closeChatWindow = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_CHAT_WINDOW });
  }, []);

  const minimizeChatWindow = useCallback(() => {
    dispatch({ type: ActionTypes.MINIMIZE_CHAT_WINDOW });
  }, []);

  const maximizeChatWindow = useCallback(() => {
    dispatch({ type: ActionTypes.MAXIMIZE_CHAT_WINDOW });
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    loadChatRooms,
    createPrivateChat,
    setActiveChat,
    loadMessages,
    sendMessage,
    markAsRead,
    sendTypingNotification,
    searchChatRooms,
    
    // Chat window management
    openChatWindow,
    closeChatWindow,
    minimizeChatWindow,
    maximizeChatWindow,
    
    // WebSocket actions
    initializeWebSocket,
    disconnectWebSocket
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
